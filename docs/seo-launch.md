# Valases SEO launch checklist

The website now concentrates organic-search authority on the global Hiring Platform and Online Assessment Platform pages, with one crawlable regional page for employers in India. The retired Middle East, Europe, Asia, and Jobs India experiments have production redirects to their closest useful destination; their fallback files remain `noindex` and are excluded from navigation and the sitemap. Technical implementation improves eligibility and relevance; it cannot guarantee a particular ranking or a number-one position.

## After deployment

1. Verify `https://valases.com/` as a domain property in Google Search Console.
2. Submit `https://valases.com/sitemap.xml` and inspect the homepage, hiring, assessments, and India employer URLs.
3. Request indexing for the homepage, global hiring platform, online assessment platform, and India employer page after the production deployment is live.
4. Run `node scripts/validate-seo.mjs` before each release.
5. Monitor indexing, search queries, country, device, click-through rate, and Core Web Vitals in Search Console.

## Search themes supported by the current pages

- Employers in India: hiring platform India, recruitment software India, applicant tracking, online assessment platform, pre-employment assessment tools, coding and spreadsheet assessments.
- Global employers: hiring platform, hiring software, recruitment platform, applicant tracking, online assessments, structured interviews, offers, and onboarding.
- Candidates: employer-issued assessment access, assessment privacy, proctoring notices, autosave, and human review.

## Real vacancies and Google Jobs

Do not index `jobs-india.html` or add `JobPosting` structured data to it; Valases does not currently expose a public job board. When Valases exposes public employer jobs, each vacancy needs its own crawlable page with a visible complete description, location or remote eligibility, employer identity, posting and expiry dates, employment type, and a working application action. Add `JobPosting` JSON-LD only to that matching vacancy page and remove or update expired roles promptly.

## Ongoing authority work

Technical SEO is only the foundation. Sustainable rankings also require useful original content, real customer or partner references where permission exists, relevant industry links, accurate product updates, and production performance monitoring. Avoid copied regional pages, fabricated reviews, fake vacancies, doorway pages, and keyword stuffing.
