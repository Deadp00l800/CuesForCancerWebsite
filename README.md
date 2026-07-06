/* Cues for Cancer Inc. — shared site behavior: nav, popup, reveal, counters */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initNewsletterPopup();
  initScrollReveal();
  initStatCounters();
  markActiveNavLink();
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
      const response = await fetch('https://api.sheetbest.com/sheets/5276babe-64a4-44b8-82d4-3a3da8031e89', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
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
