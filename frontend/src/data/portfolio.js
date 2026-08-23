/**
 * Portfolio content.
 *
 * The data itself lives in ./portfolio.json so that the React app, the
 * serverless API under /api and the build-time prerenderer all read the same
 * source — there is no second copy to drift. This module keeps the original
 * named exports so no component import had to change.
 *
 * Regenerate the JSON from a previous revision of this file with:
 *   node scripts/gen-portfolio-json.js
 */
import data from "./portfolio.json";

export const PROFILE = data.PROFILE;
export const STATS = data.STATS;
export const ABOUT_POINTS = data.ABOUT_POINTS;
export const EXPERIENCE = data.EXPERIENCE;
export const PROJECTS = data.PROJECTS;
export const STACK = data.STACK;
export const NOW_BUILDING = data.NOW_BUILDING;

export default data;
