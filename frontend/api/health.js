const { ok, guard } = require("./_lib");

/** operationId: getHealth */
module.exports = function handler(req, res) {
  if (guard(req, res)) return;
  ok(res, {
    status: "ok",
    service: "yaduraj.me public API",
    version: "1.0.0",
    documentation: "https://www.yaduraj.me/docs",
    specification: "https://www.yaduraj.me/openapi.json",
    timestamp: new Date().toISOString(),
  });
};
