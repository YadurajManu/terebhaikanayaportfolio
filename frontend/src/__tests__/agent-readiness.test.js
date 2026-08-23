/**
 * Locks down the machine-readable surface: the OpenAPI contract, llms.txt,
 * the trust-anchor pages, the sitemap and the prerendered HTML.
 *
 * These assert the properties the agent-readiness audit measures, so a
 * regression fails the build rather than silently dropping the score.
 */
const fs = require("fs");
const path = require("path");

const spec = require("../../public/openapi.json");
const data = require("../data/portfolio.json");
const { homepageMarkup, notFoundMarkup, inject, buildNotFound, textOf } = require("../../scripts/prerender");
const { render } = require("../../scripts/lib/md");
const { prefersMarkdown, parseAccept } = require("../../middleware");

const PUBLIC = path.join(__dirname, "..", "..", "public");
const read = (p) => fs.readFileSync(path.join(PUBLIC, p), "utf8");
const visibleText = (html) =>
  html
    .replace(/<(script|style|nav|footer)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const PAGES = ["about", "contact", "privacy", "docs"];

describe("OpenAPI specification", () => {
  const operations = Object.entries(spec.paths).flatMap(([p, methods]) =>
    Object.entries(methods).map(([method, op]) => ({ p, method, op }))
  );

  it("is OpenAPI 3.1 with servers and contact metadata", () => {
    expect(spec.openapi).toMatch(/^3\.1/);
    expect(spec.servers[0].url).toBe("https://www.yaduraj.me");
    expect(spec.info.contact.email).toBe(data.PROFILE.email);
  });

  it("gives every operation a unique operationId", () => {
    const ids = operations.map(({ op }) => op.operationId);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("describes every operation, for function-calling compatibility", () => {
    for (const { p, method, op } of operations) {
      expect(`${method} ${p}: ${op.description || ""}`.length).toBeGreaterThan(40);
      expect(op.summary).toBeTruthy();
    }
  });

  it("types every parameter and every response body", () => {
    for (const { op } of operations) {
      for (const param of op.parameters || []) {
        expect(param.schema).toBeDefined();
        expect(param.description).toBeTruthy();
      }
      for (const response of Object.values(op.responses)) {
        if (response.content) {
          expect(response.content["application/json"].schema).toBeDefined();
        }
      }
    }
  });

  it("documents an error envelope on every failure response", () => {
    const failures = operations.flatMap(({ op }) =>
      Object.entries(op.responses).filter(([code]) => Number(code) >= 400)
    );
    expect(failures.length).toBeGreaterThan(0);
    for (const [, response] of failures) {
      expect(response.content["application/json"].schema.$ref).toBe(
        "#/components/schemas/ErrorEnvelope"
      );
    }
  });

  it("keeps documented project ids in sync with the data", () => {
    const documented = spec.paths["/api/projects/{id}"].get.parameters[0].schema.enum;
    expect(documented).toEqual(data.PROJECTS.map((p) => p.id));
  });

  it("resolves every internal $ref", () => {
    const refs = [];
    JSON.stringify(spec, (k, v) => {
      if (k === "$ref") refs.push(v);
      return v;
    });
    for (const ref of refs) {
      const name = ref.replace("#/components/schemas/", "");
      expect(spec.components.schemas[name]).toBeDefined();
    }
  });
});

describe("llms.txt", () => {
  const llms = read("llms.txt");

  it("starts with an H1 and a blockquote summary, per llmstxt.org", () => {
    const lines = llms.split("\n").filter(Boolean);
    expect(lines[0]).toMatch(/^# /);
    expect(lines[1]).toMatch(/^> /);
  });

  it("carries explicit when-to-use guidance", () => {
    expect(llms).toMatch(/##\s+When to use this/i);
    // must name concrete jobs, not marketing copy
    expect(llms).toContain("/api/projects/{id}");
    expect(llms).toMatch(/Do not use this site/i);
  });

  it("links the API, the spec and the docs", () => {
    expect(llms).toContain("https://www.yaduraj.me/openapi.json");
    expect(llms).toContain("https://www.yaduraj.me/docs");
    expect(llms).toContain("https://www.yaduraj.me/api/profile");
  });

  it("lists every project", () => {
    for (const p of data.PROJECTS) expect(llms).toContain(p.name);
  });
});

describe("trust anchor pages", () => {
  it.each(PAGES)("/%s has an h1 and over 500 characters of text", (slug) => {
    const html = read(path.join(slug, "index.html"));
    expect(html).toMatch(/<h1[^>]*>/);
    expect(visibleText(html).length).toBeGreaterThan(500);
  });

  it.each(PAGES)("/%s declares a canonical URL and a markdown alternate", (slug) => {
    const html = read(path.join(slug, "index.html"));
    expect(html).toContain(`<link rel="canonical" href="https://www.yaduraj.me/${slug}"`);
    expect(html).toContain(`type="text/markdown" href="https://www.yaduraj.me/md/${slug}.md"`);
  });

  it.each(PAGES)("/%s has a markdown twin with the same headline", (slug) => {
    const md = read(path.join("md", `${slug}.md`));
    expect(md.length).toBeGreaterThan(500);
    const mdTitle = md.split("\n")[0].replace(/^#\s*/, "").trim();
    expect(visibleText(read(path.join(slug, "index.html")))).toContain(mdTitle);
  });

  it("privacy page names both analytics tools actually loaded", () => {
    const privacy = read(path.join("md", "privacy.md"));
    expect(privacy).toMatch(/Plausible/);
    expect(privacy).toMatch(/PostHog/);
    // the two browser keys the app really writes
    expect(privacy).toContain("yr-theme");
    expect(privacy).toContain("yr-booted");
  });
});

describe("sitemap and robots", () => {
  const sitemap = read("sitemap.xml");

  it("lists only real documents, never on-page fragments", () => {
    expect(sitemap).not.toMatch(/<loc>[^<]*#/);
  });

  it("does not advertise a URL that only redirects", () => {
    expect(sitemap).not.toMatch(/<loc>[^<]*\/cv<\/loc>/);
  });

  it("includes the trust anchor pages", () => {
    for (const slug of ["about", "contact", "privacy", "docs"]) {
      expect(sitemap).toContain(`https://www.yaduraj.me/${slug}`);
    }
  });

  it("points robots.txt at the sitemap and the agent index", () => {
    const robots = read("robots.txt");
    expect(robots).toContain("Sitemap: https://www.yaduraj.me/sitemap.xml");
    expect(robots).toContain("/llms.txt");
  });
});

describe("prerendered HTML", () => {
  const shell = '<!doctype html><html><head><title>t</title><meta name="robots" content="index" /></head><body><div id="root"></div></body></html>';

  it("puts an h1 and well over 500 characters into the raw homepage", () => {
    const html = inject(shell, homepageMarkup());
    expect(html).toMatch(/<h1[^>]*>/);
    expect(textOf(html)).toBeGreaterThan(500);
  });

  it("includes the real portfolio content, not placeholder text", () => {
    const html = inject(shell, homepageMarkup());
    for (const p of data.PROJECTS) expect(html).toContain(p.name);
    expect(html).toContain(data.PROFILE.tagline);
  });

  it("links the docs surface from the homepage", () => {
    const html = inject(shell, homepageMarkup());
    for (const href of ["/docs", "/openapi.json", "/llms.txt", "/about", "/contact", "/privacy"]) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it("throws rather than silently shipping an unprerendered page", () => {
    expect(() => inject("<html><body></body></html>", "x")).toThrow(/could not find/);
  });

  it("gives the 404 body a route back to the machine-readable entry points", () => {
    const html = notFoundMarkup();
    for (const href of ["/llms.txt", "/sitemap.xml", "/openapi.json", "/docs"]) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it("marks the 404 noindex and retitles it", () => {
    const html = buildNotFound(shell);
    expect(html).toContain('content="noindex, follow"');
    expect(html).toMatch(/<title>404[^<]*<\/title>/);
  });
});

describe("Accept negotiation", () => {
  it("parses q-values", () => {
    expect(parseAccept("text/html;q=0.9, text/markdown;q=1.0")).toEqual({
      "text/html": 0.9,
      "text/markdown": 1,
    });
  });

  it.each([
    ["text/markdown", true],
    ["text/markdown;q=1.0", true],
    ["text/x-markdown", true],
    ["text/markdown, text/html;q=0.5", true],
    ["text/html;q=0.9, text/markdown;q=0.9", true],
  ])("serves markdown for %s", (header, expected) => {
    expect(prefersMarkdown(header)).toBe(expected);
  });

  it.each([
    ["text/html", false],
    ["*/*", false],
    ["", false],
    [null, false],
    ["text/markdown;q=0", false],
    ["text/html, text/markdown;q=0.5", false],
  ])("keeps HTML for %s", (header, expected) => {
    expect(prefersMarkdown(header)).toBe(expected);
  });
});

describe("markdown renderer", () => {
  it("escapes HTML rather than passing it through", () => {
    expect(render("<script>alert(1)</script>")).toContain("&lt;script&gt;");
  });

  it("renders the constructs the pages use", () => {
    expect(render("# T")).toBe("<h1>T</h1>");
    expect(render("- a\n- b")).toBe("<ul><li>a</li><li>b</li></ul>");
    expect(render("[x](/y)")).toContain('<a href="/y">x</a>');
    expect(render("**b**")).toContain("<strong>b</strong>");
    expect(render("`c`")).toContain("<code>c</code>");
    expect(render("> q")).toContain("<blockquote>");
    expect(render("| a |\n|:--|\n| 1 |")).toContain("<table>");
  });
});
