/* ============================================================
   pages.js — Valases sub-page scripts (v20260731 improved)
   ============================================================ */

/* ---------- Page Identification & Entrance Animation ---------- */
const headerRoot = document.querySelector('[data-site-header]');
const footerRoot = document.querySelector('[data-site-footer]');

const pagePath = window.location.pathname.split('/').pop() || 'index.html';
const pageSlug = pagePath.replace(/\.html$/i, '') || 'home';
document.body.dataset.page = pageSlug;
document.body.classList.add('page-entering');

/* ---------- Dark Mode (persisted) ---------- */
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('valases-theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
  document.body.classList.add('dark-mode');
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('valases-theme', isDark ? 'dark' : 'light');
  const btn = document.querySelector('.dm-toggle');
  if (btn) btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

/* ---------- Toast Notification System ---------- */
let toastContainer = document.querySelector('.toast-container');
if (!toastContainer) {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('aria-live', 'polite');
  toastContainer.setAttribute('aria-atomic', 'false');
  document.body.appendChild(toastContainer);
}

function showToast(message, type = 'success', duration = 4500) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : '✕';
  toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${icon}</span><span>${message}</span><button class="toast-close" type="button" aria-label="Dismiss">×</button>`;
  toastContainer.appendChild(toast);

  const dismiss = () => {
    toast.classList.add('toast-exiting');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  if (duration > 0) setTimeout(dismiss, duration);
  return dismiss;
}

/* ---------- Scroll-to-Top Button ---------- */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top of page');
scrollTopBtn.setAttribute('title', 'Back to top');
scrollTopBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><polyline points="18 15 12 9 6 15"/></svg>`;
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

let scrollTopVisible = false;
window.addEventListener('scroll', () => {
  const shouldShow = window.scrollY > 420;
  if (shouldShow !== scrollTopVisible) {
    scrollTopVisible = shouldShow;
    scrollTopBtn.classList.toggle('visible', shouldShow);
  }
}, { passive: true });

/* ---------- Sub-header Injection ---------- */
const integrationNames = {
  greenhouse: 'Greenhouse',
  lever: 'Lever',
  workday: 'Workday',
  ashby: 'Ashby',
  bamboohr: 'BambooHR',
  sap: 'SAP SuccessFactors',
  'google-calendar': 'Google Calendar',
  outlook: 'Microsoft Outlook',
  teams: 'Microsoft Teams',
  zoom: 'Zoom',
  twilio: 'Twilio Voice',
};

if (headerRoot) {
  headerRoot.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="sub-header">
      <div class="sub-header-inner">
        <a class="sub-brand" href="index.html" aria-label="Valases home">
          <img src="public/valases-logo-cropped.png" alt="" />
          <span>valases</span>
        </a>
      <nav class="sub-nav" aria-label="Main navigation">
        <a href="index.html">Home</a>
        <a href="hiring.html">Hiring</a>
        <a href="assessments.html">Assessments</a>
        <a href="onboarding.html">Onboarding</a>
        <a href="pricing.html">Pricing</a>
          <a href="company.html">Company</a>
          <a href="trust.html">Trust</a>
          <a class="mobile-briefing" href="demo.html">Book a briefing</a>
        </nav>
        <div class="sub-header-actions">
          <button class="dm-toggle" type="button" aria-label="${document.body.classList.contains('dark-mode') ? 'Switch to light mode' : 'Switch to dark mode'}">
            <span class="dm-sun" aria-hidden="true">☀</span>
            <span class="dm-moon" aria-hidden="true">☽</span>
          </button>
          <a class="sub-login" href="https://app.valases.com">Log in</a>
          <a class="sub-cta" href="demo.html">Book a briefing <span aria-hidden="true">&nearr;</span></a>
        </div>
        <button class="sub-menu" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span></button>
      </div>
    </header>`;

  /* Mark current page in nav */
  headerRoot.querySelectorAll('.sub-nav a').forEach((link) => {
    if (link.getAttribute('href') === pagePath) link.setAttribute('aria-current', 'page');
  });

  /* Dark mode toggle handler */
  headerRoot.querySelector('.dm-toggle')?.addEventListener('click', toggleDarkMode);

  /* Mobile nav */
  const menuButton = headerRoot.querySelector('.sub-menu');
  const navigation = headerRoot.querySelector('.sub-nav');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('mobile-open', !open);
    document.body.classList.toggle('no-scroll', !open);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('mobile-open');
      document.body.classList.remove('no-scroll');
    }
  });

  /* Sub-header scroll shadow */
  const subHeader = headerRoot.querySelector('.sub-header');
  if (subHeader) {
    window.addEventListener('scroll', () => {
      subHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }
}

/* ---------- Footer Injection ---------- */
if (footerRoot) {
  footerRoot.innerHTML = `
    <footer class="sub-footer">
      <div class="page-wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="sub-brand" href="index.html"><img src="public/valases-logo-cropped.png" alt="" /><span>valases</span></a>
            <p>The assessment-led hiring and onboarding platform for teams that choose with evidence and start with clarity.</p>
          </div>
          <div class="footer-column"><strong>PRODUCT</strong><a href="hiring.html">Hiring platform</a><a href="assessments.html">Assessment platform</a><a href="onboarding.html">Onboarding</a><a href="candidate-experience.html">Candidate experience</a></div>
          <div class="footer-column"><strong>EXPLORE</strong><a href="pricing.html">Pricing</a><a href="integrations.html">Integrations</a><a href="implementation.html">Implementation</a><a href="status.html">Status</a></div>
          <div class="footer-column"><strong>MARKETS</strong><a href="hiring.html">Global hiring platform</a><a href="hiring-platform-india.html">Hiring platform for India</a></div>
          <div class="footer-column"><strong>COMPANY</strong><a href="company.html">Our USP</a><a href="trust.html">Trust center</a><a href="demo.html">Book a briefing</a><a href="mailto:hello@valases.com">Contact</a></div>
          <div class="footer-column"><strong>LEGAL</strong><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="cookies.html">Cookies</a><a href="candidate-privacy.html">Candidate privacy</a><a href="proctoring.html">Proctoring notice</a><a href="accessibility.html">Accessibility</a></div>
        </div>
        <div class="footer-bottom"><span>&copy; 2026 Valases. All rights reserved.</span><span>From candidate to ready.</span></div>
      </div>
    </footer>`;
}

/* ---------- Integration Token Tooltips ---------- */
document.querySelectorAll('[data-integration]').forEach((token) => {
  const key = token.dataset.integration;
  const name = integrationNames[key];
  if (!name) return;
  const tip = document.createElement('span');
  tip.className = 'integration-tooltip';
  tip.textContent = name;
  tip.setAttribute('aria-hidden', 'true');
  token.appendChild(tip);
});

/* ---------- Pricing Card Billing Toggle ---------- */
const priceCards = [...document.querySelectorAll('[data-price-card]')];

if (priceCards.length) {
  const requestedBilling = new URLSearchParams(window.location.search).get('billing');

  priceCards.forEach((card) => {
    const billingControls = [...card.querySelectorAll('[data-card-billing]')];
    let activeBilling = requestedBilling === 'monthly' ? 'monthly' : 'annual';

    const renderBilling = () => {
      const annual = activeBilling === 'annual';
      billingControls.forEach((control) => {
        const active = control.dataset.cardBilling === activeBilling;
        control.classList.toggle('active', active);
        control.setAttribute('aria-pressed', String(active));
      });

      const price = card.querySelector('[data-plan-price]');
      const offer = card.querySelector('[data-launch-offer]');
      const transition = card.querySelector('[data-price-transition]');
      const standardPrice = card.querySelector('[data-standard-price]');
      const note = card.querySelector('[data-price-note]');
      const cta = card.querySelector('[data-plan-cta]');
      price.textContent = annual ? card.dataset.annualPrice : card.dataset.monthlyPrice;
      offer.hidden = !annual;
      transition.hidden = !annual;
      standardPrice.textContent = `$${card.dataset.annualStandard}/month`;
      note.textContent = annual
        ? `12-MONTH COMMITMENT / $${card.dataset.annualTotal} FIRST YEAR`
        : 'FLEXIBLE MONTHLY PLAN / NO ANNUAL COMMITMENT';
      cta.href = `demo.html?plan=${card.dataset.plan}&billing=${activeBilling}`;
      card.classList.toggle('monthly-price', !annual);
    };

    billingControls.forEach((control) => control.addEventListener('click', () => {
      activeBilling = control.dataset.cardBilling;
      renderBilling();
    }));
    renderBilling();
  });
}

/* ---------- Demo Request Form with Inline Validation ---------- */
const demoForm = document.querySelector('[data-demo-form]');
if (demoForm) {
  const submitButton = demoForm.querySelector('button[type="submit"]');
  const status = demoForm.querySelector('[data-form-status]');
  const productInterest = demoForm.querySelector('[name="product_interest"]');
  const requestedPlan = new URLSearchParams(window.location.search).get('plan');
  const billingInterest = demoForm.querySelector('[name="billing_interest"]');
  const requestedBilling = new URLSearchParams(window.location.search).get('billing');
  const validPlans = new Set(['hire-core', 'hire-growth', 'assess', 'enterprise']);
  const validBilling = new Set(['annual', 'monthly', 'discuss']);
  if (productInterest && validPlans.has(requestedPlan)) productInterest.value = requestedPlan;
  if (billingInterest && validBilling.has(requestedBilling)) billingInterest.value = requestedBilling;

  /* Inline field validation */
  const getOrCreateError = (field) => {
    let err = field.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('aria-live', 'polite');
      field.parentElement.appendChild(err);
    }
    return err;
  };

  const validateField = (field) => {
    const err = getOrCreateError(field);
    if (!field.validity.valid) {
      field.classList.add('invalid');
      field.classList.remove('valid');
      if (field.validity.valueMissing) err.textContent = 'This field is required.';
      else if (field.validity.typeMismatch) err.textContent = 'Please enter a valid email address.';
      else if (field.validity.tooLong) err.textContent = `Maximum ${field.maxLength} characters.`;
      else err.textContent = 'Please check this field.';
      return false;
    } else {
      field.classList.remove('invalid');
      field.classList.add('valid');
      err.textContent = '';
      return true;
    }
  };

  /* Validate on blur for real-time feedback */
  demoForm.querySelectorAll('input:not([type="checkbox"]):not([name="website"]), select, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    /* Validate all fields before submitting */
    const fields = [...demoForm.querySelectorAll('input:not([type="checkbox"]):not([name="website"]), select, textarea')];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      const firstInvalid = demoForm.querySelector('.invalid');
      firstInvalid?.focus();
      return;
    }

    if (!demoForm.reportValidity()) return;

    const formData = new FormData(demoForm);
    const payload = Object.fromEntries(formData.entries());
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="button-spinner" aria-hidden="true"></span> Sending request';
    if (status) { status.className = 'form-status'; status.textContent = 'Securely sending your request...'; }

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your request could not be sent.');
      demoForm.reset();
      demoForm.querySelectorAll('.valid,.invalid').forEach((f) => f.classList.remove('valid','invalid'));
      if (status) { status.className = 'form-status success'; status.textContent = 'Thank you. We will contact you within one business day.'; }
      showToast('Briefing request sent! We\'ll be in touch within one business day.', 'success', 5500);
    } catch (error) {
      if (status) { status.className = 'form-status error'; status.textContent = error.message || 'Your request could not be sent. Email hello@valases.com instead.'; }
      showToast(error.message || 'Could not send request. Please email hello@valases.com.', 'error', 6000);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Request a briefing <span aria-hidden="true">&nearr;</span>';
    }
  });
}
