const storyData = {
  brief: { title: 'A role everyone can see.', copy: 'Align the team on the brief before the first candidate ever arrives.', metric: '94%', fill: '94%', tags: ['Role brief', 'Scorecard', 'Interview plan'] },
  evidence: { title: 'Evidence, in context.', copy: 'Bring the useful parts of a candidate forward without the noise around them.', metric: '88%', fill: '88%', tags: ['Work sample', 'Assessment', 'Signal map'] },
  decision: { title: 'A decision you can explain.', copy: 'Make the call with a shared record of what the team saw and why it mattered.', metric: '97%', fill: '97%', tags: ['Panel view', 'Decision log', 'Next step'] },
};

document.querySelectorAll('.story-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const data = storyData[tab.dataset.story];
    document.querySelectorAll('.story-tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
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
