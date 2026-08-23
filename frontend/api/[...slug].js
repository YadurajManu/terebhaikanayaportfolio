const { fail, guard } = require("./_lib");

/**
 * Catch-all for unknown /api/* paths.
 *
 * Without this, an unmatched API path falls through to the SPA rewrite and an
 * agent receives HTML with a 200 — the exact soft-404 failure this change set
 * removes. Here it is always a JSON 404 that names the real endpoints.
 *
 * operationId: apiNotFound
 */
module.exports = function handler(req, res) {
  if (guard(req, res, ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"])) return;

  const attempted = req.url ? req.url.split("?")[0] : "/api";

  fail(
    res,
    404,
    "endpoint_not_found",
    `No API endpoint is mounted at '${attempted}'.`,
    "Available endpoints: /api/health, /api/profile, /api/projects, /api/projects/{id}, /api/stack. " +
      "The full contract is at /openapi.json."
  );
};
