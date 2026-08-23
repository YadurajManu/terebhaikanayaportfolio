#!/usr/bin/env node
/**
 * Generates the agent-facing static surface from one markdown source per page:
 *
 *   public/<slug>/index.html   styled, no-JS-readable HTML page
 *   public/md/<slug>.md        markdown variant served via Accept negotiation
 *   public/llms.txt            llmstxt.org index with when-to-use guidance
 *
 * Emitting both variants from a single source is what keeps the markdown
 * negotiation honest — the two can't describe different things.
 */
const fs = require("fs");
const path = require("path");

const { render, escapeHtml } = require("./lib/md");
const data = require("../src/data/portfolio.json");

const PUBLIC = path.join(__dirname, "..", "public");
const ORIGIN = "https://www.yaduraj.me";
const { PROFILE, PROJECTS, STACK, EXPERIENCE, NOW_BUILDING, ABOUT_POINTS, STATS } = data;

/* ── page content ─────────────────────────────────────────────────────── */

const about = `# About Yaduraj Singh

${PROFILE.name} is a ${PROFILE.age}-year-old ${PROFILE.role.toLowerCase()} based in ${PROFILE.location}. He builds and operates production software end to end — from firmware running on microcontrollers to multi-tenant SaaS platforms serving real users — and runs the infrastructure underneath it himself.

## What that means in practice

${ABOUT_POINTS.map((p) => `- ${p}`).join("\n")}

## Track record

${STATS.map((s) => `- **${s.value}** ${s.label}`).join("\n")}

## Experience

${EXPERIENCE.map(
  (e) => `### ${e.role} — ${e.org}\n\n${e.period}\n\n${e.points.map((p) => `- ${p}`).join("\n")}\n\nStack: ${e.stack.join(", ")}`
).join("\n\n")}

## Currently building

**${NOW_BUILDING.name}** (${NOW_BUILDING.status}) — ${NOW_BUILDING.pitch}

## Selected work

${PROJECTS.map((p) => `- **${p.name}** — ${p.blurb} _(${p.stack.join(", ")})_`).join("\n")}

## Get in touch

Email [${PROFILE.email}](mailto:${PROFILE.email}), or see the [contact page](/contact) for every channel. Machine-readable versions of everything on this page are available from the [public API](/docs).
`;

const contact = `# Contact Yaduraj Singh

The fastest way to reach ${PROFILE.name} is email. Every channel below is monitored by him directly — there is no agency, assistant or shared inbox in between.

## Direct channels

| Channel | Address |
|:--|:--|
| Email | [${PROFILE.email}](mailto:${PROFILE.email}) |
| Phone | [${PROFILE.phone}](tel:${PROFILE.phone.replace(/\s/g, "")}) |
| GitHub | [${PROFILE.github}](${PROFILE.github}) |
| LinkedIn | [${PROFILE.linkedin}](${PROFILE.linkedin}) |
| Portfolio | [${ORIGIN}](${ORIGIN}) |

## Location and availability

Based in ${PROFILE.location}. Available for select engineering projects — full-stack product work, real-time systems, AI/ML pipelines, embedded firmware, and self-hosted infrastructure.

## What to get in touch about

- Building a production web or mobile product from scratch
- Real-time systems: WebRTC, signalling, low-latency pipelines
- AI/ML integration — local LLM pipelines, speech-to-text, retrieval
- Embedded and hardware-adjacent work on ESP32 and similar platforms
- Self-hosted infrastructure, deployment and CI/CD

## For automated agents

