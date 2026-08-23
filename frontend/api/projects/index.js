const { ok, fail, guard } = require("../_lib");
const data = require("../../src/data/portfolio.json");

function summarise(p) {
  return {
    id: p.id,
    name: p.name,
    summary: p.blurb,
    category: p.tag,
    stack: p.stack,
    url: p.url,
    repository: p.repo,
    featured: Boolean(p.featured),
    live: Boolean(p.live),
    detailUrl: `https://www.yaduraj.me/api/projects/${p.id}`,
  };
}

/** operationId: listProjects */
module.exports = function handler(req, res) {
  if (guard(req, res)) return;

  const { featured, live } = req.query || {};

  for (const [name, value] of Object.entries({ featured, live })) {
    if (value !== undefined && !["true", "false"].includes(String(value))) {
      return fail(
        res,
        400,
        "invalid_parameter",
        `Query parameter '${name}' must be 'true' or 'false', received '${value}'.`,
        `Retry as /api/projects?${name}=true`
      );
    }
  }

  let projects = data.PROJECTS.map(summarise);
  if (featured !== undefined) projects = projects.filter((p) => p.featured === (featured === "true"));
  if (live !== undefined) projects = projects.filter((p) => p.live === (live === "true"));

  ok(res, { count: projects.length, total: data.PROJECTS.length, projects });
};
