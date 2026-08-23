/**
 * Markdown content negotiation, per acceptmarkdown.com.
 *
 * When a client asks for text/markdown in preference to text/html, serve the
 * markdown source generated alongside each page instead of the rendered HTML.
 *
 * `Vary: Accept` is set on both variants — here for markdown, and in
 * vercel.json for the HTML — because without it a CDN will happily hand the
 * cached HTML to an agent that asked for markdown, depending only on which
 * variant happened to populate the cache first.
 */

export const config = {
  matcher: ["/", "/about", "/contact", "/privacy", "/docs"],
};

const SLUGS = {
  "/": "index",
  "/about": "about",
  "/contact": "contact",
  "/privacy": "privacy",
  "/docs": "docs",
};

/**
 * Parses an Accept header into { mediaType: qValue }.
 * A missing q defaults to 1, per RFC 9110.
 */
export function parseAccept(header) {
  const out = {};
  for (const part of header.split(",")) {
    const [typeRaw, ...params] = part.trim().split(";");
    const type = typeRaw.trim().toLowerCase();
    if (!type) continue;
    let q = 1;
    for (const param of params) {
      const [k, v] = param.split("=").map((s) => (s || "").trim());
      if (k === "q") {
        const parsed = Number.parseFloat(v);
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }
    out[type] = q;
  }
  return out;
}

/** Markdown wins only when it is explicitly requested and outranks HTML. */
export function prefersMarkdown(header) {
  if (!header) return false;
  const accepted = parseAccept(header);
  const markdown = Math.max(accepted["text/markdown"] ?? -1, accepted["text/x-markdown"] ?? -1);
  if (markdown < 0) return false;
  const html = Math.max(accepted["text/html"] ?? -1, accepted["application/xhtml+xml"] ?? -1);
  return markdown > 0 && markdown >= html;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : "/";
  const slug = SLUGS[pathname || "/"];

  if (!slug) return;
  if (request.method !== "GET" && request.method !== "HEAD") return;
  if (!prefersMarkdown(request.headers.get("accept"))) return;

  const source = new URL(`/md/${slug}.md`, url.origin);
  let response;
  try {
    response = await fetch(source);
  } catch {
    return; // fall through to HTML rather than fail the request
  }
  if (!response.ok) return;

  const body = await response.text();

  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      Link: `<${url.origin}/md/${slug}.md>; rel="alternate"; type="text/markdown"`,
    },
  });
}
