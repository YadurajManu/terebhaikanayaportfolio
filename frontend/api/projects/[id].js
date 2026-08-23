const { ok, fail, guard } = require("../_lib");
const data = require("../../src/data/portfolio.json");

/** operationId: getProjectById */
module.exports = function handler(req, res) {
  if (guard(req, res)) return;

  const { id } = req.query || {};
  const project = data.PROJECTS.find((p) => p.id === id);

  if (!project) {
    return fail(
      res,
      404,
      "project_not_found",
      `No project exists with id '${id}'.`,
      `Valid ids: ${data.PROJECTS.map((p) => p.id).join(", ")}. List them at /api/projects.`
    );
  }

  ok(res, {
    id: project.id,
    name: project.name,
    summary: project.blurb,
    category: project.tag,
    stack: project.stack,
    url: project.url,
    repository: project.repo,
    featured: Boolean(project.featured),
    live: Boolean(project.live),
    metrics: (project.metrics || []).map((m) => ({ label: m.k, value: m.v })),
    caseStudy: project.caseStudy
      ? {
          problem: project.caseStudy.problem,
          approach: project.caseStudy.approach,
          decisions: project.caseStudy.decisions,
        }
      : null,
  });
};
