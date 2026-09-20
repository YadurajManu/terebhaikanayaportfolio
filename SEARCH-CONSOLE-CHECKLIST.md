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
