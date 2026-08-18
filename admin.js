/* Cues for Cancer Inc. — admin dashboard logic */
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  document.getElementById('story-form').addEventListener('submit', handleStorySubmit);
  document.getElementById('press-form').addEventListener('submit', handlePressSubmit);

  document.querySelectorAll('.admin-tab[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab[data-tab]').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.admin-panel').forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelector(`.admin-panel[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });
});

async function checkAuth() {
  const res = await fetch('/api/admin/check', { credentials: 'same-origin' });
  const data = await res.json();
  if (data.authed) showDashboard();
}

async function handleLogin(e) {
  e.preventDefault();
  const password = document.getElementById('login-password').value;
  const status = document.getElementById('login-status');
  status.textContent = 'Signing in…';
  status.className = 'admin-status';
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showDashboard();
    } else {
      status.textContent = data.error || 'Incorrect password';
      status.classList.add('is-error');
    }
  } catch (err) {
    status.textContent = 'Network error — please try again.';
    status.classList.add('is-error');
  }
}

async function handleLogout() {
  await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
  location.reload();
}

function showDashboard() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('dashboard-view').style.display = '';
  document.getElementById('logout-btn').style.display = '';
  loadStories();
  loadPress();
  loadHonorees();
  loadNewsletter();
}

/* ---------- Stories ---------- */
async function loadStories() {
  const res = await fetch('/api/stories', { credentials: 'same-origin' });
  const stories = await res.json();
  const list = document.getElementById('stories-list');
  if (!stories.length) {
    list.innerHTML = '<p class="admin-empty">No stories added yet.</p>';
    return;
  }
  list.innerHTML = stories.map((s) => `
    <div class="admin-list-item">
      <div>
        <strong>${escapeHTML(s.author)}</strong>${s.authorTitle ? ` <span class="admin-muted">— ${escapeHTML(s.authorTitle)}</span>` : ''}
        <p>${escapeHTML(s.quote)}</p>
      </div>
      <div class="admin-list-actions">
        <button class="btn-link" data-edit-story="${s.id}">Edit</button>
        <button class="btn-link is-danger" data-delete-story="${s.id}">Delete</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-edit-story]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const story = stories.find((s) => s.id === btn.dataset.editStory);
      fillStoryForm(story);
    });
  });
  list.querySelectorAll('[data-delete-story]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this story?')) return;
      await fetch(`/api/admin/stories/${btn.dataset.deleteStory}`, { method: 'DELETE', credentials: 'same-origin' });
      loadStories();
    });
  });
}

function fillStoryForm(story) {
  const form = document.getElementById('story-form');
  form.id.value = story.id;
  form.author.value = story.author;
  form.authorTitle.value = story.authorTitle;
  form.title.value = story.title;
  form.quote.value = story.quote;
  form.scrollIntoView({ behavior: 'smooth' });
}

async function handleStorySubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = form.querySelector('[data-status-for="story-form"]');
  const id = form.id.value;
  const body = {
    author: form.author.value,
    authorTitle: form.authorTitle.value,
    title: form.title.value,
    quote: form.quote.value,
  };
  status.textContent = 'Saving…';
  status.className = 'admin-status';
  try {
    const res = await fetch(id ? `/api/admin/stories/${id}` : '/api/admin/stories', {
      method: id ? 'PUT' : 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
    status.textContent = 'Saved.';
    form.reset();
    form.id.value = '';
    loadStories();
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('is-error');
  }
}

/* ---------- Press ---------- */
async function loadPress() {
  const res = await fetch('/api/press', { credentials: 'same-origin' });
  const press = await res.json();
  const list = document.getElementById('press-list');
  if (!press.length) {
    list.innerHTML = '<p class="admin-empty">No press mentions added yet.</p>';
    return;
  }
  list.innerHTML = press.map((p) => `
    <div class="admin-list-item">
      <div>
        <strong>${escapeHTML(p.title)}</strong> <span class="admin-muted">${escapeHTML(p.outlet)}${p.date ? ' · ' + escapeHTML(p.date) : ''}</span>
        <p>${escapeHTML(p.summary || '')}</p>
        ${p.url ? `<a href="${escapeHTML(p.url)}" target="_blank" rel="noopener">${escapeHTML(p.url)}</a>` : ''}
      </div>
      <div class="admin-list-actions">
        <button class="btn-link" data-edit-press="${p.id}">Edit</button>
        <button class="btn-link is-danger" data-delete-press="${p.id}">Delete</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-edit-press]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = press.find((p) => p.id === btn.dataset.editPress);
      fillPressForm(item);
    });
  });
  list.querySelectorAll('[data-delete-press]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this press mention?')) return;
      await fetch(`/api/admin/press/${btn.dataset.deletePress}`, { method: 'DELETE', credentials: 'same-origin' });
      loadPress();
    });
  });
}

