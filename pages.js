const headerRoot = document.querySelector('[data-site-header]');
const footerRoot = document.querySelector('[data-site-footer]');

const pagePath = window.location.pathname.split('/').pop() || 'index.html';

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
        <a href="pricing.html">Pricing</a>
          <a href="company.html">Company</a>
          <a href="trust.html">Trust</a>
          <a class="mobile-briefing" href="demo.html">Book a briefing</a>
        </nav>
        <div class="sub-header-actions">
          <a class="sub-login" href="https://app.valases.com">Log in</a>
          <a class="sub-cta" href="demo.html">Book a briefing <span aria-hidden="true">&nearr;</span></a>
        </div>
        <button class="sub-menu" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span></button>
      </div>
    </header>`;

  headerRoot.querySelectorAll('.sub-nav a').forEach((link) => {
    if (link.getAttribute('href') === pagePath) link.setAttribute('aria-current', 'page');
  });

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
}

if (footerRoot) {
  footerRoot.innerHTML = `
    <footer class="sub-footer">
      <div class="page-wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="sub-brand" href="index.html"><img src="public/valases-logo-cropped.png" alt="" /><span>valases</span></a>
            <p>The enterprise hiring operating system for teams that choose with evidence.</p>
          </div>
          <div class="footer-column"><strong>PRODUCT</strong><a href="hiring.html">Hiring operations</a><a href="assessments.html">Assessment studio</a><a href="candidate-experience.html">Candidate experience</a><a href="enterprise.html">Enterprise control</a></div>
          <div class="footer-column"><strong>EXPLORE</strong><a href="pricing.html">Pricing</a><a href="integrations.html">Integrations</a><a href="implementation.html">Implementation</a><a href="status.html">Status</a></div>
          <div class="footer-column"><strong>COMPANY</strong><a href="company.html">Our USP</a><a href="trust.html">Trust center</a><a href="demo.html">Book a briefing</a><a href="mailto:hello@valases.com">Contact</a></div>
          <div class="footer-column"><strong>LEGAL</strong><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="cookies.html">Cookies</a><a href="candidate-privacy.html">Candidate privacy</a><a href="proctoring.html">Proctoring notice</a><a href="accessibility.html">Accessibility</a></div>
        </div>
        <div class="footer-bottom"><span>&copy; 2026 Valases. All rights reserved.</span><span>Hiring, with signal.</span></div>
      </div>
    </footer>`;
}

const demoForm = document.querySelector('[data-demo-form]');
if (demoForm) {
  const submitButton = demoForm.querySelector('button[type="submit"]');
  const status = demoForm.querySelector('[data-form-status]');

  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!demoForm.reportValidity()) return;

    const formData = new FormData(demoForm);
    const payload = Object.fromEntries(formData.entries());
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="button-spinner" aria-hidden="true"></span> Sending request';
    status.className = 'form-status';
    status.textContent = 'Securely sending your request...';

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your request could not be sent.');
      demoForm.reset();
      status.className = 'form-status success';
      status.textContent = 'Thank you. We will contact you within one business day.';
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = error.message || 'Your request could not be sent. Email hello@valases.com instead.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Request a briefing <span aria-hidden="true">&nearr;</span>';
    }
  });
}