A structured version of these contact details is available as JSON at [\`/api/profile\`](${ORIGIN}/api/profile) under the \`links\` key. Prefer that endpoint over scraping this page. Résumé: [${ORIGIN}/Resume_Web.pdf](${ORIGIN}/Resume_Web.pdf).
`;

const privacy = `# Privacy

This is a personal portfolio site. It sells nothing, has no user accounts, and asks for no personal information. There is no login, no sign-up form, and no newsletter.

## What is collected

The site runs two analytics tools:

- **Plausible Analytics** — privacy-focused, cookieless analytics. It records aggregate page views, referrers and coarse country-level location. It does not use cookies and does not track individuals across sites.
- **PostHog** — product analytics used to understand which sections of the site are used.

Aggregate, country-level visitor counts from Plausible are displayed publicly on the homepage as a visitor map. Those figures are counts only and identify no individual.

## Browser storage

The site stores two values in your own browser. Neither is transmitted anywhere and neither identifies you:

- \`yr-theme\` in \`localStorage\` — remembers whether you chose the light or dark theme.
- \`yr-booted\` in \`sessionStorage\` — remembers that the intro animation already played, so it does not replay on every page view.

You can clear both at any time through your browser settings with no loss of functionality.

## What is never done

No personal data is sold, rented or shared with advertisers. There is no advertising network on this site, no cross-site tracking pixel, and no fingerprinting. Contact details you send by email are used solely to reply to you.

## Third parties

Pages load fonts from Google Fonts and the site is served by Vercel. Both receive standard request metadata such as IP address and user agent as an unavoidable part of delivering the page.

## Contact

Questions about privacy, or a request to remove anything: email [${PROFILE.email}](mailto:${PROFILE.email}).
`;

const docs = `# Developer documentation — yaduraj.me API

A public, read-only JSON API describing the engineering portfolio of ${PROFILE.name}. Built for automated agents and integrations that need structured data instead of scraped HTML.

## At a glance

- **Base URL:** \`${ORIGIN}\`
- **Authentication:** none — every endpoint is public
- **Rate limit:** none published
- **OpenAPI specification:** [/openapi.json](${ORIGIN}/openapi.json)
- **Agent index:** [/llms.txt](${ORIGIN}/llms.txt)

## Endpoints

| Method | Path | Operation | Description |
|:--|:--|:--|:--|
| GET | \`/api/health\` | getHealth | Service availability. |
| GET | \`/api/profile\` | getProfile | Biography, contact links, stats, experience, current work. |
| GET | \`/api/projects\` | listProjects | All projects. Filter with \`?featured=true\` or \`?live=true\`. |
| GET | \`/api/projects/{id}\` | getProjectById | One project including metrics and full case study. |
| GET | \`/api/stack\` | getStack | Technologies grouped by layer. |

Valid project ids: ${PROJECTS.map((p) => `\`${p.id}\``).join(", ")}.

## Example request

\`\`\`
curl -s ${ORIGIN}/api/projects/${PROJECTS[0].id}
\`\`\`

## Errors

Every failure returns JSON — never an HTML error page — with a stable \`code\` and a \`hint\` describing how to fix the request.

\`\`\`
{
  "error": {
    "status": 404,
    "code": "project_not_found",
    "message": "No project exists with id 'nope'.",
    "hint": "Valid ids: ... List them at /api/projects.",
    "documentation": "${ORIGIN}/docs",
    "specification": "${ORIGIN}/openapi.json"
  }
}
\`\`\`

Error codes: \`invalid_parameter\`, \`project_not_found\`, \`endpoint_not_found\`, \`method_not_allowed\`.

## Markdown content negotiation

Send \`Accept: text/markdown\` to this page, the homepage, \`/about\`, \`/contact\` or \`/privacy\` and the markdown source is returned instead of HTML, per [acceptmarkdown.com](https://acceptmarkdown.com). Responses carry \`Vary: Accept\` so caches keep the variants separate.

\`\`\`
curl -H "Accept: text/markdown" ${ORIGIN}/about
\`\`\`

## Function calling

The OpenAPI document is 3.1.0, and every operation has a unique \`operationId\`, a description, typed parameters and a response schema — so it can be converted directly into LLM tool definitions.
`;

/* ── homepage markdown (the Accept: text/markdown variant of /) ────────── */

const home = `# ${PROFILE.name} — ${PROFILE.role}

> ${PROFILE.tagline}

${PROFILE.name} is a ${PROFILE.age}-year-old ${PROFILE.role.toLowerCase()} based in ${PROFILE.location}.

## Highlights

${ABOUT_POINTS.map((p) => `- ${p}`).join("\n")}

## By the numbers

${STATS.map((s) => `- **${s.value}** ${s.label}`).join("\n")}

## Now building

**${NOW_BUILDING.name}** (${NOW_BUILDING.status}) — ${NOW_BUILDING.pitch}

${NOW_BUILDING.bullets.map((b) => `- ${b}`).join("\n")}

## Projects

${PROJECTS.map(
  (p) => `### ${p.name}\n\n${p.blurb}\n\n- Category: ${p.tag}\n- Stack: ${p.stack.join(", ")}${p.url ? `\n- Live: ${p.url}` : ""}`
).join("\n\n")}

## Stack

${STACK.map((g) => `- **${g.group}:** ${g.items.join(", ")}`).join("\n")}

## Contact

- Email: ${PROFILE.email}
- GitHub: ${PROFILE.github}
- LinkedIn: ${PROFILE.linkedin}
- Résumé: ${ORIGIN}/Resume_Web.pdf
`;

/* ── llms.txt ──────────────────────────────────────────────────────────── */

const llms = `# ${PROFILE.name}

