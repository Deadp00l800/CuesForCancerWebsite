# Cues for Cancer Inc. — Modern Site Redesign

A modern, static redesign of the Cues for Cancer Inc. website. Built with plain HTML/CSS/JS — no build step, no framework — so it can be deployed anywhere (Cloudflare Pages, Netlify, GitHub Pages, etc.) by uploading the files as-is.

## What's included

- `index.html` — Home page with video banner hero, impact stats, mission/programs, stories, team preview, CTA, newsletter popup.
- `about.html` — Our story, mission & programs, FAQ.
- `team.html` — Full team roster: photo, name, and title per card, with a click-to-expand bio (accordion).
- `get-involved.html` — Donate, volunteer sign-up form, host-an-event info, corporate partners.
- `events.html` — Calendar + upcoming-events list; click a highlighted date or an agenda item to open an RSVP/tickets modal.
- `contact.html` — Contact form + direct contact details.
- `style.css` — All styling: nav, hero, cards, team accordion, calendar/events, forms, popup, footer, animations.
- `main.js` — Sticky/blurred nav on scroll, mobile hamburger menu, dropdown menus, newsletter popup logic, scroll-reveal animations, animated stat counters.
- `team.js` — Team roster data (name/title/bio) and renders the click-to-expand team cards on `team.html`.
- `events.js` — Event data (see below) and renders the calendar, agenda list, and RSVP/tickets modal on `events.html`.

## How to add a workshop or event

Open `events.js` and add a new object to the top of the `EVENTS` array, following the same shape as the examples already there:

```js
{
  id: 'a-unique-slug',                 // used internally, just keep it unique
  title: 'Event name',
  date: '2026-11-14',                  // YYYY-MM-DD
  time: '6:00 PM – 8:00 PM',
  location: 'Venue name, City, VA',
  type: 'Workshop',                    // or 'Fundraiser', 'Performance', 'Community' — controls the tag color
  description: [
    'First paragraph shown in the event detail popup.',
    'Optional second paragraph.',
  ],
  action: { label: 'RSVP', url: 'mailto:Darrell@cues4cancer.com?subject=RSVP%3A%20Event%20Name' },
  // or for a ticketed event:
  // action: { label: 'Get Tickets', url: 'https://your-ticket-link.com' },
},
```

That's it — the date automatically shows up as a highlighted, clickable day on the calendar (the calendar always opens to the current month) and as a card in the "Upcoming" list. No other file needs to change. Past events can be deleted from the array whenever you like; nothing removes them automatically.

## Status — what's plugged in already

- **Hero video** — `hero.mp4` is in place (1920×1080, H.264) and every page's `<video>` tag already points to it. It won't preview in some sandboxed/headless test browsers that lack a licensed H.264 decoder, but it plays normally in real Chrome, Safari, Firefox, and Edge. No poster/still image has been added yet — add one at `hero-poster.jpg` (and the matching `about/team/involved/contact/events-poster.jpg` (same flat style, e.g. `about-poster.jpg`)) if you want an instant frame before the video loads.
- **Team photos** — all 10 team members have real headshots wired into `team.js`.
- **Donate buttons** — every "Donate Now" CTA, the nav's Donate dropdown item, and the Get Involved page's tiered giving buttons link to your Fractured Atlas fundraiser page.
- **Social links** — Facebook, Instagram, and LinkedIn are live in the footer and Contact page.
- **Contact email** — `Darrell@cues4cancer.com` everywhere.
- **Sample events** — `events.js` ships with 4 example events (2 workshops, a fundraiser, a community picnic) so you can see the calendar/RSVP flow working. Replace or delete these with your real events whenever you're ready.

## Design notes

- Palette keeps the original brand purple (`#4B2E83`) and cream, layered with a new warm gold accent (`#d9a441`) for CTAs and highlights — ties back to theatre/spotlight imagery without leaning on cancer-awareness pink or gray-clinical tones.
- Nav: translucent/blurred over the hero, solid on scroll; "About" and "Get Involved" are two-level dropdowns (desktop: hover/focus; mobile: tap-to-expand accordion inside the slide-in menu).
- Team page: each card shows photo, name, and title only. Clicking anywhere on the card (or the + icon) expands a bio panel beneath it — built with vanilla JS and CSS `max-height` transitions, keyboard/focus accessible (`aria-expanded`, `aria-controls`).
- Motion is subtle by design and respects `prefers-reduced-motion`.

## Local preview

No build tools needed — just open `index.html` in a browser, or serve the folder locally:

```
npx serve .
```
