/**
 * Guards the portfolio.js -> portfolio.json refactor.
 *
 * The React app, the serverless API and the prerenderer now all read one JSON
 * source. These tests assert the module still exposes the exact named exports
 * every component imports, and that the data keeps the shape the API promises.
 */
import defaultExport, {
  PROFILE,
  STATS,
  ABOUT_POINTS,
  EXPERIENCE,
  PROJECTS,
  STACK,
  NOW_BUILDING,
} from "../data/portfolio";

import raw from "../data/portfolio.json";

describe("named exports", () => {
  it("still exports every symbol the components import", () => {
    expect(PROFILE).toBeDefined();
    expect(STATS).toBeDefined();
    expect(ABOUT_POINTS).toBeDefined();
    expect(EXPERIENCE).toBeDefined();
    expect(PROJECTS).toBeDefined();
    expect(STACK).toBeDefined();
    expect(NOW_BUILDING).toBeDefined();
  });

  it("re-exports the JSON without transforming it", () => {
    expect(PROFILE).toEqual(raw.PROFILE);
    expect(PROJECTS).toEqual(raw.PROJECTS);
    expect(STACK).toEqual(raw.STACK);
    expect(defaultExport).toEqual(raw);
  });
});

describe("profile shape", () => {
  it("has the fields the API and JSON-LD depend on", () => {
    for (const key of ["name", "role", "location", "email", "github", "linkedin", "tagline"]) {
      expect(typeof PROFILE[key]).toBe("string");
      expect(PROFILE[key].length).toBeGreaterThan(0);
    }
  });
});

describe("projects", () => {
  it("have unique, URL-safe ids", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("carry the fields the API serialises", () => {
    for (const p of PROJECTS) {
      expect(typeof p.name).toBe("string");
      expect(typeof p.blurb).toBe("string");
      expect(Array.isArray(p.stack)).toBe(true);
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });
});

describe("stats", () => {
  /**
   * The homepage, the JSON API, the markdown pages and the prerender all read
   * this number from the JSON, while the projects section and boot screen count
   * PROJECTS directly. It drifted to "08" against seven projects once; this is
   * what stops it drifting again.
   */
  it("reports the same project count the projects list actually holds", () => {
    const shipped = STATS.find((s) => s.label === "shipped projects");
    expect(shipped).toBeDefined();
    expect(Number(shipped.value)).toBe(PROJECTS.length);
  });
});

describe("stack", () => {
  it("is grouped with non-empty item lists", () => {
    for (const group of STACK) {
      expect(typeof group.group).toBe("string");
      expect(Array.isArray(group.items)).toBe(true);
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});
