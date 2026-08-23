#!/usr/bin/env node
/**
 * Emits public/openapi.json from the same portfolio data the API serves, so the
 * documented project ids can never drift from the ones the endpoints accept.
 *
 * Every operation carries a unique operationId, a description and a typed
 * response schema — that combination is what makes the spec usable both for
 * complexity analysis and for LLM function-calling.
 */
const fs = require("fs");
const path = require("path");

const data = require("../src/data/portfolio.json");

const OUT = path.join(__dirname, "..", "public", "openapi.json");
const ORIGIN = "https://www.yaduraj.me";
const projectIds = data.PROJECTS.map((p) => p.id);

const errorResponse = (description) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorEnvelope" },
    },
  },
});

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Yaduraj Singh — Portfolio API",
    version: "1.0.0",
    summary: "Read-only JSON access to Yaduraj Singh's engineering portfolio.",
    description: [
      "A public, unauthenticated, read-only API describing the engineering work of",
      "Yaduraj Singh — a full-stack engineer and AI/ML builder based in India.",
      "",
      "Use it to retrieve his profile, shipped projects with case-study detail, and",
      "technology stack as structured JSON rather than scraping the HTML site.",
      "",
      "No authentication, no rate limit, no write operations. Every response —",
      "including errors — is JSON with a stable machine-readable `code`.",
    ].join("\n"),
    contact: {
      name: data.PROFILE.name,
      email: data.PROFILE.email,
      url: ORIGIN,
    },
    license: { name: "CC-BY-4.0", identifier: "CC-BY-4.0" },
  },
  servers: [{ url: ORIGIN, description: "Production" }],
  externalDocs: { description: "Developer documentation", url: `${ORIGIN}/docs` },
  tags: [
    { name: "meta", description: "Service metadata and availability." },
    { name: "profile", description: "Biography, experience and current work." },
    { name: "projects", description: "Shipped projects and their case studies." },
    { name: "stack", description: "Technologies grouped by layer." },
  ],
  paths: {
    "/api/health": {
      get: {
        operationId: "getHealth",
        tags: ["meta"],
        summary: "Service health",
        description:
          "Returns service availability and pointers to the documentation and specification. Use this to confirm the API is reachable before issuing other calls.",
        responses: {
          200: {
            description: "Service is healthy.",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Health" } },
            },
          },
          405: errorResponse("Method not allowed — this API is read-only."),
        },
      },
    },
    "/api/profile": {
      get: {
        operationId: "getProfile",
        tags: ["profile"],
        summary: "Get profile",
        description:
          "Returns the full professional profile: name, role, location, contact links, headline statistics, engineering highlights, employment history, and the product currently being built. Use this to answer questions about who Yaduraj Singh is, what he has done, or how to contact him.",
        responses: {
          200: {
            description: "The profile.",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Profile" } },
            },
          },
          405: errorResponse("Method not allowed — this API is read-only."),
        },
      },
    },
    "/api/projects": {
      get: {
        operationId: "listProjects",
        tags: ["projects"],
        summary: "List projects",
        description:
          "Returns every shipped project with a summary, category, technology stack and links. Optionally filter to featured or live projects. Use this to discover project ids before calling getProjectById.",
        parameters: [
          {
            name: "featured",
            in: "query",
            required: false,
            description: "Restrict to featured projects when true, non-featured when false.",
            schema: { type: "boolean" },
          },
          {
            name: "live",
            in: "query",
            required: false,
            description: "Restrict to projects with a live deployment when true.",
            schema: { type: "boolean" },
          },
        ],
        responses: {
          200: {
            description: "Matching projects.",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ProjectList" } },
            },
          },
          400: errorResponse("A query parameter was not a boolean."),
          405: errorResponse("Method not allowed — this API is read-only."),
        },
      },
    },
    "/api/projects/{id}": {
      get: {
        operationId: "getProjectById",
        tags: ["projects"],
        summary: "Get a project",
        description:
          "Returns one project including its metrics and full case study — the problem it solved, the approach taken, and the engineering decisions made. Use this when asked why or how a specific project was built.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The project identifier, as returned by listProjects.",
            schema: { type: "string", enum: projectIds, examples: [projectIds[0]] },
          },
        ],
        responses: {
          200: {
            description: "The project.",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Project" } },
            },
          },
          404: errorResponse("No project exists with that id."),
          405: errorResponse("Method not allowed — this API is read-only."),
        },
      },
    },
    "/api/stack": {
      get: {
        operationId: "getStack",
        tags: ["stack"],
        summary: "Get technology stack",
        description:
          "Returns the technologies used, grouped by layer — web, mobile, real-time, AI/ML, embedded, databases and infrastructure. Use this to answer whether a given technology is in his toolkit.",
        responses: {
          200: {
            description: "The stack.",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Stack" } },
            },
          },
          405: errorResponse("Method not allowed — this API is read-only."),
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorEnvelope: {
        type: "object",
        description: "Uniform error envelope returned by every failing request.",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["status", "code", "message"],
            properties: {
              status: { type: "integer", description: "HTTP status code.", examples: [404] },
              code: {
                type: "string",
                description: "Stable machine-readable error code.",
                enum: [
                  "invalid_parameter",
                  "project_not_found",
                  "endpoint_not_found",
                  "method_not_allowed",
                ],
              },
              message: { type: "string", description: "Human-readable explanation." },
              hint: { type: "string", description: "How to correct the request." },
              documentation: { type: "string", format: "uri" },
              specification: { type: "string", format: "uri" },
            },
          },
        },
      },
      Health: {
        type: "object",
        required: ["status", "service", "version"],
        properties: {
          status: { type: "string", enum: ["ok"], description: "Service status." },
          service: { type: "string", description: "Service name." },
          version: { type: "string", description: "API version." },
          documentation: { type: "string", format: "uri" },
          specification: { type: "string", format: "uri" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      Stat: {
        type: "object",
        required: ["value", "label"],
        properties: {
          value: { type: "string", description: "Headline figure.", examples: ["2,000+"] },
          label: { type: "string", description: "What the figure counts." },
        },
      },
      Experience: {
        type: "object",
        required: ["role", "organization"],
        properties: {
          role: { type: "string", description: "Job title." },
          organization: { type: "string", description: "Employer." },
          period: { type: "string", description: "Dates worked." },
          highlights: { type: "array", items: { type: "string" } },
          stack: { type: "array", items: { type: "string" } },
        },
      },
      Profile: {
        type: "object",
        required: ["name", "role", "links"],
        properties: {
          name: { type: "string" },
          age: { type: "integer" },
          role: { type: "string" },
          location: { type: "string" },
          tagline: { type: "string" },
          links: {
            type: "object",
            properties: {
              portfolio: { type: "string", format: "uri" },
              github: { type: "string", format: "uri" },
              linkedin: { type: "string", format: "uri" },
              email: { type: "string", format: "email" },
              resume: { type: "string", format: "uri" },
            },
          },
          stats: { type: "array", items: { $ref: "#/components/schemas/Stat" } },
          highlights: { type: "array", items: { type: "string" } },
          experience: { type: "array", items: { $ref: "#/components/schemas/Experience" } },
          nowBuilding: {
            type: "object",
            properties: {
              name: { type: "string" },
              status: { type: "string" },
              url: { type: "string", format: "uri" },
              pitch: { type: "string" },
              highlights: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      ProjectSummary: {
        type: "object",
        required: ["id", "name", "summary"],
        properties: {
          id: { type: "string", enum: projectIds, description: "Stable identifier." },
          name: { type: "string" },
          summary: { type: "string", description: "One-line description." },
          category: { type: "string", description: "Classification tag." },
          stack: { type: "array", items: { type: "string" } },
          url: { type: ["string", "null"], description: "Live deployment, if any." },
          repository: { type: ["string", "null"], description: "Source repository, if public." },
          featured: { type: "boolean" },
          live: { type: "boolean", description: "Whether a live deployment is published." },
          detailUrl: { type: "string", format: "uri", description: "Call getProjectById here." },
        },
      },
      Project: {
        allOf: [
          { $ref: "#/components/schemas/ProjectSummary" },
          {
            type: "object",
            properties: {
              metrics: {
                type: "array",
                items: {
                  type: "object",
                  properties: { label: { type: "string" }, value: { type: "string" } },
                },
              },
              caseStudy: {
                type: ["object", "null"],
                description: "Problem, approach and engineering decisions.",
                properties: {
                  problem: { type: "string" },
                  approach: { type: "array", items: { type: "string" } },
                  decisions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        ],
      },
      ProjectList: {
        type: "object",
        required: ["count", "projects"],
        properties: {
          count: { type: "integer", description: "Projects in this response." },
          total: { type: "integer", description: "Projects before filtering." },
          projects: { type: "array", items: { $ref: "#/components/schemas/ProjectSummary" } },
        },
      },
      Stack: {
        type: "object",
        required: ["groups"],
        properties: {
          groups: {
            type: "array",
            items: {
              type: "object",
              required: ["group", "technologies"],
              properties: {
                group: { type: "string", description: "Layer name." },
                technologies: { type: "array", items: { type: "string" } },
              },
            },
          },
          totalTechnologies: { type: "integer" },
        },
      },
    },
  },
};

fs.writeFileSync(OUT, JSON.stringify(spec, null, 2) + "\n");
console.log(
  `wrote ${OUT} — ${Object.keys(spec.paths).length} paths, ` +
    `${Object.keys(spec.components.schemas).length} schemas, ids: ${projectIds.length}`
);
