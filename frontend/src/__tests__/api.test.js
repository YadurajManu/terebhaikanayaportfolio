/**
 * Contract tests for the public read-only API.
 *
 * The behaviour these lock down is the reason the endpoints exist: an agent
 * must never receive HTML, and every failure must carry a machine-matchable
 * code plus a hint telling it what to do next.
 */
const health = require("../../api/health");
const profile = require("../../api/profile");
const listProjects = require("../../api/projects/index");
const getProject = require("../../api/projects/[id]");
const stack = require("../../api/stack");
const notFound = require("../../api/[...slug]");
const data = require("../data/portfolio.json");

/** Minimal stand-in for the Vercel Node response object. */
function mockRes() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
}

function call(handler, { method = "GET", query = {}, url = "/api/test" } = {}) {
  const res = mockRes();
  handler({ method, query, url, headers: {} }, res);
  return res;
}

const parse = (res) => JSON.parse(res.body);

describe("response envelope", () => {
  const cases = [
    ["health", health, {}],
    ["profile", profile, {}],
    ["projects", listProjects, {}],
    ["stack", stack, {}],
  ];

  it.each(cases)("%s returns parseable JSON with a JSON content type", (_name, handler) => {
    const res = call(handler);
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(() => parse(res)).not.toThrow();
  });

  it.each(cases)("%s sets Vary: Accept so caches keep variants apart", (_name, handler) => {
    const res = call(handler);
    expect(res.headers.vary).toContain("Accept");
  });

  it.each(cases)("%s is CORS-readable by agents", (_name, handler) => {
    expect(call(handler).headers["access-control-allow-origin"]).toBe("*");
  });
});

describe("getProfile", () => {
  it("exposes contact links agents can use without scraping", () => {
    const body = parse(call(profile));
    expect(body.name).toBe(data.PROFILE.name);
    expect(body.links.email).toBe(data.PROFILE.email);
    expect(body.links.github).toBe(data.PROFILE.github);
    expect(body.links.resume).toMatch(/Resume_Web\.pdf$/);
  });
});

describe("listProjects", () => {
  it("returns every project with a detail URL", () => {
    const body = parse(call(listProjects));
    expect(body.count).toBe(data.PROJECTS.length);
    expect(body.projects).toHaveLength(data.PROJECTS.length);
    for (const p of body.projects) {
      expect(p.detailUrl).toBe(`https://www.yaduraj.me/api/projects/${p.id}`);
    }
  });

  it("filters by featured", () => {
    const body = parse(call(listProjects, { query: { featured: "true" } }));
    expect(body.projects.every((p) => p.featured)).toBe(true);
    expect(body.total).toBe(data.PROJECTS.length);
  });

  it("filters by live", () => {
    const body = parse(call(listProjects, { query: { live: "false" } }));
    expect(body.projects.every((p) => p.live === false)).toBe(true);
  });

  it("rejects a non-boolean filter with a coded 400", () => {
    const res = call(listProjects, { query: { featured: "yes" } });
    expect(res.statusCode).toBe(400);
    const { error } = parse(res);
    expect(error.code).toBe("invalid_parameter");
    expect(error.message).toContain("featured");
    expect(error.hint).toBeTruthy();
  });
});

describe("getProjectById", () => {
  it("returns the case study for a known id", () => {
    const known = data.PROJECTS[0].id;
    const body = parse(call(getProject, { query: { id: known } }));
    expect(body.id).toBe(known);
    expect(Array.isArray(body.metrics)).toBe(true);
    expect(body.caseStudy).toHaveProperty("problem");
  });

  it("returns a coded 404 that lists valid ids", () => {
    const res = call(getProject, { query: { id: "definitely-not-real" } });
    expect(res.statusCode).toBe(404);
    const { error } = parse(res);
    expect(error.code).toBe("project_not_found");
    expect(error.hint).toContain(data.PROJECTS[0].id);
    expect(error.documentation).toMatch(/\/docs$/);
  });
});

describe("unknown /api paths", () => {
  it("return JSON, never the HTML app shell", () => {
    const res = call(notFound, { url: "/api/nope" });
    expect(res.statusCode).toBe(404);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    const { error } = parse(res);
    expect(error.code).toBe("endpoint_not_found");
    expect(error.hint).toContain("/api/profile");
  });

  it("name the attempted path", () => {
    const { error } = parse(call(notFound, { url: "/api/does/not/exist?x=1" }));
    expect(error.message).toContain("/api/does/not/exist");
  });
});

describe("method handling", () => {
  it("rejects writes with a coded 405 and an Allow header", () => {
    const res = call(profile, { method: "POST" });
    expect(res.statusCode).toBe(405);
    expect(res.headers.allow).toContain("GET");
    expect(parse(res).error.code).toBe("method_not_allowed");
  });

  it("answers CORS preflight with 204", () => {
    const res = call(profile, { method: "OPTIONS" });
    expect(res.statusCode).toBe(204);
    expect(res.headers["access-control-allow-methods"]).toContain("GET");
  });
});
