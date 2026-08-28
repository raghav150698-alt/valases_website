import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const errors = [];
const warnings = [];
const titles = new Map();
const canonicals = new Map();
const indexableCanonicals = new Set();
const nonIndexablePages = new Set([
  'hiring-platform-middle-east.html',
  'hiring-platform-europe.html',
  'hiring-platform-asia.html',
  'jobs-india.html',
]);

const get = (html, pattern) => html.match(pattern)?.[1]?.trim() || '';
const stripTags = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

for (const filename of files) {
  const html = readFileSync(join(root, filename), 'utf8');
  const title = get(html, /<title>([\s\S]*?)<\/title>/i);
  const description = get(html, /<meta name="description" content="([^"]*)"/i);
  const canonical = get(html, /<link rel="canonical" href="([^"]*)"/i);
  const ogTitle = get(html, /<meta property="og:title" content="([^"]*)"/i);
  const ogDescription = get(html, /<meta property="og:description" content="([^"]*)"/i);
  const ogUrl = get(html, /<meta property="og:url" content="([^"]*)"/i);
  const twitterTitle = get(html, /<meta name="twitter:title" content="([^"]*)"/i);
  const twitterDescription = get(html, /<meta name="twitter:description" content="([^"]*)"/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const markerCount = (html.match(/data-seo-page/g) || []).length;

  if (!title) errors.push(`${filename}: missing title`);
  if (!description) errors.push(`${filename}: missing meta description`);
  if (!canonical) errors.push(`${filename}: missing canonical`);
  if (h1Count !== 1) errors.push(`${filename}: expected one H1, found ${h1Count}`);
  if (markerCount !== 1) errors.push(`${filename}: expected one generated page schema, found ${markerCount}`);
  const shouldIndex = !nonIndexablePages.has(filename);
  if (shouldIndex && !/name="robots" content="index,follow/i.test(html)) errors.push(`${filename}: page is not explicitly indexable`);
  if (!shouldIndex && !/name="robots" content="noindex,follow/i.test(html)) errors.push(`${filename}: retired SEO page must be noindex,follow`);
  if (/name="keywords"/i.test(html)) warnings.push(`${filename}: meta keywords are unnecessary`);

  if (title.length < 25 || title.length > 65) warnings.push(`${filename}: title length is ${title.length}`);
  if (description.length < 70 || description.length > 170) warnings.push(`${filename}: description length is ${description.length}`);
  if (ogTitle !== title) errors.push(`${filename}: Open Graph title differs from title`);
  if (ogDescription !== description) errors.push(`${filename}: Open Graph description differs from meta description`);
  if (twitterTitle !== title) errors.push(`${filename}: Twitter title differs from title`);
  if (twitterDescription !== description) errors.push(`${filename}: Twitter description differs from meta description`);
  if (ogUrl !== canonical) errors.push(`${filename}: Open Graph URL differs from canonical`);

  if (titles.has(title)) errors.push(`${filename}: duplicate title also used by ${titles.get(title)}`);
  titles.set(title, filename);
  if (canonicals.has(canonical)) errors.push(`${filename}: duplicate canonical also used by ${canonicals.get(canonical)}`);
  canonicals.set(canonical, filename);
  if (shouldIndex) indexableCanonicals.add(canonical);

  const schemaBlocks = [...html.matchAll(/<script type="application\/ld\+json"(?:\s+data-seo-page)?>([\s\S]*?)<\/script>/gi)];
  if (!schemaBlocks.length) errors.push(`${filename}: no JSON-LD found`);
  for (const [, block] of schemaBlocks) {
    try {
      JSON.parse(block);
    } catch (error) {
      errors.push(`${filename}: invalid JSON-LD (${error.message})`);
    }
  }

  if (filename === 'jobs-india.html' && /"@type"\s*:\s*"JobPosting"/.test(html)) {
    errors.push(`${filename}: generic candidate guide must not use JobPosting schema`);
  }

  for (const match of html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) continue;
    const target = href.split(/[?#]/)[0];
    if (!target || !target.endsWith('.html')) continue;
    if (!existsSync(join(root, target))) errors.push(`${filename}: broken internal link to ${target}`);
  }

  for (const match of html.matchAll(/<img\s+([^>]+)>/gi)) {
    if (!/\balt="[^"]*"/i.test(match[1])) errors.push(`${filename}: image missing alt attribute`);
  }

  if (stripTags(html).length < 250) warnings.push(`${filename}: very little indexable text`);
}

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
for (const canonical of indexableCanonicals) {
  if (!sitemapUrls.has(canonical)) errors.push(`sitemap.xml: missing ${canonical}`);
}
for (const url of sitemapUrls) {
  if (!canonicals.has(url)) errors.push(`sitemap.xml: URL has no canonical HTML page: ${url}`);
  if (canonicals.has(url) && nonIndexablePages.has(canonicals.get(url))) errors.push(`sitemap.xml: noindex page must be excluded: ${url}`);
}

const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://valases.com/sitemap.xml')) errors.push('robots.txt: sitemap declaration missing');
if (!existsSync(join(root, 'public', 'valases-logo-cropped.png'))) errors.push('Organization logo asset is missing');

if (warnings.length) {
  console.log(`SEO warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
if (errors.length) {
  console.error(`SEO validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`SEO validation passed: ${files.length} pages, ${indexableCanonicals.size} indexable canonicals, ${sitemapUrls.size} sitemap URLs.`);
