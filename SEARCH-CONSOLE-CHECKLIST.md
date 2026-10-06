# Search Console deployment and recovery checklist

Canonical site: https://yaduraj.me/

## Before release

- [ ] Run tests, production build, `verify:seo` and `git diff --check`.
- [ ] Verify the preview UI: homepage, project dialog, full project page, unknown route, 404 game and return-home navigation.
- [ ] Check Vercel project root `frontend`, output `build`, framework override `null`, and no SPA fallback.
- [ ] Remove the existing `yaduraj.me` → `www.yaduraj.me` domain redirect before activating the reverse redirect. Keep both domains connected to production.
- [ ] Deploy/promote the verified changes, then configure permanent www → apex redirection. Preserve the prior deployment for rollback; restore compatible domain settings if rolling back.

## Verify production before requesting indexing

```sh
npm --prefix frontend run verify:seo -- https://yaduraj.me
```

- [ ] Homepage, all 15 sitemap URLs, robots and sitemap return 200 without redirects or noindex.
- [ ] `/random-garbage-123`, `/test-does-not-exist`, `/projects/not-a-real-project`, `/undefined`, `/null` and unknown API endpoint return 404.
- [ ] HTTP upgrades permanently to HTTPS; www reaches non-www without a loop.
- [ ] `/?page=999`, trailing slash and HTML aliases permanently reach the clean canonical page.
- [ ] Confirm the canonical, title, description, visible identity and JSON-LD in delivered HTML.

## Google Search Console actions

1. Open the verified domain property `sc-domain:yaduraj.me` (or the verified `https://yaduraj.me/` URL-prefix property). Do not create a duplicate property if one already exists.
2. Export Page Indexing examples for soft 404, duplicate without canonical and crawled-currently-not-indexed. Retain a dated baseline; classify sampled paths by random paths, query variants, www aliases and legitimate pages.
3. Inspect `https://yaduraj.me/` using the top URL inspection field. Select **Test live URL**. Confirm Google can fetch the page, indexing is allowed and the declared canonical is the apex homepage. Inspect the rendered result if available.
4. Select **Request indexing** after the live test passes. Complete any account authentication or CAPTCHA personally if required. Repeated requests do not speed crawling.
5. Open **Sitemaps**, submit `https://yaduraj.me/sitemap.xml` (or `sitemap.xml` where the property prefix is supplied). Verify submission confirmation and subsequently **Success**, with 15 discovered pages. Resubmit the canonical sitemap if already present; do not submit API, query or redirected sitemap variants.
6. Live-test a genuine project such as `/projects/tollgate` and a formerly excluded invalid URL. The project should be indexable, while the invalid URL must be a real 404.
7. In **Page indexing**, open the relevant soft-404 and duplicate-without-user-selected-canonical issue reports. Select **Validate fix** where offered after representative examples have the intended response. Record validation status/date. Do not request indexing for nonexistent pages.
8. Treat proper alternate canonicals, intentional redirects, intentional noindex and genuine 404s as expected exclusions, not defects requiring universal indexing. Crawled-currently-not-indexed can persist for legitimate pages; inspect quality and selected canonical rather than submitting every excluded URL.
9. Monitor **Performance → Search results**, with query filters for `Yaduraj Singh`, `Yaduraj`, `Yaduraj Singh developer`, `Yaduraj Singh AI engineer` and university-related searches. Compare impressions, clicks and selected landing pages over comparable periods.
10. Recheck Page Indexing, sitemap processing and Google-selected canonicals after recrawls, initially after 1–2 weeks and again after 4–6 weeks. These are review intervals, not guarantees. Exclusion history may remain visible after the underlying behavior is corrected.

## Completion record

Record actual deployment URL/time, HTTP verification result, sitemap submission outcome, homepage indexing-request confirmation, issue validation statuses and any account-access blocker. An unchecked action is not a claim that it was performed. Google decides whether and when to index; **Request indexing** and **Validate fix** start processes, not immediate completion.

## October 7, 2026 audit implementation

- MuhDikhai now describes the public source at revision `8ae5018`: offer/answer/ICE sequence, configurable TURN, Redis matching, five-second disconnect cleanup, and source links. Previous unverified latency and overload claims were removed.
- Homepage, Tollgate and Fleet OS descriptions were shortened; the recruiter path and finite sitemap were retained.
- The indexed legacy path `https://www.yaduraj.me/Resume.pdf` was checked: www redirects to apex, then returns 404. A permanent `/Resume.pdf` → `/Resume_Web.pdf` redirect is now configured to recover those existing links.
- After deployment, inspect the homepage and `/projects/muhdikhai` in the existing Search Console property. Request indexing once after live tests pass; record the Google-selected canonical. Compare name-query and WebRTC impressions after recrawl. These account-side actions are pending, not completed by this commit.
- Fleet OS and Tollgate remain future content opportunities. No tutorial was invented from keyword volume alone.

## Name discovery: Yaduraj

- Homepage site-name metadata consistently uses `Yaduraj Singh`, with `Yaduraj` and `yaduraj.me` as alternate website names. Person markup also identifies the visible first name and public GitHub handle. This clarifies identity and site-name preference; it does not guarantee rankings.
- In Search Console, inspect the apex homepage, confirm Google's selected canonical, and request indexing after a successful live test. Track the exact query `yaduraj` separately from `yaduraj singh` and developer-related variants.
- Use the same full name and portfolio URL on your GitHub and LinkedIn profiles. Add an author/about link from your own public project websites and repository READMEs where useful to visitors. These external edits have not been performed by this commit.
- Earn relevant references through published technical case studies, university/hackathon profiles and the verified paper's author page where editable. Do not buy links or create unrelated listings to target the first name.
- Ranking first for an ambiguous first name remains a competitive goal; there is no fixed recrawl date or guaranteed position.