function fillPressForm(item) {
  const form = document.getElementById('press-form');
  form.id.value = item.id;
  form.title.value = item.title;
  form.outlet.value = item.outlet;
  form.date.value = item.date;
  form.url.value = item.url;
  form.summary.value = item.summary;
  form.scrollIntoView({ behavior: 'smooth' });
}

async function handlePressSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = form.querySelector('[data-status-for="press-form"]');
  const id = form.id.value;
  const body = {
    title: form.title.value,
    outlet: form.outlet.value,
    date: form.date.value,
    url: form.url.value,
    summary: form.summary.value,
  };
  status.textContent = 'Saving…';
  status.className = 'admin-status';
  try {
    const res = await fetch(id ? `/api/admin/press/${id}` : '/api/admin/press', {
      method: id ? 'PUT' : 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
    status.textContent = 'Saved.';
    form.reset();
    form.id.value = '';
    loadPress();
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('is-error');
  }
}

/* ---------- Honorees ---------- */
let honoreesCache = [];
let activeHonoreeSlug = null;

async function loadHonorees() {
  const res = await fetch('/api/honorees', { credentials: 'same-origin' });
  honoreesCache = await res.json();
  if (!honoreesCache.length) return;

  // Keep whichever honoree was already selected (e.g. after a save) instead
  // of silently jumping back to the first tab and losing the user's place.
  const selectedSlug = honoreesCache.some((h) => h.slug === activeHonoreeSlug)
    ? activeHonoreeSlug
    : honoreesCache[0].slug;

  const tabs = document.getElementById('honoree-tabs');
  tabs.innerHTML = honoreesCache.map((h) => `<button class="admin-tab${h.slug === selectedSlug ? ' is-active' : ''}" data-honoree="${h.slug}">${escapeHTML(h.hashtag)}</button>`).join('');
  tabs.querySelectorAll('[data-honoree]').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('[data-honoree]').forEach((t) => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderHonoreeEditor(btn.dataset.honoree);
    });
  });
  renderHonoreeEditor(selectedSlug);
}

function renderHonoreeEditor(slug) {
  activeHonoreeSlug = slug;
  const honoree = honoreesCache.find((h) => h.slug === slug);
  const root = document.getElementById('honoree-editor');
  if (!honoree) { root.innerHTML = ''; return; }

  root.innerHTML = `
    <div class="admin-card">
      <h3>${escapeHTML(honoree.hashtag)} — profile</h3>
      <form id="honoree-form" class="form-grid" style="margin-top:1rem;">
        <div class="field-row field-row--2">
          <div>
            <label for="honoree-name">Display name</label>
            <input id="honoree-name" name="name" value="${escapeAttr(honoree.name)}" required />
          </div>
          <div>
            <label for="honoree-hashtag">Hashtag</label>
            <input id="honoree-hashtag" name="hashtag" value="${escapeAttr(honoree.hashtag)}" required />
          </div>
        </div>
        <div>
          <label for="honoree-photo">Photo</label>
          <input id="honoree-photo" type="file" accept="image/*" />
          ${honoree.photoKey ? `<img src="${escapeAttr(honoree.photoKey)}" alt="${escapeAttr(honoree.name)}" class="admin-photo-preview" />` : '<p class="admin-muted">No photo uploaded yet.</p>'}
          <input type="hidden" name="photoKey" value="${escapeAttr(honoree.photoKey || '')}" />
        </div>
        <div>
          <label for="honoree-story">Story</label>
          <textarea id="honoree-story" name="story">${escapeHTML(honoree.story || '')}</textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Save Profile</button>
        <p class="admin-status" data-status-for="honoree-form"></p>
      </form>
    </div>

    <div class="admin-card">
      <h3>Cues (tributes from theaters)</h3>
      <form id="cue-form" class="form-grid" style="margin-top:1rem;">
        <div class="field-row field-row--2">
          <div>
            <label for="cue-author">Submitted by</label>
            <input id="cue-author" name="author" required />
          </div>
          <div>
            <label for="cue-theater">Theater / organization</label>
            <input id="cue-theater" name="theater" />
          </div>
        </div>
        <div>
          <label for="cue-message">Tribute message</label>
          <textarea id="cue-message" name="message" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Add Cue</button>
        <p class="admin-status" data-status-for="cue-form"></p>
      </form>
      <div id="cues-list" class="admin-list" style="margin-top:1.5rem;"></div>
    </div>
  `;

  document.getElementById('honoree-form').addEventListener('submit', handleHonoreeSubmit);
  document.getElementById('cue-form').addEventListener('submit', handleCueSubmit);
  renderCuesList(honoree.cues || []);
}

