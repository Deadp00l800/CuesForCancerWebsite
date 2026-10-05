/* Cues for Cancer — shared site behavior: nav, popup, reveal, counters */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initNewsletterPopup();
  initContactForm();
  initHonoreeGrid();
  initScrollReveal();
  initStatCounters();
  markActiveNavLink();
  initSupportersBanner();
});

/* Header background swap + shrink on scroll */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile hamburger + accordion-style dropdowns on touch */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.has-dropdown > .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      link.parentElement.classList.toggle('is-open');
    });
  });

  links.querySelectorAll('a:not(.has-dropdown > .nav-link)').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* Highlight the nav link matching the current page */
function markActiveNavLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
  });
}

/* Newsletter popup: show once per session, close button, validated submit */
function initNewsletterPopup() {
  const popup = document.getElementById('popup');
  if (!popup) return;
  const closeBtn = document.getElementById('popup-close');
  const form = document.getElementById('popup-form');
  const emailInput = document.getElementById('popup-email');
  const SEEN_KEY = 'cfc_newsletter_seen';

  if (!sessionStorage.getItem(SEEN_KEY)) {
    setTimeout(() => {
      popup.classList.add('is-visible');
      sessionStorage.setItem(SEEN_KEY, '1');
    }, 4000);
  }

  const hide = () => popup.classList.remove('is-visible');
  closeBtn?.addEventListener('click', hide);
  popup.addEventListener('click', (e) => { if (e.target === popup) hide(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing…';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      submitBtn.textContent = response.ok ? 'Thank you!' : 'Please try again';
      if (response.ok) setTimeout(hide, 1400);
    } catch (err) {
      submitBtn.textContent = 'Network error';
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }, 2200);
    }
  });

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
  }
}

/* Contact page form: submit via Web3Forms (no backend needed), email goes to Darrell@cues4cancer.com */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    status.textContent = '';
    status.style.color = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (result.success) {
        status.textContent = "Thanks — your message is on its way. We'll be in touch soon.";
        status.style.color = 'var(--purple-700)';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try again or email Darrell@cues4cancer.com directly.';
        status.style.color = '#b3261e';
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again or email Darrell@cues4cancer.com directly.';
      status.style.color = '#b3261e';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

/* #CuesFor honoree cards on the homepage Stories section (pulled from the admin-editable API) */
async function initHonoreeGrid() {
  const grid = document.getElementById('honoree-grid');
  if (!grid) return;
  try {
    const res = await fetch('/api/honorees');
    if (!res.ok) throw new Error('unavailable');
    const honorees = await res.json();
    grid.innerHTML = honorees.map((h) => `
      <a class="honoree-card" href="/honoree/${encodeURIComponent(h.slug)}">
        ${h.photoKey
          ? `<img class="honoree-card-photo" src="${h.photoKey}" alt="${h.name}" />`
          : `<span class="honoree-card-photo" aria-hidden="true">${(h.name || '?').charAt(0)}</span>`}
        <span class="honoree-card-tag">${h.hashtag}</span>
      </a>
    `).join('');
  } catch (err) {
    const section = document.getElementById('honoree-section');
    if (section) section.style.display = 'none';
  }
}

/* Fade/slide sections into view as the user scrolls */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
}

/* Animate the impact numbers in the stats strip once visible */
function initStatCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) {
    nums.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach((el) => observer.observe(el));
}

/* Scrolling "thank you" banner of supporters, shown above the footer on every page.
   To add a supporter: add an object to SUPPORTERS with the logo file and website.
   Leave `logo` empty to show the supporter's name until a logo file is added. */
const SUPPORTERS = [
  { name: 'Autobell Car Wash', logo: 'supporter-autobell.jpg', url: 'https://www.autobell.com/' },
  { name: 'Baltimore Orioles', logo: 'supporter-orioles.png', url: 'https://www.mlb.com/orioles' },
  { name: 'Cheeky Charity', logo: 'supporter-cheeky-charity.png', url: 'https://www.cheekycharity.org/' },
  { name: 'Choice Broker Services', logo: 'supporter-choice-broker.png', url: 'https://choicebrokerservices.com/' },
  { name: 'Colley Avenue Copies & Graphics', logo: 'supporter-colley-avenue.jpg', url: 'https://www.colleyavenuecopies.com/' },
  { name: 'Topgolf', logo: 'supporter-topgolf.png', url: 'https://topgolf.com/' },
  { name: 'Virginia Stage Company', logo: 'supporter-virginia-stage.jpg', url: 'https://www.vastage.org/' },
];

function initSupportersBanner() {
  const footer = document.querySelector('.site-footer');
  if (!footer || !SUPPORTERS.length) return;

  const logoLinks = (hidden) => SUPPORTERS.map((s) => `
    <a class="supporter-logo" href="${s.url}" target="_blank" rel="noopener"
       ${hidden ? 'aria-hidden="true" tabindex="-1"' : `aria-label="${s.name} — visit website (opens in a new tab)"`}>
      ${s.logo
        ? `<img src="${s.logo}" alt="${hidden ? '' : `${s.name} logo`}" loading="lazy" />`
        : `<span class="supporter-name">${s.name}</span>`}
    </a>`).join('');

  const section = document.createElement('section');
  section.className = 'supporters-banner';
  section.setAttribute('aria-labelledby', 'supporters-heading');
  // The logo set is rendered twice so the scroll loops seamlessly; the copy is hidden from screen readers.
  section.innerHTML = `
    <div class="container">
      <h2 id="supporters-heading" class="supporters-heading">Thank You to Our Supporters</h2>
      <p class="supporters-sub">These businesses and organizations make our work possible through monetary and in-kind donations.</p>
    </div>
    <div class="supporters-marquee">
      <div class="supporters-track">${logoLinks(false)}${logoLinks(true)}</div>
    </div>`;
  footer.before(section);
}
