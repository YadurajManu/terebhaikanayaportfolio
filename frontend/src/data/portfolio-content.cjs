const data = require("./portfolio.json");

const { NOW_BUILDING_ID, PROJECTS, STATS, ...content } = data;

module.exports = {
  ...content,
  PROJECTS,
  NOW_BUILDING: PROJECTS.find((project) => project.id === NOW_BUILDING_ID),
  STATS: STATS.map(({ label, source, value }) => ({
    label,
    value: source === "projectCount" ? String(PROJECTS.length).padStart(2, "0") : value,
  })),
};