function renderCuesList(cues) {
  const list = document.getElementById('cues-list');
  if (!cues.length) {
    list.innerHTML = '<p class="admin-empty">No cues submitted yet.</p>';
    return;
  }
  list.innerHTML = cues.map((c) => `
    <div class="admin-list-item">
      <div>
        <strong>${escapeHTML(c.author)}</strong>${c.theater ? ` <span class="admin-muted">— ${escapeHTML(c.theater)}</span>` : ''}
        <p>${escapeHTML(c.message)}</p>
      </div>
      <div class="admin-list-actions">
        <button class="btn-link is-danger" data-delete-cue="${c.id}">Delete</button>
      </div>
    </div>
  `).join('');
  list.querySelectorAll('[data-delete-cue]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this cue?')) return;
      await fetch(`/api/admin/honorees/${activeHonoreeSlug}/cues/${btn.dataset.deleteCue}`, { method: 'DELETE', credentials: 'same-origin' });
      loadHonorees();
    });
  });
}

async function handleHonoreeSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = form.querySelector('[data-status-for="honoree-form"]');
  status.textContent = 'Saving…';
  status.className = 'admin-status';

  try {
    let photoKey = form.photoKey.value;
    const fileInput = document.getElementById('honoree-photo');
    if (fileInput.files[0]) {
      photoKey = await uploadFile(fileInput.files[0]);
    }
    const body = { name: form.name.value, hashtag: form.hashtag.value, story: form.story.value, photoKey };
    const res = await fetch(`/api/admin/honorees/${activeHonoreeSlug}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
    status.textContent = 'Saved.';
    loadHonorees();
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('is-error');
  }
}

async function handleCueSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = form.querySelector('[data-status-for="cue-form"]');
  status.textContent = 'Saving…';
  status.className = 'admin-status';
  try {
    const body = { author: form.author.value, theater: form.theater.value, message: form.message.value };
    const res = await fetch(`/api/admin/honorees/${activeHonoreeSlug}/cues`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
    form.reset();
    status.textContent = 'Added.';
    loadHonorees();
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('is-error');
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', credentials: 'same-origin', body: formData });
  if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
  const data = await res.json();
  return data.url;
}

/* ---------- Newsletter Signups ---------- */
async function loadNewsletter() {
  const res = await fetch('/api/admin/newsletter', { credentials: 'same-origin' });
  const signups = await res.json();
  const list = document.getElementById('newsletter-list');
  if (!signups.length) {
    list.innerHTML = '<p class="admin-empty">No signups yet.</p>';
    return;
  }
  list.innerHTML = signups.map((s) => `
    <div class="admin-list-item">
      <div>
        <strong>${escapeHTML(s.email)}</strong>
        <p class="admin-muted">Subscribed ${new Date(s.subscribedAt).toLocaleDateString()}</p>
      </div>
      <div class="admin-list-actions">
        <button class="btn-link is-danger" data-delete-signup="${escapeAttr(s.email)}">Remove</button>
      </div>
    </div>
  `).join('');
  list.querySelectorAll('[data-delete-signup]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm(`Remove ${btn.dataset.deleteSignup} from the newsletter list?`)) return;
      await fetch(`/api/admin/newsletter/${encodeURIComponent(btn.dataset.deleteSignup)}`, { method: 'DELETE', credentials: 'same-origin' });
      loadNewsletter();
    });
  });
}

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(str) {
  return escapeHTML(str);
}
