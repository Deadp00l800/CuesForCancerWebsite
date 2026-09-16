/* Cues for Cancer Inc. — The Ghost Light
   A public tribute wall: every submitted name lights a ghost light that
   stays lit permanently. Visitors can add a light but never edit or
   remove one — moderation happens only through the admin dashboard. */

const POLL_INTERVAL_MS = 15000;
let knownIds = new Set();
let openCardId = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ghost-light-form');
  const stage = document.getElementById('ghost-light-stage');
  if (!stage) return;

  loadLights(true);
  setInterval(() => loadLights(false), POLL_INTERVAL_MS);

  form?.addEventListener('submit', handleSubmit);

  // Close an open card when clicking anywhere else on the stage
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ghost-light')) closeAllCards();
  });
});

async function loadLights(isFirstLoad) {
  const stage = document.getElementById('ghost-light-stage');
  const countEl = document.getElementById('ghost-light-count');
  try {
    const res = await fetch('/api/ghost-light');
    if (!res.ok) throw new Error('unavailable');
    const lights = await res.json();

    if (countEl) {
      countEl.textContent = lights.length === 1 ? '1 light burning' : `${lights.length.toLocaleString()} lights burning`;
    }

    if (isFirstLoad) {
      stage.innerHTML = lights.length
        ? lights.map(renderLight).join('')
        : '<p class="ghost-light-empty">The stage is dark for now — be the first to light it.</p>';
      lights.forEach((l) => knownIds.add(l.id));
      attachLightHandlers();
      return;
    }

    // On subsequent polls, only append genuinely new lights so we don't
    // disturb an open card or reset scroll position.
    const emptyMsg = stage.querySelector('.ghost-light-empty');
    const newLights = lights.filter((l) => !knownIds.has(l.id));
    if (newLights.length) {
      if (emptyMsg) emptyMsg.remove();
      newLights.forEach((l) => {
        knownIds.add(l.id);
        stage.insertAdjacentHTML('beforeend', renderLight(l));
      });
      attachLightHandlers();
    }
  } catch (err) {
    if (isFirstLoad) {
      stage.innerHTML = '<p class="ghost-light-empty">Unable to load the stage right now — please refresh in a moment.</p>';
    }
  }
}

function renderLight(light) {
  return `
    <button type="button" class="ghost-light" data-id="${light.id}" aria-label="${escapeAttr(light.name)}">
      <span class="ghost-light-glow"></span>
      <span class="ghost-light-stand"></span>
      <span class="ghost-light-card" role="tooltip">
        <strong>${escapeHTML(light.name)}</strong>
        ${light.story ? `<span>${escapeHTML(light.story)}</span>` : ''}
      </span>
    </button>
  `;
}

function attachLightHandlers() {
  document.querySelectorAll('.ghost-light').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const isOpen = btn.classList.contains('is-open');
      closeAllCards();
      if (!isOpen) {
        btn.classList.add('is-open');
        openCardId = id;
      } else {
        openCardId = null;
      }
    });
  });
}

function closeAllCards() {
  document.querySelectorAll('.ghost-light.is-open').forEach((b) => b.classList.remove('is-open'));
  openCardId = null;
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('ghost-light-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;

  const name = form.name.value.trim();
  if (!name) {
    status.textContent = 'Please enter a name.';
    status.classList.add('is-error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Lighting…';
  status.textContent = '';
  status.classList.remove('is-error');

  try {
    const res = await fetch('/api/ghost-light/submit', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        story: form.story.value.trim(),
        website: form.website.value, // honeypot — always empty for real visitors
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

    status.textContent = 'Your light is now burning on the stage. Thank you.';
    form.reset();
    knownIds.add(data.id);
    const stage = document.getElementById('ghost-light-stage');
    const emptyMsg = stage.querySelector('.ghost-light-empty');
    if (emptyMsg) emptyMsg.remove();
    stage.insertAdjacentHTML('beforeend', renderLight(data));
    attachLightHandlers();
    document.getElementById('ghost-light-stage').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('is-error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
}

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(str) {
  return escapeHTML(str);
}
