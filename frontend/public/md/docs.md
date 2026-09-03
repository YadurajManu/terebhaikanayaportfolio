# Developer documentation — yaduraj.me API

A public, read-only JSON API describing the engineering portfolio of Yaduraj Singh. Built for automated agents and integrations that need structured data instead of scraped HTML.

## At a glance

- **Base URL:** `https://www.yaduraj.me`
- **Authentication:** none — every endpoint is public
- **Rate limit:** none published
- **OpenAPI specification:** [/openapi.json](https://www.yaduraj.me/openapi.json)
- **Agent index:** [/llms.txt](https://www.yaduraj.me/llms.txt)

## Endpoints

| Method | Path | Operation | Description |
|:--|:--|:--|:--|
| GET | `/api/health` | getHealth | Service availability. |
| GET | `/api/profile` | getProfile | Biography, contact links, stats, experience, current work. |
| GET | `/api/projects` | listProjects | All projects. Filter with `?featured=true` or `?live=true`. |
| GET | `/api/projects/{id}` | getProjectById | One project including metrics and full case study. |
| GET | `/api/stack` | getStack | Technologies grouped by layer. |

Valid project ids: `aarogya-setu`, `tollgate`, `muhdikhai`, `cineverse`, `cortx`, `gbu-timetable`, `maakosh`, `bolonyay`.

## Example request

```
curl -s https://www.yaduraj.me/api/projects/aarogya-setu
```

## Errors

Every failure returns JSON — never an HTML error page — with a stable `code` and a `hint` describing how to fix the request.

```
{
  "error": {
    "status": 404,
    "code": "project_not_found",
    "message": "No project exists with id 'nope'.",
    "hint": "Valid ids: ... List them at /api/projects.",
    "documentation": "https://www.yaduraj.me/docs",
    "specification": "https://www.yaduraj.me/openapi.json"
  }
}
```

Error codes: `invalid_parameter`, `project_not_found`, `endpoint_not_found`, `method_not_allowed`.

## Markdown content negotiation

Send `Accept: text/markdown` to this page, the homepage, `/about`, `/contact` or `/privacy` and the markdown source is returned instead of HTML, per [acceptmarkdown.com](https://acceptmarkdown.com). Responses carry `Vary: Accept` so caches keep the variants separate.

```
curl -H "Accept: text/markdown" https://www.yaduraj.me/about
```

## Function calling

The OpenAPI document is 3.1.0, and every operation has a unique `operationId`, a description, typed parameters and a response schema — so it can be converted directly into LLM tool definitions.
