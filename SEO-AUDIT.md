# Technical SEO audit — yaduraj.me

Audit date: 20 September 2026. Implementation branch: `fix/technical-seo-indexing`.

## Findings and root cause

The application uses React 19, React Router 7, Create React App 5 and CRACO 7. The homepage is a client-rendered application with build-time HTML content injection; `/about`, `/contact`, `/privacy` and `/docs` are generated static documents. Public JSON endpoints run as Vercel functions. The separate FastAPI backend is not a portfolio page generator.

Production checks during this audit found:

| Request | Observed response before deployment |
| --- | --- |
| `https://yaduraj.me/` | 307 to `https://www.yaduraj.me/` |
| `https://www.yaduraj.me/` | 200 |
| `https://www.yaduraj.me/random-garbage-123` | 200, `content-disposition: inline; filename="index.html"` |
| `https://www.yaduraj.me/?page=999` | 200 |
| `http://yaduraj.me/` | 308 to HTTPS |

The homepage, invalid path and query variant shared ETag `2e6a5366f29c8ee27323d5ebbcca4c14` and content length 17,952 bytes. This demonstrates an active homepage fallback for arbitrary URLs, creating an effectively unlimited duplicate/soft-404 URL space. Git commit `691a4ae` previously documented the same Create React App hosting fallback and set `framework: null`, but production still exhibited it during this audit. An explicit middleware route guard now complements that configuration.

The repository does not generate 29,000 legitimate pages: its previous sitemap contained five URLs, with no blog, pagination, search or taxonomy generators. Exact attribution of the approximately 29K Search Console exclusions requires exported URL examples and crawl/referrer logs. The observed fallback explains the mechanism, but does not prove how Google originally discovered every URL. Search Console counts represent known/excluded URLs, not 29K intended indexed pages.

Additional problems: conflicting www/non-www canonical signals, duplicate documentation aliases served through rewrites, query variants, homepage canonical and entity markup carried into the 404 shell, speculative organization/current-employment/education schema, and project case studies available only in interactive dialogs.

## Implemented fixes

- Explicit finite page routing in `frontend/middleware.js`; unknown page paths return HTTP 404 even if upstream static hosting falls back to a 200 homepage. The useful custom error page and interactive game are retained.
- Page-only query strings, HTML aliases and trailing slashes normalize to clean page URLs with 308 responses. API filters remain functional. Unknown project IDs remain 404.
- Canonical origin is `https://yaduraj.me`; homepage ends in `/`, other page paths do not. Each indexable page canonicalizes to itself. Documentation aliases redirect permanently to `/docs`.
- Sitemap generation now emits 15 real documents: homepage, about, contact, privacy, API docs, project index and nine existing case studies. Project IDs come from repository data, never arbitrary requests. Artificial build-date lastmod values were removed.
- Robots allows public crawling and rendering assets and advertises the canonical sitemap. JSON API and alternate machine-readable resources receive noindex headers; robots is not used to hide invalid URLs.
- Homepage metadata and linked Person, WebSite and ProfilePage JSON-LD consistently identify Yaduraj Singh. Only repository-backed profile links and role are used. Unsubstantiated organization, current-employment and alumni claims were removed; the actual past university internship remains visible in experience content.
- Static project pages include unique titles/descriptions, canonical and social metadata, authorship, problem, approach, technical decisions, stack and existing external links. WebPage and breadcrumb data connects them to the person/site.
- Crawlable links connect the homepage, project index and full case studies. Project dialogs remain available; nested interactive card markup was corrected. Closing a 404 via home now performs a full navigation so noindex metadata does not persist onto the homepage.
- Scramble animation respects reduced-motion preferences; labels improve the heading and modal close action. Existing responsive card aspect ratios and lazy image loading remain. No screenshots or personal photographs were fabricated.

## Files changed

Routing: `frontend/vercel.json`, `frontend/middleware.js`, `frontend/api/_lib.js` and API source canonical references.

Generation and metadata: `frontend/public/index.html`, `frontend/scripts/gen-pages.js`, `frontend/scripts/prerender.js`, `frontend/scripts/gen-openapi.js`, generated public HTML/Markdown project pages, sitemap, robots, llms and OpenAPI documents.

UI: `frontend/src/components/{Footer,Hero,ProjectModal,Projects,ScrambleText}.jsx`, `frontend/src/pages/NotFound.jsx`.

Verification: `frontend/src/__tests__/seo.test.js`, existing API/agent tests, `frontend/scripts/verify-seo.js`, `frontend/scripts/verify-agent-readiness.js`, `frontend/package.json`.

Documentation: this audit and `SEARCH-CONSOLE-CHECKLIST.md`.

## Verification

Run from the repository root:

```sh
CI=true npm --prefix frontend test -- --watchAll=false --runInBand --watchman=false
npm --prefix frontend run build
npm --prefix frontend run verify:seo
git diff --check
```

The earlier complete test run passed 112 tests across four suites. The latest production build passed, including CRA's compile/lint check, and emitted 5,149 characters of homepage text before JavaScript. Gzipped main JavaScript is approximately 140 kB and CSS 13 kB. No standalone lint or typecheck script exists; this is JavaScript, not TypeScript. No new packages were added.

The build verifier checks every sitemap document for metadata, a single H1, JSON-LD, canonical origin and internal link targets. Unit tests cover route rejection, page normalization, API filter preservation and 404 metadata. A static artifact check cannot prove production HTTP behavior. After deployment run:

```sh
npm --prefix frontend run verify:seo -- https://yaduraj.me
```

That command also checks actual 404s, redirects and HTTP/www convergence and fails on errors. UI verification must cover homepage, project modal, static case study, 404 game and navigation back home.

## Deployment constraint

Before publishing the www-to-apex redirect, remove Vercel's existing apex-to-www domain redirect. Leave both domains assigned to the production project, make apex serve production, then deploy/promote the tested changes. Configure www to redirect permanently to apex. Otherwise opposite redirects create a loop. Verify project root is `frontend`, build command `npm run build`, output `build`, with no hosting SPA catch-all overriding the repository configuration.

## Remaining recommendations

Measure mobile/desktop Core Web Vitals after deployment; no Lighthouse or field-performance improvement is claimed. The existing 1.5-second intro, animated hero, third-party analytics and replacement of prerendered markup can still affect LCP/CLS/INP. Static case studies require no client bundle. Consider an actual matching React prerender/hydration strategy separately if measurements justify it.

Add genuine project screenshots and exact project repository/App Store links when available; some existing links identify a general profile/store. Keep roles, ages and metrics accurate over time. Keep docs/privacy indexable because they are substantive public documents; do not add thin experience or keyword landing pages. Export Search Console excluded URLs to identify additional historic patterns. Ranking and recrawl timing are controlled by Google; deployment does not immediately remove exclusions.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Vercel project configuration](https://vercel.com/docs/project-configuration).
