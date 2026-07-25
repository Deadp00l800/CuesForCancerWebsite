/* Cues for Cancer Inc. — events calendar
   To add a workshop or event: add an object to the EVENTS array below.
   date must be in "YYYY-MM-DD" format. action.label is the button text
   ("RSVP" for free events, "Get Tickets" for ticketed ones) and action.url
   is where it goes — a mailto: link, a Google Form, Eventbrite, etc. */
const EVENTS = [
  {
    id: 'virginia-support-group-jul',
    title: 'Virginia Support Group (Man Up to Cancer)',
    date: '2026-07-08',
    time: '6:00 PM – 8:00 PM',
    location: 'Brock Cancer Center, Virginia',
    type: 'Community',
    description: [
      'A recurring peer support group held in partnership with Man Up to Cancer — a space for connection and community for anyone affected by cancer.',
      'This group meets every month on the second Wednesday, through November 10, 2027.',
    ],
    action: { label: 'Learn More', url: 'mailto:Darrell@cues4cancer.com?subject=Question%3A%20Virginia%20Support%20Group' },
  },
  {
    id: 'hampton-roads-show-jul',
    title: 'Darrell Wood on the Hampton Roads Show',
    date: '2026-07-10',
    time: '11:00 AM EST (WAVY-10) & 1:00 PM EST (The CW Network)',
    location: 'Broadcast on WAVY-10, WAVY-10+, and The CW Network',
    type: 'Community',
    description: [
      'Darrell Wood, Founder and Executive Director, will be speaking on the Hampton Roads Show about Cues for Cancer — sharing our mission, a few sneak peeks at what\'s coming soon, and his personal story of creating Cues for Cancer as a nonprofit.',
      'Free to watch — no tickets needed. Tune in on WAVY-10, WAVY-10+, or The CW Network.',
    ],
    action: { label: 'Watch on WAVY-10', url: 'https://www.wavy.com' },
  },
  {
    id: 'creative-spark-workshop-sep',
    title: 'Creative Spark Workshops',
    date: '2026-09-09',
    time: '10:30 AM – 11:45 AM',
    location: 'The Holistic Treehouse, LLC — 1433 Sam\'s Drive, Suite A203, Chesapeake, Virginia 23320',
    type: 'Workshop',
    description: [
      'Creativity. Connection. Healing. — through the power of the performing arts. No experience needed; come have fun and find a healing community through music, theater, and creative expression.',
      'Cost is pay-what-you-can, accepted at sign-in. This event is sponsored by The Holistic Treehouse.',
      'Creative Spark Workshops repeat every second Wednesday of the month.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/creative-spark-workshops-tickets-1994720721374?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-oct',
    title: 'Creative Spark Workshops',
    date: '2026-10-14',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-oct-2026.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/creative-spark-workshops-october-tickets-1995175919885?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-nov',
    title: 'Creative Spark Workshops',
    date: '2026-11-11',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-nov-2026.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/creative-spark-workshops-november-tickets-1995176088389?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-dec',
    title: 'Creative Spark Workshops',
    date: '2026-12-09',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-dec-2026.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/1995176092401?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-jan',
    title: 'Creative Spark Workshops',
    date: '2027-01-13',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-jan-2027.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/creative-spark-workshops-january-tickets-1995176109452?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-feb',
    title: 'Creative Spark Workshops',
    date: '2027-02-10',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-feb-2027.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/creative-spark-workshops-february-tickets-1995176137536?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-mar',
    title: 'Creative Spark Workshops',
    date: '2027-03-10',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-mar-2027.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/creative-spark-workshops-march-tickets-1995176147566?aff=oddtdtcreator' },
  },
  {
    id: 'creative-spark-workshop-apr',
    title: 'Creative Spark Workshops',
    date: '2027-04-14',
    time: '10:30 AM – 11:45 AM',
    location: 'Treehouse Studio, 1433 Sam\'s Dr Ste 203A, Chesapeake, VA 23320',
    image: 'creative-spark-apr-2027.jpg',
    type: 'Workshop',
    description: [
      'A safe space to connect, create, and leave feeling grounded through the power of the performing arts.',
      'Cost is pay-what-you-can, accepted at sign-in.',
    ],
    action: { label: 'Get Tickets', url: 'https://www.eventbrite.com/e/1995176154587?aff=oddtdtcreator' },
  },
  {
    id: 'dream-high-block-party-sep',
    title: 'Hampton Roads Dream High Inc. Community Block Party — Connecting to the Community',
    date: '2026-09-12',
    time: '8:00 AM – 2:00 PM EST',
    location: 'King Lincoln Park',
    type: 'Community',
    description: [
      'A day filled with uplifting the community through education, workforce development, and outreach programs.',
      'This event includes free food, games, clothes, school supplies, and entertainment.',
    ],
    action: { label: 'Free — No Tickets Needed', url: 'mailto:Darrell@cues4cancer.com?subject=Question%3A%20Community%20Block%20Party' },
  },
  {
    id: 'curtain-call-of-hope-oct',
    title: 'Curtain Call of Hope: Benefit Concert',
    date: '2026-10-17',
    time: '7:00 PM – 9:00 PM EST',
    location: 'Cues for Cancer Virtual Theater Space (online)',
    type: 'Fundraiser',
    description: [
      'A night celebrating the power of art to heal, as both Hampton Roads and national artists take to our virtual stage. We\'ll also be holding a silent auction during the event.',
      '<ul class="ticket-tiers">'
        + '<li><span>General Admission</span><strong>$35</strong></li>'
        + '<li><span>Supporter Pass</span><strong>$50</strong></li>'
        + '<li><span>Encore Pass</span><strong>$100</strong></li>'
        + '<li><span>Standing Ovation VIP</span><strong>$250</strong></li>'
        + '<li><span>Hope Champion</span><strong>$500</strong></li>'
        + '<li><span>Presenting Benefactor</span><strong>$1,000</strong></li>'
        + '</ul>',
      'Ticket sales end October 17, 2026 at 6:00 PM. Ask about corporate sponsorship packages by emailing Darrell@cues4cancer.com.',
    ],
    action: { label: 'RSVP / Get Tickets', url: 'mailto:Darrell@cues4cancer.com?subject=RSVP%3A%20Curtain%20Call%20of%20Hope%20Benefit%20Concert' },
  },
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let viewYear, viewMonth;

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function eventsOnDate(iso) {
  return EVENTS.filter((e) => e.date === iso);
}

function formatLongDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatShort(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { month: MONTH_NAMES[m - 1].slice(0, 3).toUpperCase(), day: d };
}

function tagClass(type) {
  return type === 'Fundraiser' || type === 'Performance' ? 'event-tag event-tag--gold' : 'event-tag';
}

function eventCardHTML(ev) {
  return `
    <div class="event-card">
      ${ev.image ? `<img class="event-flyer" src="${ev.image}" alt="${ev.title} flyer" />` : ''}
      <div class="event-card-head">
        <span class="${tagClass(ev.type)}">${ev.type}</span>
        <h3>${ev.title}</h3>
      </div>
      <div class="event-meta">
        <span>${formatLongDate(ev.date)}</span>
        <span>${ev.time}</span>
        <span>${ev.location}</span>
      </div>
      <div class="event-desc">${ev.description.map((p) => (p.trim().startsWith('<') ? p : `<p>${p}</p>`)).join('')}</div>
      <a href="${ev.action.url}" ${ev.action.url.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener"'} class="btn btn-primary">${ev.action.label}</a>
    </div>
  `;
}

function openEventModal(evs) {
  const modal = document.getElementById('event-modal');
  const body = document.getElementById('event-modal-body');
  body.innerHTML = evs.map(eventCardHTML).join('<hr class="event-divider" />');
  modal.classList.add('is-visible');
}

function closeEventModal() {
  document.getElementById('event-modal').classList.remove('is-visible');
}

function renderCalendar() {
  const label = document.getElementById('cal-month-label');
  const grid = document.getElementById('cal-grid');
  if (!label || !grid) return;

  label.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const todayISO = toISODate(new Date());

  const gridStart = new Date(viewYear, viewMonth, 1 - startOffset);

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    cells.push({ date: cellDate, inMonth: cellDate.getMonth() === viewMonth });
  }

  grid.innerHTML = WEEKDAYS.map((w) => `<div class="calendar-weekday">${w}</div>`).join('') +
    cells.map((cell) => {
      const iso = toISODate(cell.date);
      const dayEvents = cell.inMonth ? eventsOnDate(iso) : [];
      const isToday = iso === todayISO;
      const classes = ['calendar-day'];
      if (!cell.inMonth) classes.push('is-other-month');
      if (isToday) classes.push('is-today');
      if (dayEvents.length) classes.push('has-event');
      const dots = dayEvents.slice(0, 3).map(() => '<span class="calendar-dot"></span>').join('');
      return `<button type="button" class="${classes.join(' ')}" data-date="${iso}" ${dayEvents.length ? '' : 'tabindex="-1"'}>
        <span class="day-num">${cell.date.getDate()}</span>
        <span class="calendar-dots">${dots}</span>
      </button>`;
    }).join('');

  grid.querySelectorAll('.calendar-day.has-event').forEach((btn) => {
    btn.addEventListener('click', () => {
      const iso = btn.getAttribute('data-date');
      openEventModal(eventsOnDate(iso));
    });
  });
}

function renderAgenda() {
  const list = document.getElementById('agenda-list');
  if (!list) return;
  const todayISO = toISODate(new Date());
  const upcoming = EVENTS.filter((e) => e.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date));

  if (!upcoming.length) {
    list.innerHTML = '<p>No upcoming events are scheduled right now — check back soon.</p>';
    return;
  }

  list.innerHTML = upcoming.map((ev) => {
    const short = formatShort(ev.date);
    return `
      <button type="button" class="agenda-item" data-id="${ev.id}">
        <span class="agenda-date"><span class="agenda-month">${short.month}</span><span class="agenda-day">${short.day}</span></span>
        <span class="agenda-info">
          <span class="agenda-title">${ev.title}</span>
          <span class="agenda-sub">${ev.time} · ${ev.location}</span>
        </span>
        <span class="${tagClass(ev.type)}">${ev.type}</span>
      </button>
    `;
  }).join('');

  list.querySelectorAll('.agenda-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ev = EVENTS.find((e) => e.id === btn.getAttribute('data-id'));
      if (ev) openEventModal([ev]);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  const today = new Date();
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();

  renderCalendar();
  renderAgenda();

  document.getElementById('cal-prev').addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });

  document.getElementById('event-modal-close').addEventListener('click', closeEventModal);
  document.getElementById('event-modal').addEventListener('click', (e) => {
    if (e.target.id === 'event-modal') closeEventModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEventModal(); });
});
