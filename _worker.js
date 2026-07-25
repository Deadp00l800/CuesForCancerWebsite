/* Cues for Cancer Inc. — admin backend
   Serves the static site (via env.ASSETS) and adds:
   - Password-protected /admin dashboard (stories, press, honoree "cues")
   - /media/* file serving from R2
   - JSON API under /api/* (public reads) and /api/admin/* (auth required)
   Required bindings on this Worker: CUES_DATA (KV), MEDIA (R2),
   ADMIN_PASSWORD (secret), SESSION_SECRET (secret).
   Secrets Store bindings resolved via resolveSecret() below. */

const SESSION_COOKIE = 'cfc_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const DEFAULT_HONOREES = [
  { slug: 'darrell', name: 'Darrell', hashtag: '#CuesForDarrell', photoKey: '', story: '', cues: [] },
  { slug: 'nathan', name: 'Nathan', hashtag: '#CuesForNathan', photoKey: '', story: '', cues: [] },
  { slug: 'gabby', name: 'Gabby', hashtag: '#CuesForGabby', photoKey: '', story: '', cues: [] },
  { slug: 'sarah', name: 'Sarah', hashtag: '#CuesForSarah', photoKey: '', story: '', cues: [] },
];

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

async function hmac(data, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

// Cloudflare Secrets Store bindings expose secrets via an async .get() method
// instead of a plain string. Support both so local `--var` testing still works.
async function resolveSecret(binding) {
  if (binding && typeof binding.get === 'function') return await binding.get();
  return binding || '';
}

async function makeSessionCookie(env) {
  const sessionSecret = await resolveSecret(env.SESSION_SECRET);
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const sig = await hmac(String(expires), sessionSecret);
  return `${SESSION_COOKIE}=${expires}.${sig}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function isAuthed(request, env) {
  const cookie = getCookie(request, SESSION_COOKIE);
  if (!cookie) return false;
  const [expiresStr, sig] = cookie.split('.');
  if (!expiresStr || !sig) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const sessionSecret = await resolveSecret(env.SESSION_SECRET);
  const expectedSig = await hmac(expiresStr, sessionSecret);
  return timingSafeEqual(sig, expectedSig);
}

async function getJSON(env, key, fallback) {
  const raw = await env.CUES_DATA.get(key);
  return raw ? JSON.parse(raw) : fallback;
}

async function putJSON(env, key, value) {
  await env.CUES_DATA.put(key, JSON.stringify(value));
}

function uid() {
  return crypto.randomUUID();
}

function missingBindingResponse(name) {
  return jsonResponse({ error: `${name} binding is not configured on this Worker yet. Add it under Settings > Bindings.` }, 500);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      // ---- Page shells (client-side JS handles the rest) ----
      // Cloudflare's static asset server 307-redirects "/foo.html" to the clean
      // URL "/foo", so we request the clean path here to get the content directly.
      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        return env.ASSETS.fetch(new Request(new URL('/admin', request.url), request));
      }
      if (pathname.startsWith('/honoree/')) {
        return env.ASSETS.fetch(new Request(new URL('/honoree', request.url), request));
      }

      // ---- Media serving from R2 ----
      if (pathname.startsWith('/media/')) {
        if (!env.MEDIA) return missingBindingResponse('MEDIA (R2 bucket)');
        const key = pathname.slice(1); // "media/xyz.jpg"
        const obj = await env.MEDIA.get(key);
        if (!obj) return new Response('Not found', { status: 404 });
        const headers = new Headers();
        obj.writeHttpMetadata(headers);
        headers.set('etag', obj.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return new Response(obj.body, { headers });
      }

      // ---- Public read API ----
      if (pathname === '/api/stories' && request.method === 'GET') {
        if (!env.CUES_DATA) return missingBindingResponse('CUES_DATA (KV namespace)');
        return jsonResponse(await getJSON(env, 'stories', []));
      }
      if (pathname === '/api/press' && request.method === 'GET') {
        if (!env.CUES_DATA) return missingBindingResponse('CUES_DATA (KV namespace)');
        return jsonResponse(await getJSON(env, 'press', []));
      }
      if (pathname === '/api/honorees' && request.method === 'GET') {
        if (!env.CUES_DATA) return missingBindingResponse('CUES_DATA (KV namespace)');
        return jsonResponse(await getJSON(env, 'honorees', DEFAULT_HONOREES));
      }
      if (/^\/api\/honorees\/[^/]+$/.test(pathname) && request.method === 'GET') {
        if (!env.CUES_DATA) return missingBindingResponse('CUES_DATA (KV namespace)');
        const slug = pathname.split('/').pop();
        const honorees = await getJSON(env, 'honorees', DEFAULT_HONOREES);
        const honoree = honorees.find((h) => h.slug === slug);
        if (!honoree) return jsonResponse({ error: 'Not found' }, 404);
        return jsonResponse(honoree);
      }

      // ---- Admin auth ----
      if (pathname === '/api/admin/login' && request.method === 'POST') {
        const [adminPassword, sessionSecret] = await Promise.all([
          resolveSecret(env.ADMIN_PASSWORD),
          resolveSecret(env.SESSION_SECRET),
        ]);
        if (!adminPassword || !sessionSecret) {
          return jsonResponse({ error: 'Admin password / session secret not configured on this Worker yet.' }, 500);
        }
        const body = await request.json().catch(() => ({}));
        if (!timingSafeEqual(body.password, adminPassword)) {
          return jsonResponse({ error: 'Incorrect password' }, 401);
        }
        const cookie = await makeSessionCookie(env);
        return jsonResponse({ success: true }, 200, { 'Set-Cookie': cookie });
      }
      if (pathname === '/api/admin/logout' && request.method === 'POST') {
        return jsonResponse({ success: true }, 200, { 'Set-Cookie': clearSessionCookie() });
      }
      if (pathname === '/api/admin/check' && request.method === 'GET') {
        return jsonResponse({ authed: await isAuthed(request, env) });
      }

      // ---- Everything else under /api/admin/* requires a valid session ----
      if (pathname.startsWith('/api/admin/')) {
        if (!env.CUES_DATA) return missingBindingResponse('CUES_DATA (KV namespace)');
        if (!(await isAuthed(request, env))) return jsonResponse({ error: 'Unauthorized' }, 401);

        // Stories
        if (pathname === '/api/admin/stories' && request.method === 'POST') {
          const body = await request.json();
          const stories = await getJSON(env, 'stories', []);
          const story = {
            id: uid(),
            title: body.title || '',
            quote: body.quote || '',
            author: body.author || '',
            authorTitle: body.authorTitle || '',
            createdAt: Date.now(),
          };
          stories.unshift(story);
          await putJSON(env, 'stories', stories);
          return jsonResponse(story, 201);
        }
        if (/^\/api\/admin\/stories\/[^/]+$/.test(pathname) && (request.method === 'PUT' || request.method === 'DELETE')) {
          const id = pathname.split('/').pop();
          let stories = await getJSON(env, 'stories', []);
          if (request.method === 'DELETE') {
            stories = stories.filter((s) => s.id !== id);
          } else {
            const body = await request.json();
            stories = stories.map((s) => (s.id === id ? { ...s, ...body, id } : s));
          }
          await putJSON(env, 'stories', stories);
          return jsonResponse({ success: true });
        }

        // Press releases
        if (pathname === '/api/admin/press' && request.method === 'POST') {
          const body = await request.json();
          const press = await getJSON(env, 'press', []);
          const item = {
            id: uid(),
            title: body.title || '',
            outlet: body.outlet || '',
            date: body.date || '',
            url: body.url || '',
            summary: body.summary || '',
            createdAt: Date.now(),
          };
          press.unshift(item);
          await putJSON(env, 'press', press);
          return jsonResponse(item, 201);
        }
        if (/^\/api\/admin\/press\/[^/]+$/.test(pathname) && (request.method === 'PUT' || request.method === 'DELETE')) {
          const id = pathname.split('/').pop();
          let press = await getJSON(env, 'press', []);
          if (request.method === 'DELETE') {
            press = press.filter((p) => p.id !== id);
          } else {
            const body = await request.json();
            press = press.map((p) => (p.id === id ? { ...p, ...body, id } : p));
          }
          await putJSON(env, 'press', press);
          return jsonResponse({ success: true });
        }

        // Honorees: update profile (name/hashtag/story/photoKey)
        if (/^\/api\/admin\/honorees\/[^/]+$/.test(pathname) && request.method === 'PUT') {
          const slug = pathname.split('/').pop();
          const body = await request.json();
          let honorees = await getJSON(env, 'honorees', DEFAULT_HONOREES);
          honorees = honorees.map((h) => (h.slug === slug ? { ...h, ...body, slug } : h));
          await putJSON(env, 'honorees', honorees);
          return jsonResponse({ success: true });
        }
        // Honorees: add a cue (tribute)
        if (/^\/api\/admin\/honorees\/[^/]+\/cues$/.test(pathname) && request.method === 'POST') {
          const slug = pathname.split('/')[4];
          const body = await request.json();
          const cue = {
            id: uid(),
            author: body.author || '',
            theater: body.theater || '',
            message: body.message || '',
            createdAt: Date.now(),
          };
          let honorees = await getJSON(env, 'honorees', DEFAULT_HONOREES);
          honorees = honorees.map((h) => (h.slug === slug ? { ...h, cues: [cue, ...(h.cues || [])] } : h));
          await putJSON(env, 'honorees', honorees);
          return jsonResponse(cue, 201);
        }
        // Honorees: delete a cue
        if (/^\/api\/admin\/honorees\/[^/]+\/cues\/[^/]+$/.test(pathname) && request.method === 'DELETE') {
          const parts = pathname.split('/');
          const slug = parts[4];
          const cueId = parts[6];
          let honorees = await getJSON(env, 'honorees', DEFAULT_HONOREES);
          honorees = honorees.map((h) => (h.slug === slug ? { ...h, cues: (h.cues || []).filter((c) => c.id !== cueId) } : h));
          await putJSON(env, 'honorees', honorees);
          return jsonResponse({ success: true });
        }

        // Media upload -> R2
        if (pathname === '/api/admin/upload' && request.method === 'POST') {
          if (!env.MEDIA) return missingBindingResponse('MEDIA (R2 bucket)');
          const formData = await request.formData();
          const file = formData.get('file');
          if (!file || typeof file === 'string') return jsonResponse({ error: 'No file provided' }, 400);
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
          const key = `media/${Date.now()}-${safeName}`;
          await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } });
          return jsonResponse({ key, url: `/${key}` }, 201);
        }

        return jsonResponse({ error: 'Not found' }, 404);
      }

      // ---- Fallback: everything else is a static asset ----
      return env.ASSETS.fetch(request);
    } catch (err) {
      return new Response(`Server error: ${err.message}`, { status: 500 });
    }
  },
};
