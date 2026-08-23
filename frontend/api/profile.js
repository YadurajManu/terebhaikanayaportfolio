const { ok, guard } = require("./_lib");
const data = require("../src/data/portfolio.json");

/** operationId: getProfile */
module.exports = function handler(req, res) {
  if (guard(req, res)) return;

  const { PROFILE, STATS, ABOUT_POINTS, EXPERIENCE, NOW_BUILDING } = data;

  ok(res, {
    name: PROFILE.name,
    age: PROFILE.age,
    role: PROFILE.role,
    location: PROFILE.location,
    tagline: PROFILE.tagline,
    links: {
      portfolio: `https://${PROFILE.portfolio}`,
      github: PROFILE.github,
      linkedin: PROFILE.linkedin,
      email: PROFILE.email,
      resume: "https://www.yaduraj.me/Resume_Web.pdf",
    },
    stats: STATS.map((s) => ({ value: s.value, label: s.label })),
    highlights: ABOUT_POINTS,
    experience: EXPERIENCE.map((e) => ({
      role: e.role,
      organization: e.org,
      period: e.period,
      highlights: e.points,
      stack: e.stack,
    })),
    nowBuilding: {
      name: NOW_BUILDING.name,
      status: NOW_BUILDING.status,
      url: NOW_BUILDING.url,
      pitch: NOW_BUILDING.pitch,
      highlights: NOW_BUILDING.bullets,
    },
  });
};
