#!/usr/bin/env node
/**
 * One-shot generator: transpiles src/data/portfolio.js (ESM) and dumps its
 * named exports to src/data/portfolio.json.
 *
 * portfolio.js then becomes a thin re-export of that JSON, so the React app,
 * the serverless API and the prerenderer all read one source of truth. Kept in
 * the repo so the conversion is reproducible and auditable rather than a
 * hand-transcribed blob.
 */
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const SRC = path.join(__dirname, "..", "src", "data", "portfolio.js");
const OUT = path.join(__dirname, "..", "src", "data", "portfolio.json");

const { code } = babel.transformFileSync(SRC, {
  presets: [[require.resolve("@babel/preset-env"), { targets: { node: "current" } }]],
  babelrc: false,
  configFile: false,
});

const module_ = { exports: {} };
// eslint-disable-next-line no-new-func
new Function("module", "exports", "require", code)(module_, module_.exports, require);

const data = {};
for (const [key, value] of Object.entries(module_.exports)) {
  if (key === "__esModule" || key === "default") continue;
  data[key] = value;
}

fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`wrote ${OUT} with exports: ${Object.keys(data).join(", ")}`);
