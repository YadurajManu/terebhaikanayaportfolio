# Portfolio performance and accessibility changes

Measured 4 November 2026. React 19, CRA/CRACO (Webpack), Tailwind; Vercel static output, generated search/agent pages, and serverless API routes. No framework migration or visual redesign.

## Mobile measurements

Lighthouse 13, headless Chrome, default mobile simulated throttling. Before and after use production builds on the same local gzip server. This removes hosting latency as a confounder. Single lab runs, not field Core Web Vitals or a deployed result.

| Metric | Before | After |
| --- | ---: | ---: |
| Performance | 94 | 98 |
| Accessibility | 90 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |
| Agentic browsing | 2/3 | 3/3 |
| FCP | 1.5 s | 0.8 s |
| LCP | 2.8 s | 2.3 s |
| TBT | 130 ms | 20 ms |
| CLS | 0 | 0 |
| Entry JavaScript, gzip | 141.2 KiB | 91.7 KiB |
| Main CSS, gzip | 13.1 KiB | 9.1 KiB |
| Estimated unused JavaScript | 202 KiB | 103 KiB |
| Critical request chain, local | 412 ms | 11 ms |

JavaScript entry size excludes asynchronous feature chunks and third-party scripts. The current production URL was also baselined: Performance 83, Accessibility 90, Best Practices 96, SEO 100, Agentic 2/3, FCP 2.2 s, LCP 3.6 s, TBT 180 ms, CLS 0. Do not compare those network conditions directly with the local after run.

An earlier after run reported 34 KiB unused JavaScript because it did not include the later idle-loaded analytics request. The final run includes PostHog and reports 103 KiB. The <50 KiB overall target remains unmet. Optional SDK/runtime code is unused during a short page-load measurement but remains needed for the requested features.

## Changes by finding

| Issue | Fix | Files |
| --- | --- | --- |
| PostHog unused features | Disable surveys and replay; establish the existing event queue immediately, insert the SDK only after window load and an idle callback. Keep pageviews and manual custom captures. | `frontend/public/index.html` |
| Initial app JavaScript | Lazy below-fold sections, command palette on first open, project modal on selection, boot animation on replay, and 404 route including Game404. Mount Sonner only on the first notification, queueing it until the host subscribes. | `frontend/src/App.js`, `components/CommandPalette.jsx`, `Contact.jsx`, `ToastHost.jsx`, `lib/notify.js` |
| Router development source paths | Explicit production-only aliases to React Router's production ESM entries. Final source maps reference `react-router/dist/production`; development server resolution is unchanged. | `frontend/craco.config.js` |
| Cache TTL | Browser `public, max-age=31536000, immutable` for `/static/*` and versioned `/fonts/*`; revalidate HTML. Existing Brotli verified on the live Vercel asset response. | `frontend/vercel.json` |
| Google Fonts chain and white flash | Host two Latin WOFF2 variable fonts locally, with their OFL licenses, content hashes, preloads and `font-display: swap`. Inline the dark page background before app CSS/JavaScript. Apply local fonts to generated pages too. | `frontend/public/fonts/`, `public/index.html`, `scripts/gen-pages.js`, generated HTML |
| Unused CSS | Scan application code and the two used UI primitives, excluding unused UI library templates. CSS reduced by about 31%. Keep the small stylesheet blocking rather than introducing an unstyled first paint with async CSS. | `frontend/tailwind.config.js` |
| Forced layout | Screenshot's source position maps to Nav's mount-time `scrollY` read. Replace it with an intersection sentinel. Skip initial terminal scrolling; schedule command-driven scrolling in an animation frame. Baseline Lighthouse did not reproduce the reported forced-reflow cost, so no numerical elimination claim is made. | `frontend/src/components/Nav.jsx`, `LiveTerminal.jsx` |
| Form label and contrast | Label the terminal input, use 11px zinc-400 stat labels, raise shared muted text contrast in both themes, darken light-theme green, and remove the availability label's opacity entrance. Give the palette a screen-reader title and description. | `LiveTerminal.jsx`, `Stats.jsx`, `Hero.jsx`, `ui/command.jsx`, `frontend/src/index.css` |
| Console 404 | Remove the broken Plausible script and obsolete error suppression. Update privacy information for PostHog and local fonts. | `frontend/public/index.html`, `scripts/gen-pages.js`, generated privacy pages |
| Cleanup | Correct the shipped-project count after CineVerse retirement and update existing sitemap/privacy expectations. | `frontend/src/data/portfolio.json`, generated pages, existing tests |

## Verification

- Production build passes; source maps retained for diagnosis.
- 117 tests pass, including queued analytics and the lazy notification handoff.
- Existing SEO artifact verification passes for all 15 canonical URLs and the 404 artifact.
- Browser checks pass: terminal help, Control+K open/close/reopen, email-copy notification, project modal, mobile overflow, light theme, and Game404. Clipboard writes were stubbed for the browser interaction check; OS clipboard permission behavior was not certified.
- Browser interaction checks and final Lighthouse record zero console errors.
- Full-page axe WCAG A/AA checks pass in dark and light themes with disclosures expanded and reduced motion enabled. Desktop and mobile screenshots inspected.
- No Google Fonts requests remain in the production sources. Font preloads refer to the two local files. PostHog survey/replay disabled in initialization and covered by a regression test.

Reports on this workstation: `/tmp/portfolio-before.json` (live baseline), `/tmp/portfolio-before-gzip.json` (local baseline), `/tmp/portfolio-final.json` (final local run). Browser captures: `/tmp/portfolio-desktop.png`, `/tmp/portfolio-mobile.png`, `/tmp/portfolio-light.png`.

## Limits and decisions to review

- Not deployed: the previous Vercel CLI link was to a project with no deployments. Production cache headers, real HTTP status behavior, deployment latency and final PageSpeed scores still need validation against the correct deployment.
- Third-party PostHog cache headers cannot be controlled by this repo. Its core SDK is retained to preserve analytics features, despite the remaining unused-JavaScript estimate.
- Critical CSS was reduced rather than loaded asynchronously. The local chain is 11ms; real network latency can make it longer.
- Muted text and light-theme accent colors are intentionally more legible. Layout, typography families, animation features and routing behavior are preserved.
- Below-fold code uses React lazy boundaries; it starts loading when those sections render. Optional dialogs, toasts and the 404 game stay unloaded until needed. Viewport-based section mounting was avoided to preserve navigation anchors and reduce layout-shift risk.