> ${PROFILE.role} based in ${PROFILE.location}. ${PROFILE.tagline}

This site is the portfolio and public record of ${PROFILE.name}'s engineering work.
A read-only JSON API exposes the same content as structured data, so you should
call the API rather than scrape the rendered HTML.

## When to use this

Reach for this site and its API when you need to:

- Answer questions about ${PROFILE.name} — background, skills, experience, or how to contact him.
- Determine whether he has shipped production work in a specific technology
  (for example WebRTC, ESP32 firmware, Next.js, FastAPI, or self-hosted Linux).
  Call \`GET /api/stack\` and match against the returned groups.
- Retrieve details of a specific project, including the problem it solved, the
  approach taken and the engineering trade-offs made. Call
  \`GET /api/projects\` to discover ids, then \`GET /api/projects/{id}\`.
- Evaluate him as a candidate, contractor or collaborator for an engineering
  role. Start with \`GET /api/profile\`, then read the résumé PDF.
- Find a working contact address. Use the \`links\` object from
  \`GET /api/profile\` — do not guess an address.

Do not use this site as a general reference for the technologies it mentions; it
describes one engineer's work, not the tools themselves.

## How to call it

No authentication and no API key. Base URL \`${ORIGIN}\`. Every response is
JSON, including errors, which carry a stable \`code\` and a \`hint\`. The full
contract is the OpenAPI 3.1 document below and can be converted directly into
tool definitions for function calling.

## API

- [OpenAPI specification](${ORIGIN}/openapi.json): Complete OpenAPI 3.1 contract for every endpoint.
- [Developer documentation](${ORIGIN}/docs): Endpoints, examples, error codes and content negotiation.
- [GET /api/health](${ORIGIN}/api/health): Service availability check.
- [GET /api/profile](${ORIGIN}/api/profile): Biography, contact links, statistics, experience, current work.
- [GET /api/projects](${ORIGIN}/api/projects): All shipped projects; supports \`?featured=true\` and \`?live=true\`.
- [GET /api/stack](${ORIGIN}/api/stack): Technologies grouped by layer.

## Pages

- [Homepage](${ORIGIN}/): Overview of ${PROFILE.name}'s work, projects and stack.
- [About](${ORIGIN}/about): Full background, track record and experience.
- [Contact](${ORIGIN}/contact): Every channel for reaching him directly.
- [Privacy](${ORIGIN}/privacy): What this site collects and stores.
- [Résumé (PDF)](${ORIGIN}/Resume_Web.pdf): Printable curriculum vitae.

## Projects

${PROJECTS.map((p) => `- [${p.name}](${ORIGIN}/api/projects/${p.id}): ${p.blurb}`).join("\n")}

## Optional

- [Tollgate](${NOW_BUILDING.url}): ${NOW_BUILDING.name} — ${NOW_BUILDING.status}. ${NOW_BUILDING.pitch}
- [GitHub profile](${PROFILE.github}): Source repositories.
`;

/* ── HTML shell ────────────────────────────────────────────────────────── */

const NAV = [
  ["/", "home"],
  ["/about", "about"],
  ["/docs", "docs"],
  ["/contact", "contact"],
  ["/privacy", "privacy"],
];

