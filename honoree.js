/* Cues for Cancer Inc. — public honoree ("#CuesForX") profile page */
document.addEventListener('DOMContentLoaded', async () => {
  const slug = location.pathname.replace(/^\/honoree\/?/, '').replace(/\/$/, '');
  const content = document.getElementById('honoree-content');
  const heading = document.getElementById('honoree-heading');
  const breadcrumb = document.getElementById('honoree-breadcrumb');

  if (!slug) {
    content.innerHTML = '<p>No honoree specified.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/honorees/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('not found');
    const honoree = await res.json();

    document.title = `${honoree.hashtag} — Cues for Cancer Inc.`;
    heading.textContent = honoree.hashtag;
    breadcrumb.textContent = honoree.hashtag;

    const cues = honoree.cues || [];
    content.innerHTML = `
      <div class="honoree-profile reveal">
        ${honoree.photoKey ? `<img class="honoree-photo" src="${escapeAttr(honoree.photoKey)}" alt="${escapeAttr(honoree.name)}" />` : ''}
        <div>
          <span class="eyebrow">${escapeHTML(honoree.hashtag)}</span>
          <h2>${escapeHTML(honoree.name)}</h2>
          ${honoree.story ? `<div class="honoree-story">${escapeHTML(honoree.story).split('\n').map((p) => `<p>${p}</p>`).join('')}</div>` : '<p style="color:var(--gray-700);">Their story is coming soon.</p>'}
        </div>
      </div>

      <div class="honoree-cues reveal">
        <h3>Cues named in their honor</h3>
        ${cues.length
          ? `<div class="cues-grid">${cues.map((c) => `
              <div class="cue-card">
                <p>${escapeHTML(c.message)}</p>
                <div class="cue-author">— ${escapeHTML(c.author)}${c.theater ? `<span class="cue-theater">${escapeHTML(c.theater)}</span>` : ''}</div>
              </div>
            `).join('')}</div>`
          : '<p style="color:var(--gray-700);">No cues have been shared yet — check back soon.</p>'}
      </div>
    `;
    if (typeof initScrollReveal === 'function') initScrollReveal();
  } catch (err) {
    heading.textContent = 'Not Found';
    breadcrumb.textContent = 'Not Found';
    content.innerHTML = '<p>We couldn\'t find that honoree. <a href="index.html#stories">Back to Stories</a></p>';
  }
});

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(str) {
  return escapeHTML(str);
}
