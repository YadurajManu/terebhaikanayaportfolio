/**
 * Shared helpers for the public read-only API.
 *
 * Every response — success or failure — is JSON. Agents cannot parse an HTML
 * error page, so there is deliberately no path through this module that emits
 * markup.
 */

const DOCS_URL = "https://www.yaduraj.me/docs";
const SPEC_URL = "https://www.yaduraj.me/openapi.json";

/** Read-only public data: safe to cache hard at the edge and allow anywhere. */
function baseHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    // Accept is included because the docs/content routes negotiate on it; keeping
    // one Vary policy across the origin stops a CDN serving the wrong variant.
    Vary: "Accept, Accept-Encoding",
    "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    "X-Content-Type-Options": "nosniff",
  };
}

function send(res, status, payload, extraHeaders) {
  const headers = Object.assign(baseHeaders(), extraHeaders || {});
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.status(status).send(JSON.stringify(payload, null, 2) + "\n");
}

function ok(res, payload, extraHeaders) {
  send(res, 200, payload, extraHeaders);
}

/**
 * Structured error envelope. `code` is stable and machine-matchable, `hint`
 * tells an agent what to do next rather than just what went wrong.
 */
function fail(res, status, code, message, hint) {
  send(res, status, {
    error: {
      status,
      code,
      message,
      hint,
      documentation: DOCS_URL,
      specification: SPEC_URL,
    },
  });
}

/**
 * Handles CORS preflight and rejects non-GET verbs with JSON.
 * Returns true when the caller should stop.
 */
function guard(req, res, allowed = ["GET", "HEAD"]) {
  if (req.method === "OPTIONS") {
    const headers = baseHeaders();
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    res.status(204).end();
    return true;
  }
  if (!allowed.includes(req.method)) {
    res.setHeader("Allow", allowed.concat("OPTIONS").join(", "));
    fail(
      res,
      405,
      "method_not_allowed",
      `${req.method} is not supported by this endpoint.`,
      `This API is read-only. Retry with ${allowed.join(" or ")}.`
    );
    return true;
  }
  return false;
}

module.exports = { ok, fail, guard, send, baseHeaders, DOCS_URL, SPEC_URL };
