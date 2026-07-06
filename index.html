/* Cues for Cancer Inc. — team roster data + click-to-expand bio cards
   To add a real headshot: set `photo` to an image path (e.g. "assets/team/darrell-wood.jpg").
   Leave `photo` empty to keep the initials avatar. */
const TEAM = [
  {
    name: 'Darrell Wood',
    title: 'Executive Director & Founder',
    photo: 'assets/team/darrell-wood.webp',
    bio: [
      'A cancer survivor himself, Darrell founded Cues for Cancer after facing a life-altering diagnosis of testicular cancer at just eighteen years old.',
      'He leads the organization’s strategic vision, partnerships, and program development, drawing on his own experience to shape events and services that meet people where they are.',
    ],
  },
  {
    name: 'Dr. Elissa Peterson',
    title: 'Director of Governance',
    photo: 'assets/team/elissa-peterson.webp',
    bio: [
      'Dr. Peterson holds credentials as a CMLC, CMP, CNHP, and ND, and brings deep expertise in coaching, holistic wellness, and leadership development.',
      'As Director of Governance, she emphasizes stewardship and community empowerment, guiding the organization’s governance and long-term direction.',
    ],
  },
  {
    name: 'Rishi Sood',
    title: 'Director of Marketing & External Affairs',
    photo: 'assets/team/rishi-sood.webp',
    bio: [
      'Rishi previously served as Head of Business Development at Music World Entertainment under Dr. Mathew Knowles.',
      'He specializes in aligning artists, athletes, speakers, and brands with mission-driven messaging, helping extend the reach of Cues for Cancer’s story.',
    ],
  },
  {
    name: 'Phillip Killebrew, Jr.',
    title: 'Director of Finance',
    photo: 'assets/team/phillip-killebrew.webp',
    bio: [
      'Phillip is a Program Manager and Lead Engineer Planning Analyst for Newport News Shipbuilding.',
      'Named a Top Forty Under 40 professional in Hampton Roads, he brings over 15 years of community service experience to the board.',
    ],
  },
  {
    name: 'Tod Addison',
    title: 'Director',
    photo: 'assets/team/tod-addison.webp',
    bio: [
      'Tod is a retired U.S. Army Lieutenant Colonel with more than 30 years of leadership experience.',
      'He previously commanded the U.S. Military Academy Band and served as Equal Opportunity Program Manager at West Point.',
    ],
  },
  {
    name: 'Dr. Ann Berger',
    title: 'Director of Health Programs',
    photo: 'assets/team/ann-berger.webp',
    bio: [
      'Dr. Berger brings over 35 years of experience in pain and palliative care, including service as former chief of pain and palliative care at the National Institutes of Health.',
      'Her ground-breaking research measures psychosocial and spiritual healing, informing how the organization supports whole-person wellbeing.',
    ],
  },
  {
    name: 'Frederick Thompson',
    title: 'Director',
    photo: 'assets/team/frederick-thompson.webp',
    bio: [
      'Frederick is a Senior Sales Executive with 20+ years in B2B sales across SaaS, media, and service sectors.',
      'He holds a Bachelor of Arts in Business Administration from Springfield College.',
    ],
  },
  {
    name: 'Ashley Williams',
    title: 'Programs Advisor',
    photo: 'assets/team/ashley-williams.webp',
    bio: [
      'Ashley holds a Master of Arts in English from Valdosta State University and a Bachelor of Arts in English and Theatre from Virginia Wesleyan University.',
      'She guides program development and curriculum design across Cues for Cancer’s workshops and community events.',
    ],
  },
  {
    name: 'Christina Craig',
    title: 'Advisor on Childhood Development & Family Wellness',
    photo: 'assets/team/christina-craig.webp',
    bio: [
      'Christina is a Behavior Technician supporting children and families with developmental growth, emotional regulation, and positive behavioral outcomes.',
      'Her guidance shapes programming for younger family members impacted by a cancer diagnosis in the household.',
    ],
  },
  {
    name: 'Dr. Daryl T. Jenkins',
    title: 'Board Member',
    photo: 'assets/team/daryl-jenkins.jpeg',
    bio: [
      'Dr. Jenkins contributes strategic and clinical insight to the board, supporting the organization’s mission to serve those affected by cancer with compassion and rigor.',
    ],
  },
];

function initials(name) {
  return name
    .split(' ')
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
}

function renderTeam() {
  const root = document.getElementById('team-grid');
  if (!root) return;

  root.innerHTML = TEAM.map((member, i) => `
    <article class="team-card reveal" style="transition-delay:${(i % 3) * 80}ms">
      <button class="team-summary" aria-expanded="false" aria-controls="bio-${i}" data-team-toggle="${i}">
        ${member.photo
          ? `<img class="team-photo" src="${member.photo}" alt="${member.name}" />`
          : `<span class="team-photo" aria-hidden="true">${initials(member.name)}</span>`}
        <span class="team-id">
          <span class="name">${member.name}</span>
          <span class="title">${member.title}</span>
        </span>
        <span class="team-toggle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </button>
      <div class="team-bio" id="bio-${i}">
        <div class="team-bio-inner">
          ${member.bio.map((p) => `<p>${p}</p>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  root.querySelectorAll('[data-team-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.team-card');
      const isOpen = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', renderTeam);