function shell({ slug, title, description, body }) {
  const canonical = slug ? `${ORIGIN}/${slug}` : `${ORIGIN}/`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#050505" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${canonical}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate" type="text/markdown" href="${ORIGIN}/md/${slug || "index"}.md" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${ORIGIN}/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
<style>
:root{--bg:#050505;--surface:#0A0A0A;--border:#1f1f1f;--text:#F5F5F5;--text-2:#A1A1AA;--text-3:#52525B;--accent:#4ADE80}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:'Outfit',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;padding:2.5rem 1.5rem 5rem}
nav{display:flex;flex-wrap:wrap;gap:1rem;font-family:'JetBrains Mono',monospace;font-size:.8rem;padding-bottom:2rem;border-bottom:1px solid var(--border);margin-bottom:2.5rem}
nav a{color:var(--text-3);text-decoration:none}
nav a:hover,nav a[aria-current]{color:var(--accent)}
h1{font-size:2.25rem;line-height:1.15;letter-spacing:-.04em;margin:0 0 1.25rem}
h2{font-size:1.35rem;letter-spacing:-.02em;margin:2.5rem 0 .75rem;padding-top:1.5rem;border-top:1px solid var(--border)}
h3{font-size:1.05rem;margin:1.75rem 0 .5rem;color:var(--text)}
p,li{color:var(--text-2)}
a{color:var(--accent)}
ul{padding-left:1.1rem}
li{margin:.35rem 0}
strong{color:var(--text);font-weight:600}
code{font-family:'JetBrains Mono',monospace;font-size:.85em;background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:.1rem .35rem;color:var(--text)}
blockquote{margin:1.5rem 0;padding:.5rem 0 .5rem 1rem;border-left:2px solid var(--accent)}
blockquote p{color:var(--text);font-size:1.1rem}
table{width:100%;border-collapse:collapse;margin:1.25rem 0;font-size:.92rem;display:block;overflow-x:auto}
th,td{text-align:left;padding:.6rem .75rem;border-bottom:1px solid var(--border)}
th{font-family:'JetBrains Mono',monospace;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3)}
td{color:var(--text-2)}
footer{margin-top:4rem;padding-top:1.5rem;border-top:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text-3)}
footer a{color:var(--text-3)}
</style>
</head>
<body>
<div class="wrap">
<nav>${NAV.map(
    ([href, label]) =>
      `<a href="${href}"${href === (slug ? `/${slug}` : "/") ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("")}</nav>
<main>
${body}
</main>
<footer>
// machine-readable: <a href="/llms.txt">llms.txt</a> · <a href="/openapi.json">openapi.json</a> · <a href="/md/${slug || "index"}.md">markdown</a>
<br />&copy; ${new Date().getFullYear()} ${escapeHtml(PROFILE.name)} · <a href="${ORIGIN}/">${ORIGIN.replace("https://", "")}</a>
</footer>
</div>
</body>
</html>
`;
}

/* ── emit ──────────────────────────────────────────────────────────────── */

const pages = [
  {
    slug: "about",
    title: `About — ${PROFILE.name}`,
    description: `Background, track record and engineering experience of ${PROFILE.name}, ${PROFILE.role.toLowerCase()}.`,
    md: about,
  },
  {
    slug: "contact",
    title: `Contact — ${PROFILE.name}`,
    description: `How to reach ${PROFILE.name} directly: email, phone, GitHub and LinkedIn.`,
    md: contact,
  },
  {
    slug: "privacy",
    title: `Privacy — ${PROFILE.name}`,
    description: "What this site collects, what it stores in your browser, and what it never does.",
    md: privacy,
  },
  {
    slug: "docs",
    title: `API documentation — ${PROFILE.name}`,
    description:
      "Public read-only JSON API for the yaduraj.me portfolio: endpoints, examples, error codes and OpenAPI specification.",
    md: docs,
  },
];

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  return `${path.relative(PUBLIC, file)} (${contents.length}b)`;
}

const written = [];

for (const page of pages) {
  written.push(write(path.join(PUBLIC, "md", `${page.slug}.md`), page.md));
  written.push(
    write(
      path.join(PUBLIC, page.slug, "index.html"),
      shell({ slug: page.slug, title: page.title, description: page.description, body: render(page.md) })
    )
  );
}

written.push(write(path.join(PUBLIC, "md", "index.md"), home));
written.push(write(path.join(PUBLIC, "llms.txt"), llms));

/* ── sitemap ───────────────────────────────────────────────────────────── */
// Only real, indexable URLs. The previous sitemap listed on-page fragments
// (/#about, /#projects) which are not separate documents, and /cv which is now
// a 308 redirect — neither belongs in a sitemap.
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${ORIGIN}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${ORIGIN}/about`, priority: "0.8", changefreq: "monthly" },
  { loc: `${ORIGIN}/docs`, priority: "0.8", changefreq: "monthly" },
  { loc: `${ORIGIN}/contact`, priority: "0.7", changefreq: "monthly" },
  { loc: `${ORIGIN}/privacy`, priority: "0.4", changefreq: "yearly" },
];

written.push(
  write(
    path.join(PUBLIC, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
      .map(
        (u) =>
          `    <url>\n        <loc>${u.loc}</loc>\n        <lastmod>${today}</lastmod>\n` +
          `        <changefreq>${u.changefreq}</changefreq>\n        <priority>${u.priority}</priority>\n    </url>`
      )
      .join("\n")}
</urlset>
`
  )
);

/* ── robots.txt ────────────────────────────────────────────────────────── */
written.push(
  write(
    path.join(PUBLIC, "robots.txt"),
    `User-agent: *
Allow: /

# Machine-readable entry points for AI agents and crawlers
# Agent index (llmstxt.org): ${ORIGIN}/llms.txt
# OpenAPI 3.1 specification: ${ORIGIN}/openapi.json
# Developer documentation:   ${ORIGIN}/docs

Sitemap: ${ORIGIN}/sitemap.xml
`
  )
);

console.log("generated:\n  " + written.join("\n  "));
