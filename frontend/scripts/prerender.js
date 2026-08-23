#!/usr/bin/env node
/**
 * Post-build step. Create React App ships an empty <div id="root">, so a crawler
 * that does not execute JavaScript sees ~51 characters and no <h1>. This injects
 * real, semantic content into that div at build time.
 *
 * React replaces the container contents on mount (createRoot clears it), so the
 * rendered application and its visual design are unchanged — this only affects
 * what is present in the raw HTML before JavaScript runs.
 *
 * Also emits build/404.html: the same bundle shell, so React Router still renders
 * the interactive 404 for humans, but with an agent-readable body and served by
 * Vercel with a genuine 404 status instead of a soft 200.
 */
const fs = require("fs");
const path = require("path");

const { escapeHtml } = require("./lib/md");
const data = require("../src/data/portfolio.json");

const BUILD = path.join(__dirname, "..", "build");
const ORIGIN = "https://www.yaduraj.me";
const { PROFILE, STATS, ABOUT_POINTS, EXPERIENCE, PROJECTS, STACK, NOW_BUILDING } = data;

const e = escapeHtml;

/** Inline styles only — the prerender is visible for a frame before hydration. */
const SHELL_STYLE =
  "max-width:820px;margin:0 auto;padding:3rem 1.5rem;font-family:'Outfit',system-ui,sans-serif;" +
  "color:#A1A1AA;line-height:1.7";

function homepageMarkup() {
  return `<div id="prerender" style="${SHELL_STYLE}">
<h1 style="color:#F5F5F5;font-size:2.5rem;letter-spacing:-0.04em;line-height:1.1;margin:0 0 1rem">${e(
    PROFILE.name
  )} — ${e(PROFILE.role)}</h1>
<p style="font-size:1.1rem;color:#F5F5F5">${e(PROFILE.tagline)}</p>
<p>${e(PROFILE.name)} is a ${PROFILE.age}-year-old ${e(
    PROFILE.role.toLowerCase()
  )} based in ${e(PROFILE.location)}. He designs, builds and operates production software end to end — from firmware running on microcontrollers through to multi-tenant SaaS platforms with real users — and runs the infrastructure underneath it himself.</p>

<h2>Highlights</h2>
<ul>${ABOUT_POINTS.map((p) => `<li>${e(p)}</li>`).join("")}</ul>

<h2>By the numbers</h2>
<ul>${STATS.map((s) => `<li><strong>${e(s.value)}</strong> ${e(s.label)}</li>`).join("")}</ul>

<h2>Now building</h2>
<p><strong>${e(NOW_BUILDING.name)}</strong> (${e(NOW_BUILDING.status)}) — ${e(NOW_BUILDING.pitch)}</p>
<ul>${NOW_BUILDING.bullets.map((b) => `<li>${e(b)}</li>`).join("")}</ul>

<h2>Experience</h2>
${EXPERIENCE.map(
    (x) =>
      `<h3>${e(x.role)} — ${e(x.org)}</h3><p>${e(x.period)}</p><ul>${x.points
        .map((p) => `<li>${e(p)}</li>`)
        .join("")}</ul><p>Stack: ${e(x.stack.join(", "))}</p>`
  ).join("")}

<h2>Projects</h2>
${PROJECTS.map(
    (p) =>
      `<h3>${e(p.name)}</h3><p>${e(p.blurb)}</p><p>Category: ${e(p.tag)}. Stack: ${e(
        p.stack.join(", ")
      )}.${p.url ? ` Live at <a href="${e(p.url)}">${e(p.url)}</a>.` : ""}</p>`
  ).join("")}

<h2>Stack</h2>
<ul>${STACK.map((g) => `<li><strong>${e(g.group)}:</strong> ${e(g.items.join(", "))}</li>`).join("")}</ul>

<h2>Contact</h2>
<ul>
<li>Email: <a href="mailto:${e(PROFILE.email)}">${e(PROFILE.email)}</a></li>
<li>GitHub: <a href="${e(PROFILE.github)}">${e(PROFILE.github)}</a></li>
<li>LinkedIn: <a href="${e(PROFILE.linkedin)}">${e(PROFILE.linkedin)}</a></li>
<li>Résumé: <a href="/Resume_Web.pdf">${ORIGIN}/Resume_Web.pdf</a></li>
</ul>

<h2>For developers and automated agents</h2>
<p>A public read-only JSON API exposes everything on this page as structured data. Read the <a href="/docs">API documentation</a>, the <a href="/openapi.json">OpenAPI specification</a>, or the <a href="/llms.txt">llms.txt</a> agent index.</p>
<ul>
<li><a href="/about">About</a> — full background and experience</li>
<li><a href="/docs">Developer documentation</a> — endpoints and examples</li>
<li><a href="/contact">Contact</a> — every direct channel</li>
<li><a href="/privacy">Privacy</a> — what this site collects</li>
</ul>
</div>`;
}

/** Short markdown body, per the agent-friendly-404 guidance. */
function notFoundMarkup() {
  return `<div id="prerender" style="${SHELL_STYLE}">
<h1 style="color:#F5F5F5;font-size:2rem;letter-spacing:-0.03em;margin:0 0 1rem">404 — page not found</h1>
<p>This URL does not exist on ${ORIGIN}. Nothing was moved; there is no page here.</p>
<p>If you are an automated agent, start from one of these:</p>
<ul>
<li><a href="/llms.txt">/llms.txt</a> — agent index, including when to use this site</li>
<li><a href="/sitemap.xml">/sitemap.xml</a> — every canonical URL</li>
<li><a href="/openapi.json">/openapi.json</a> — OpenAPI 3.1 specification for the public API</li>
<li><a href="/docs">/docs</a> — developer documentation with endpoints and examples</li>
<li><a href="/">/</a> — homepage</li>
</ul>
<p>The public API returns JSON errors with a stable <code>code</code> and a <code>hint</code>; unknown <code>/api/*</code> paths return a JSON 404 rather than HTML.</p>
</div>`;
}

function inject(html, markup) {
  if (!html.includes('<div id="root"></div>')) {
    throw new Error('prerender: could not find <div id="root"></div> in build/index.html');
  }
  return html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}

function buildNotFound(original) {
  return inject(original, notFoundMarkup())
    .replace(/<title>[^<]*<\/title>/, "<title>404 — page not found · Yaduraj Singh</title>")
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
}

const textOf = (html) =>
  html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;

function main() {
  const indexPath = path.join(BUILD, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("prerender: build/index.html missing — run the build first");
    process.exit(1);
  }

  const original = fs.readFileSync(indexPath, "utf8");

  const home = inject(original, homepageMarkup());
  fs.writeFileSync(indexPath, home);

  // 404 keeps the same bundle, so React Router still renders the interactive
  // page for humans while the raw HTML carries the agent-readable body.
  const notFound = buildNotFound(original);
  fs.writeFileSync(path.join(BUILD, "404.html"), notFound);

  console.log(
    `prerender: index.html ${textOf(home)} chars of text (was ${textOf(original)}), ` +
      `404.html ${textOf(notFound)} chars`
  );
}

if (require.main === module) main();

module.exports = { homepageMarkup, notFoundMarkup, inject, buildNotFound, textOf, main };
