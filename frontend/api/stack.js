const { ok, guard } = require("./_lib");
const data = require("../src/data/portfolio.json");

/** operationId: getStack */
module.exports = function handler(req, res) {
  if (guard(req, res)) return;

  const groups = data.STACK.map((g) => ({ group: g.group, technologies: g.items }));

  ok(res, {
    groups,
    totalTechnologies: groups.reduce((n, g) => n + g.technologies.length, 0),
  });
};
