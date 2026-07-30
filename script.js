const storyData = {
  brief: { title: 'A role everyone can see.', copy: 'Align the team on the brief before the first candidate ever arrives.', metric: '94%', fill: '94%', tags: ['Role brief', 'Scorecard', 'Interview plan'] },
  evidence: { title: 'Evidence, in context.', copy: 'Bring the useful parts of a candidate forward without the noise around them.', metric: '88%', fill: '88%', tags: ['Work sample', 'Assessment', 'Signal map'] },
  decision: { title: 'A decision you can explain.', copy: 'Make the call with a shared record of what the team saw and why it mattered.', metric: '97%', fill: '97%', tags: ['Panel view', 'Decision log', 'Next step'] },
};

document.body.classList.add('home-entering');

document.querySelectorAll('.story-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const data = storyData[tab.dataset.story];
    document.querySelectorAll('.story-tab').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.querySelector('#story-title').textContent = data.title;
    document.querySelector('#story-copy').textContent = data.copy;
    document.querySelector('#story-metric').textContent = data.metric;
    document.querySelector('#metric-fill').style.width = data.fill;
    document.querySelector('#story-tag-one').textContent = data.tags[0];
    document.querySelector('#story-tag-two').textContent = data.tags[1];
    document.querySelector('#story-tag-three').textContent = data.tags[2];
  });
});

const menu = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('mobile-open', !open);
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('mobile-open');
}));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  glow.style.display = 'block';
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const progress = document.querySelector('.scroll-progress i');
const heroImage = document.querySelector('.hero-image');
let scrollQueued = false;

