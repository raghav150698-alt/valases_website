import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const modified = '2026-08-29';
const assetVersion = '20260829-6';

const nonIndexablePages = new Set([
  'hiring-platform-middle-east.html',
  'hiring-platform-europe.html',
  'hiring-platform-asia.html',
  'jobs-india.html',
]);

const overrides = {
  'index.html': {
    title: 'Hiring Platform & Assessment Software | Valases',
    description: 'Valases is a hiring and online assessment platform for employers in India and global teams, connecting applications, interviews, offers, and onboarding.',
  },
  'hiring.html': {
    title: 'Hiring Platform for Employers & Recruiters | Valases',
    description: 'Manage requisitions, candidates, applicant tracking, online assessments, interviews, offers, and onboarding in one connected hiring platform.',
  },
  'assessments.html': {
    title: 'Online Assessment Platform for Hiring | Valases',
    description: 'Create role-relevant online assessments for coding, spreadsheets, accounting, tax, MCQs, and case studies with explainable scoring and human review.',
  },
  'candidate-experience.html': {
    title: 'Candidate Assessments & Application Experience | Valases',
    description: 'A clear and secure candidate application and online assessment experience with transparent timing, consent, autosave, privacy, and human review.',
  },
  'onboarding.html': {
    title: 'Employee Onboarding Software | Valases',
    description: 'Coordinate documents, tasks, owners, access, equipment, and first-day readiness with employee onboarding software connected to the hiring record.',
  },
  'enterprise.html': {
    title: 'Enterprise Hiring Platform & Controls | Valases',
    description: 'Enterprise hiring software with role-based access, auditability, privacy controls, regional deployment choices, and accountable assessment review.',
  },
  'integrations.html': {
    title: 'Hiring Software Integrations | Valases',
    description: 'Connect Valases hiring software with ATS, HRIS, calendar, meeting, and communication tools through controlled enterprise integration boundaries.',
  },
  'pricing.html': {
    title: 'Hiring Software Pricing for India & Global Teams | Valases',
    description: 'Compare Valases hiring platform pricing for employers in India and global teams, with plans for recruitment operations and modular online assessments.',
  },
  'demo.html': {
    title: 'Hiring Platform Demo & Product Briefing | Valases',
    description: 'Book a tailored Valases hiring platform and online assessment software demonstration for your recruitment team.',
  },
  'trust.html': {
    title: 'Hiring Platform Security & Trust Center | Valases',
    description: 'Review Valases security architecture, privacy controls, data residency choices, role-based access, auditability, and responsible assessment review.',
  },
  'accessibility.html': {
    title: 'Website Accessibility Commitment | Valases',
    description: 'Learn how Valases approaches accessible website and product experiences, keyboard access, readable interfaces, and ongoing WCAG 2.2 review.',
  },
  'candidate-privacy.html': {
    title: 'Candidate Privacy Notice for Assessments | Valases',
    description: 'Understand how candidate information, assessment responses, consent, proctoring signals, and employer-controlled hiring records are handled in Valases.',
  },
  'privacy.html': {
    title: 'Website Privacy Policy | Valases',
    description: 'Read the Valases website privacy policy, including information collection, use, storage, sharing, security, choices, and contact details.',
  },
  'cookies.html': {
    title: 'Cookie and Website Storage Notice | Valases',
    description: 'Read how the Valases website uses essential storage, how future analytics or preference tools would be disclosed, and how to contact us.',
  },
  'terms.html': {
    title: 'Website Terms of Use | Valases',
    description: 'Read the terms governing access to and use of the public Valases website, including permitted use, intellectual property, and disclaimers.',
  },
  'status.html': {
    title: 'Valases Platform Service Status | Valases',
    description: 'View the public rollout and availability status of Valases website, hiring, assessment, onboarding, and supporting platform services.',
  },
};

const pageServices = {
  'hiring.html': {
    serviceType: 'Hiring platform for applicant tracking, assessments, interviews, offers, and onboarding',
    areaServed: [{ '@type': 'Place', name: 'Worldwide' }],
  },
  'assessments.html': {
    serviceType: 'Online assessment platform for role-relevant hiring evaluations',
    areaServed: [{ '@type': 'Place', name: 'Worldwide' }],
  },
  'hiring-platform-india.html': {
    serviceType: 'Hiring platform and online assessment software for employers in India',
    areaServed: [{ '@type': 'Country', name: 'India' }],
  },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapeRegex(key)}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  return pattern.test(html)
    ? html.replace(pattern, `<meta ${attribute}="${key}" content="${value}" />`)
    : html;
}

function addMetaAfterDescription(html, meta) {
  if (html.includes(meta)) return html;
  return html.replace(/(<meta name="description"[^>]*>)/i, `$1${meta}`);
}

for (const filename of readdirSync(root).filter((name) => name.endsWith('.html'))) {
  const filepath = join(root, filename);
  let html = readFileSync(filepath, 'utf8');
  const override = overrides[filename];

  html = html
    .replace(/pages\.css\?v=[^"']+/i, `pages.css?v=${assetVersion}`)
    .replace(/pages\.js\?v=[^"']+/i, `pages.js?v=${assetVersion}`);

  if (override) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${override.title}</title>`);
    html = replaceMeta(html, 'name', 'description', override.description);
    html = replaceMeta(html, 'property', 'og:title', override.title);
    html = replaceMeta(html, 'property', 'og:description', override.description);
    html = replaceMeta(html, 'name', 'twitter:title', override.title);
    html = replaceMeta(html, 'name', 'twitter:description', override.description);
  }

  html = replaceMeta(
    html,
    'name',
    'robots',
    nonIndexablePages.has(filename)
      ? 'noindex,follow,noarchive'
      : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  );

  html = addMetaAfterDescription(html, '<meta name="author" content="Valases" /><meta name="application-name" content="Valases" />');
  if (!/name="twitter:image:alt"/i.test(html)) {
    html = html.replace(/(<meta name="twitter:image"[^>]*>)/i, '$1<meta name="twitter:image:alt" content="Valases hiring and assessment platform" />');
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1]?.trim();
  const language = html.match(/<html lang="([^"]*)"/i)?.[1] || 'en';
  if (!title || !description || !canonical) throw new Error(`Missing core SEO metadata in ${filename}`);

  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);

  const pageName = title.replace(/\s*\|\s*Valases\s*$/i, '');
  const page = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: pageName,
    description,
    isPartOf: { '@id': 'https://valases.com/#website' },
    publisher: { '@id': 'https://valases.com/#organization' },
    inLanguage: language,
    dateModified: modified,
  };

  if (filename === 'jobs-india.html') {
    page.audience = { '@type': 'Audience', audienceType: 'Job candidates in India' };
  }

  const graph = [page];
  if (filename !== 'index.html') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://valases.com/' },
        { '@type': 'ListItem', position: 2, name: pageName, item: canonical },
      ],
    });
  }

  const service = pageServices[filename];
  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: pageName,
      serviceType: service.serviceType,
      provider: { '@id': 'https://valases.com/#organization' },
      areaServed: service.areaServed,
      audience: { '@type': 'BusinessAudience', audienceType: 'Employers and hiring teams' },
      url: canonical,
    });
  }

  html = html.replace(/\s*<script type="application\/ld\+json" data-seo-page>[\s\S]*?<\/script>/i, '');
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  html = html.replace(/<\/head>/i, `  <script type="application/ld+json" data-seo-page>${schema}</script>\n</head>`);
  writeFileSync(filepath, html, 'utf8');
}

console.log('Applied static SEO metadata and page schema to all HTML files.');
