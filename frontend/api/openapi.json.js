const { guard, baseHeaders } = require("./_lib");
const spec = require("../public/openapi.json");

/**
 * Serves the OpenAPI document at /api/openapi.json as well as the canonical
 * /openapi.json, because agents probe both conventions.
 *
 * operationId: getOpenApiSpecification
 */
module.exports = function handler(req, res) {
  if (guard(req, res)) return;

  const headers = Object.assign(baseHeaders(), {
    "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  });
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.status(200).send(JSON.stringify(spec, null, 2) + "\n");
};