const updateScrollMotion = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, ratio * 100)}%`;
  if (heroImage && window.innerWidth > 900) {
    heroImage.style.transform = `translate3d(0, ${Math.min(90, window.scrollY * 0.11)}px, 0) scale(1.025)`;
  }
  scrollQueued = false;
};

window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollMotion);
  }
}, { passive: true });
updateScrollMotion();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.integration-token img').forEach((image) => {
  image.addEventListener('error', () => {
    image.hidden = true;
  });
});

const integrationDetails = {
  greenhouse: {
    name: 'Greenhouse',
    category: 'Applicant tracking system',
    logo: 'public/integrations/greenhouse.png',
    summary: 'Keep Valases evidence connected to the candidate and role records recruiting teams already manage in Greenhouse.',
    uses: ['Bring approved roles and candidate context into a Valases workflow.', 'Return assessment or decision milestones to the hiring record.', 'Reduce duplicate updates across recruiting and assessment teams.'],
    boundary: 'Role, candidate, stage, and event scope is agreed per organization with verified authorization and auditable synchronization.',
  },
  lever: {
    name: 'Lever',
    category: 'Applicant tracking system',
    logo: 'public/integrations/lever.png',
    summary: 'Connect evidence-led assessment and decision workflows to the Lever recruiting record without making teams reconcile two pipelines.',
    uses: ['Link Valases activity to the correct opportunity and role.', 'Coordinate invitations as candidates reach approved stages.', 'Surface completion and review status for recruiting teams.'],
    boundary: 'Only approved opportunity, posting, candidate, and event fields are exchanged through organization-authorized access.',
  },
  workday: {
    name: 'Workday',
    category: 'Enterprise HCM',
    logo: 'public/integrations/workday.png',
    summary: 'Support enterprise teams that need hiring evidence to fit within established Workday governance, identity, and recruiting processes.',
    uses: ['Align requisition context with Valases role workflows.', 'Coordinate candidate assessment and review milestones.', 'Preserve enterprise ownership and audit expectations.'],
    boundary: 'The tenant, business process, permitted fields, and synchronization direction are implementation-scoped before activation.',
  },
  ashby: {
    name: 'Ashby',
    category: 'Recruiting platform',
    logo: 'public/integrations/ashby.png',
    summary: 'Pair Ashby recruiting operations with Valases real-work evidence so fast-moving teams keep one coherent view of candidate progress.',
    uses: ['Trigger the right assessment from an approved recruiting stage.', 'Associate evidence with the correct candidate and opening.', 'Share completion signals without manual status chasing.'],
    boundary: 'Candidate, job, application, and event access follows minimum-scope authorization with retry and reconciliation controls.',
  },
  bamboohr: {
    name: 'BambooHR',
    category: 'HR information system',
    logo: 'public/integrations/bamboohr.jpg',
    summary: 'Create a cleaner handoff between selection and people operations for growing organizations using BambooHR.',
    uses: ['Reference approved job and organizational context.', 'Coordinate the transition from selected candidate to employee setup.', 'Avoid re-entering agreed profile information after acceptance.'],
    boundary: 'Pre-hire and employee data remain separated; the organization explicitly approves every field used in a handoff.',
  },
  sap: {
    name: 'SAP SuccessFactors',
    category: 'Enterprise HXM',
    logo: 'public/integrations/sap-successfactors.png',
    summary: 'Fit structured assessment evidence into complex enterprise recruiting processes while respecting SAP SuccessFactors governance.',
    uses: ['Connect approved requisitions to role-specific evaluation.', 'Coordinate assessment outcomes with recruiting workflows.', 'Support controlled regional and business-unit rollout.'],
    boundary: 'Tenant configuration, regional data requirements, entities, and permissions are validated with customer administrators.',
  },
  'google-calendar': {
    name: 'Google Calendar',
    category: 'Calendar and scheduling',
    logo: 'public/integrations/google-calendar.png',
    summary: 'Turn interview coordination into a dependable workflow with accurate availability, invitations, updates, and timezone handling.',
    uses: ['Create approved interview events with the right participants.', 'Keep reschedules and cancellations synchronized.', 'Attach meeting context to the relevant hiring record.'],
    boundary: 'Calendar selection and event permissions use organization-approved OAuth scopes; personal calendar content is not broadly imported.',
  },
  outlook: {
    name: 'Microsoft Outlook',
    category: 'Calendar and scheduling',
    logo: 'public/integrations/microsoft-outlook.png',
    summary: 'Coordinate enterprise interview schedules inside the Microsoft calendar environment teams already use every day.',
    uses: ['Create and update interview invitations.', 'Respect organizer, participant, timezone, and room details.', 'Keep scheduling changes visible in the Valases workflow.'],
    boundary: 'Microsoft tenant consent, mailbox scope, event fields, and webhook lifecycle are verified before the connection is enabled.',
  },
  teams: {
    name: 'Microsoft Teams',
    category: 'Video interviewing',
    logo: 'public/integrations/microsoft-teams.png',
    summary: 'Make the meeting link a governed part of the interview workflow instead of a disconnected detail passed through messages.',
    uses: ['Create Teams meetings for approved interview sessions.', 'Deliver one current joining link to participants.', 'Keep meeting changes attached to the interview record.'],
    boundary: 'Meeting creation uses approved Microsoft tenant permissions; recordings and transcripts are excluded unless separately agreed.',
  },
  zoom: {
    name: 'Zoom',
    category: 'Video interviewing',
    logo: 'public/integrations/zoom.png',
    summary: 'Connect Zoom interview logistics to the structured hiring plan so candidates and panels always receive the correct session details.',
    uses: ['Create role-linked interview meetings.', 'Keep host, time, and joining information synchronized.', 'Support rescheduling without duplicate meeting links.'],
    boundary: 'Account ownership, host eligibility, meeting settings, and retained metadata are explicitly configured per customer.',
  },
  twilio: {
    name: 'Twilio Voice',
    category: 'Candidate communications',
    logo: 'public/integrations/twilio.png',
    summary: 'Support timely, traceable candidate communication for workflows where reliable voice coordination matters.',
    uses: ['Coordinate approved call-based candidate touchpoints.', 'Associate communication events with the correct workflow.', 'Support regional sender and delivery requirements.'],
    boundary: 'Phone data, regional routing, consent, retention, and communication purpose are reviewed before production use.',
  },
};

const integrationSheetLayer = document.querySelector('[data-integration-sheet]');
let integrationSheetTrigger = null;

if (integrationSheetLayer) {
  const sheet = integrationSheetLayer.querySelector('.integration-sheet');
  const backgroundRegions = [...document.body.children].flatMap((element) => {
    if (element === integrationSheetLayer) return [];
    if (element.contains(integrationSheetLayer)) {
      return [...element.children].filter((child) => child !== integrationSheetLayer);
    }
    return [element];
  });
  const logo = integrationSheetLayer.querySelector('[data-sheet-logo]');
  const title = integrationSheetLayer.querySelector('[data-sheet-title]');
  const category = integrationSheetLayer.querySelector('[data-sheet-category]');
  const summary = integrationSheetLayer.querySelector('[data-sheet-summary]');
  const boundary = integrationSheetLayer.querySelector('[data-sheet-boundary]');
  const uses = integrationSheetLayer.querySelector('[data-sheet-uses]');

  const closeIntegrationSheet = () => {
    integrationSheetLayer.classList.remove('is-open');
    document.body.classList.remove('sheet-open');
    backgroundRegions.forEach((element) => {
      element.inert = false;
    });
    window.setTimeout(() => {
      integrationSheetLayer.hidden = true;
      integrationSheetTrigger?.focus();
    }, reduceMotion.matches ? 0 : 360);
  };

  const openIntegrationSheet = (trigger) => {
    const detail = integrationDetails[trigger.dataset.integration];
    if (!detail) return;
    integrationSheetTrigger = trigger;
    logo.src = detail.logo;
    logo.alt = `${detail.name} logo`;
    title.textContent = detail.name;
    category.textContent = detail.category;
    summary.textContent = detail.summary;
    boundary.textContent = detail.boundary;
    uses.replaceChildren(...detail.uses.map((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      return listItem;
    }));
    integrationSheetLayer.hidden = false;
    document.body.classList.add('sheet-open');
    backgroundRegions.forEach((element) => {
      element.inert = true;
    });
    window.requestAnimationFrame(() => {
      integrationSheetLayer.classList.add('is-open');
      sheet.focus();
    });
  };

  document.querySelectorAll('[data-integration]').forEach((token) => {
    token.addEventListener('click', () => openIntegrationSheet(token));
  });
  integrationSheetLayer.querySelectorAll('[data-sheet-close]').forEach((control) => control.addEventListener('click', closeIntegrationSheet));
  document.addEventListener('keydown', (event) => {
    if (integrationSheetLayer.hidden) return;
    if (event.key === 'Escape') closeIntegrationSheet();
    if (event.key !== 'Tab') return;
    const focusable = [...integrationSheetLayer.querySelectorAll('button, a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

const integrationRain = document.querySelector('.integration-rain');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (integrationRain && window.Matter && !reduceMotion.matches) {
  const tokens = [...integrationRain.querySelectorAll('.integration-token')];
  let physicsFrame = 0;
  let resizeTimer = 0;
  let started = false;

  const runIntegrationPhysics = () => {
    window.cancelAnimationFrame(physicsFrame);
    const { Engine, Bodies, Body, Composite } = window.Matter;
    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 0.38;

    const width = integrationRain.clientWidth;
    const height = integrationRain.clientHeight;
    const diameter = tokens[0]?.offsetWidth || 64;
    const radius = diameter / 2;
    const floorY = height - 84;
    const stream = [0.2, 0.52, 0.76, 0.35, 0.65, 0.46, 0.82, 0.27, 0.58, 0.72, 0.4];

    integrationRain.classList.add('physics-active');
    const walls = [
      Bodies.rectangle(width / 2, floorY + 22, width + 80, 44, { isStatic: true, friction: 0.35, restitution: 0.18 }),
      Bodies.rectangle(-18, height / 2, 36, height * 2, { isStatic: true }),
      Bodies.rectangle(width + 18, height / 2, 36, height * 2, { isStatic: true }),
    ];

    const bodies = tokens.map((token, index) => {
      const x = Math.max(radius + 7, Math.min(width - radius - 7, width * stream[index]));
      const body = Bodies.circle(x, -radius - index * (diameter * 0.8), radius, {
        restitution: 0.58,
        friction: 0.1,
        frictionStatic: 0.32,
        frictionAir: 0.006,
        density: 0.0012,
        sleepThreshold: 78,
      });
      Body.setAngle(body, ((index % 5) - 2) * 0.09);
      Body.setAngularVelocity(body, ((index % 3) - 1) * 0.018);
      Body.setVelocity(body, { x: ((index % 4) - 1.5) * 0.16, y: 0 });
      return body;
    });

    Composite.add(engine.world, [...walls, ...bodies]);

    let settledFrames = 0;
    let elapsedFrames = 0;
    const tick = () => {
      Engine.update(engine, 1000 / 60);
      bodies.forEach((body, index) => {
        const x = body.position.x - radius;
        const y = body.position.y - radius;
        tokens[index].style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
      });

      const settled = bodies.every((body) => body.isSleeping || (body.speed < 0.055 && body.angularSpeed < 0.025));
      settledFrames = settled ? settledFrames + 1 : 0;
      elapsedFrames += 1;

      if (settledFrames < 96 && elapsedFrames < 1080) {
        physicsFrame = window.requestAnimationFrame(tick);
      } else {
        bodies.forEach((body) => Body.setVelocity(body, { x: 0, y: 0 }));
        integrationRain.classList.add('physics-settled');
      }
    };
    physicsFrame = window.requestAnimationFrame(tick);
  };

  const physicsObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting) || started) return;
    started = true;
    runIntegrationPhysics();
    observer.disconnect();
  }, { threshold: 0.32 });
  physicsObserver.observe(integrationRain);

  window.addEventListener('resize', () => {
    if (!started) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(runIntegrationPhysics, 180);
  });
} else if (integrationRain) {
  integrationRain.classList.add('physics-static');
}

const productLinks = [...document.querySelectorAll('[data-product-link]')];
const productChapters = document.querySelectorAll('[data-product-chapter]');
const productObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((left, right) => Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top))[0];
  if (!visible) return;

  const chapter = visible.target.closest('[data-product-chapter]');
  productLinks.forEach((link) => {
    const active = link.dataset.productLink === chapter?.dataset.productChapter;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, { threshold: 0, rootMargin: '-15% 0px -70%' });

productChapters.forEach((chapter) => productObserver.observe(chapter.querySelector('.chapter-head')));

const signalVisual = document.querySelector('.signal-visual');
signalVisual?.addEventListener('pointermove', (event) => {
  const bounds = signalVisual.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  signalVisual.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
});
signalVisual?.addEventListener('pointerleave', () => {
  signalVisual.style.transform = '';
});
