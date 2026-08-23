#!/usr/bin/env node
/**
 * Verifies the agent-readiness fixes against a running origin.
 *
 *   node scripts/verify-agent-readiness.js https://www.yaduraj.me
 *   node scripts/verify-agent-readiness.js http://localhost:5000
 *
 * Checks marked `hosting` depend on vercel.json / middleware and therefore only
 * pass against a real Vercel deployment — a plain static file server cannot
 * reproduce redirects, edge middleware or the JSON API.
 *
 * Exit code is non-zero if any non-hosting check fails.
 */
const ORIGIN = (process.argv[2] || "https://www.yaduraj.me").replace(/\/$/, "");

const results = [];

function record(id, label, passed, detail, kind = "core") {
  results.push({ id, label, passed, detail, kind });
}

async function get(path, headers = {}) {
  const res = await fetch(`${ORIGIN}${path}`, { headers, redirect: "manual" });
  const body = await res.text().catch(() => "");
  return { status: res.status, headers: res.headers, body };
}

const visibleText = (html) =>
  html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function main() {
  // 1 — agent-friendly 404
  try {
    const r = await get("/some-path-that-does-not-exist-" + Date.now());
    record(
      "404",
      "Unknown paths return HTTP 404",
      r.status === 404,
      `got ${r.status}`,
      "hosting"
    );
    record(
      "404-body",
      "404 body points agents at llms.txt / sitemap",
      /llms\.txt/.test(r.body) && /sitemap\.xml/.test(r.body),
      "",
      "hosting"
    );
  } catch (e) {
    record("404", "Unknown paths return HTTP 404", false, e.message, "hosting");
  }

  // 2 — content without JavaScript
  const home = await get("/");
  const text = visibleText(home.body);
  record("h1", "Homepage has an <h1> in raw HTML", /<h1[\s>]/i.test(home.body));
  record("text", "Homepage has 500+ chars without JS", text.length >= 500, `${text.length} chars`);

  // 3 — redirect hygiene
  const cv = await get("/cv");
  record(
    "cv-redirect",
    "/cv is an HTTP redirect, not meta-refresh",
    [301, 302, 307, 308].includes(cv.status) && !!cv.headers.get("location"),
    `status ${cv.status}, location ${cv.headers.get("location") || "none"}`,
    "hosting"
  );
  record(
    "cv-no-meta",
    "/cv serves no meta-refresh stub",
    !/http-equiv=["']refresh/i.test(cv.body),
    ""
  );

  // 4 — OpenAPI
  const spec = await get("/openapi.json");
  let parsed = null;
  try {
    parsed = JSON.parse(spec.body);
  } catch (_) {
    /* handled below */
  }
  record("openapi", "/openapi.json is published and parses", spec.status === 200 && !!parsed);
  if (parsed) {
    const ops = Object.values(parsed.paths || {}).flatMap((m) => Object.values(m));
    const ids = ops.map((o) => o.operationId).filter(Boolean);
    record(
      "openapi-ops",
      "Every operation has a unique operationId + description",
      ids.length === ops.length && new Set(ids).size === ids.length && ops.every((o) => o.description),
      `${ops.length} operations`
    );
    record(
      "openapi-schemas",
      "Every JSON response declares a schema",
      ops.every((o) =>
        Object.values(o.responses || {}).every((r) => !r.content || r.content["application/json"]?.schema)
      ),
      ""
    );
  }

  // 5 — JSON error responses
  const apiErr = await get("/api/definitely-not-an-endpoint");
  let errBody = null;
  try {
    errBody = JSON.parse(apiErr.body);
  } catch (_) {
    /* handled below */
  }
  record(
    "json-errors",
    "Unknown /api path returns a structured JSON error",
    apiErr.status === 404 && !!errBody?.error?.code && !!errBody?.error?.hint,
    `status ${apiErr.status}, code ${errBody?.error?.code || "none"}`,
    "hosting"
  );

  // 6 — markdown content negotiation
  const md = await get("/", { Accept: "text/markdown" });
  const ctype = md.headers.get("content-type") || "";
  const vary = md.headers.get("vary") || "";
  record(
    "markdown",
    "Accept: text/markdown returns text/markdown",
    /text\/markdown/.test(ctype),
    `content-type ${ctype || "none"}`,
    "hosting"
  );
  // Token match, not substring: "Accept-Encoding" alone must not count as Accept.
  const varyTokens = vary
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  record(
    "vary",
    "Vary includes Accept (not just Accept-Encoding)",
    varyTokens.includes("accept"),
    `vary ${vary || "none"}`,
    "hosting"
  );

  // 7 + 11 — llms.txt with when-to-use
  const llms = await get("/llms.txt");
  record("llms", "/llms.txt is published", llms.status === 200 && llms.body.startsWith("#"));
  record(
    "when-to-use",
    "llms.txt carries when-to-use guidance",
    /when to use/i.test(llms.body) && /\/api\//.test(llms.body)
  );

  // 8 — public API reachable
  for (const path of ["/api/health", "/api/profile", "/api/projects", "/api/stack"]) {
    const r = await get(path);
    let json = null;
    try {
      json = JSON.parse(r.body);
    } catch (_) {
      /* handled below */
    }
    record(`api${path}`, `GET ${path} returns JSON`, r.status === 200 && !!json, `status ${r.status}`, "hosting");
  }

  // 10 — docs linked from homepage
  record(
    "docs-linked",
    "Homepage links /docs and /openapi.json",
    /href="\/docs"/.test(home.body) && /openapi\.json/.test(home.body)
  );

  // 12 — trust anchor pages
  for (const slug of ["about", "contact", "privacy", "docs"]) {
    const r = await get(`/${slug}`);
    const len = visibleText(r.body).length;
    record(`trust-${slug}`, `/${slug} has 500+ chars`, r.status === 200 && len >= 500, `${len} chars`);
  }

  // 15 — Organization schema completeness
  const blocks = [...home.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch (_) {
        return null;
      }
    })
    .filter(Boolean);
  const org = blocks.find((b) => b["@type"] === "Organization");
  record(
    "org-schema",
    "Organization schema has contactPoint + address",
    !!org && !!org.contactPoint && !!org.address,
    org ? "found" : "no Organization block"
  );

  // report
  const pad = (s, n) => String(s).padEnd(n);
  let coreFailed = 0;
  console.log(`\nAgent readiness — ${ORIGIN}\n${"─".repeat(72)}`);
  for (const r of results) {
    if (!r.passed && r.kind === "core") coreFailed += 1;
    const mark = r.passed ? "PASS" : r.kind === "hosting" ? "HOST" : "FAIL";
    console.log(`  ${pad(mark, 5)} ${pad(r.label, 48)} ${r.detail || ""}`);
  }
  const passed = results.filter((r) => r.passed).length;
  console.log(`${"─".repeat(72)}\n  ${passed}/${results.length} checks passed`);
  if (coreFailed) console.log(`  ${coreFailed} non-hosting check(s) failed`);
  console.log("  HOST = requires a Vercel deployment (routing/middleware/functions)\n");

  process.exit(coreFailed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("verification failed to run:", e.message);
  process.exit(2);
});
