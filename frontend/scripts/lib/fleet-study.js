const { escapeHtml: e } = require("./md");

const assets = "/fleet-study";
const revision = "d77ef259b9f625e2ee433143beb7a2956506b8d6";
const architecture = [
  {
    label: "Deploy",
    nodes: [
      ["CLI or GitHub", "Submits a prebuilt image, an uploaded local snapshot, or an exact Git commit."],
      ["Fastify control plane", "Persists desired state in PostgreSQL and runs placement. Redis holds current agent heartbeat snapshots."],
      ["Go runtime agent", "Polls desired state, pulls the assigned digest from the registry, and reconciles containers with Docker Engine."],
    ],
  },
  {
    label: "Build",
    nodes: [
      ["Platform planner", "Creates a durable build job for each target platform and assigns it to an eligible, opted-in builder."],
      ["Go builder agent", "Receives the assignment over its outbound WebSocket connection and starts a per-job BuildKit worker."],
      ["Registry gateway", "Accepts the scoped image push over TLS. The control plane can assemble multiple digests into a manifest."],
    ],
  },
  {
    label: "Serve traffic",
    nodes: [
      ["Public HTTPS request", "A visitor reaches the app through a hostname configured on the ingress edge."],
      ["Caddy and ingress proxy", "Caddy terminates TLS. The proxy routes to the active deployment."],
      ["Runtime agent and container", "The proxy can reuse the outbound connection opened by the agent to reach a container behind NAT."],
    ],
  },
];

const agentSteps = [
  ["Pair", "A single-use token registers a node. The Go agent persists its own identity for later connections."],
  ["Connect", "The agent initiates HTTPS and WSS to the control plane. The worker needs no inbound router port forwarding."],
  ["Report capabilities", "Heartbeats report Docker Engine platform, capacity, containers, and health. Docker Desktop reports capacity from its Linux VM."],
  ["Reconcile", "The agent polls desired state, pulls the assigned digest, and starts or updates the local container."],
  ["Report health", "The control plane uses observed health to promote a replacement. A missing heartbeat can trigger reevaluation for flexible workloads. Local volumes stay on their node."],
];

const buildSteps = [
  ["Resolve source", "The CLI uploads a local snapshot, including uncommitted changes. GitHub builds use an exact commit with repository-scoped credentials."],
  ["Plan platforms", "Fleet resolves the requested platforms and creates one durable job per platform. Automatic planning considers healthy, placement-eligible nodes."],
  ["Run BuildKit", "An opted-in agent runs BuildKit with CPU and memory limits and a monitored disk budget. Native builders are preferred. QEMU fallback is opt-in."],
  ["Publish digest", "A short-lived registry credential authorizes the push for the active job attempt. The control plane assembles the manifest when multiple platforms are built."],
  ["Roll out", "The runtime node can differ from the builder. The runtime agent pulls the immutable digest and reports the replacement's health."],
];

function magnify(id, label, items) {
  return `<div class="switcher" hidden data-pane-controls role="group" aria-label="${e(label)}">
${items.map((item, i) => `<button type="button" data-pane="${id}-${i}" aria-controls="${id}-${i}" aria-pressed="false">${e(item)}</button>`).join("")}
</div>`;
}

function steps(id, title, items) {
  return `<section id="${id}" class="study-section" data-pane-group>
<h2>${title}</h2>
${magnify(id, title, items.map(([label]) => label))}
<div class="step-panels">
${items.map(([label, description], i) => `<div class="step-panel" id="${id}-${i}">
<h3>${e(label)}</h3><p>${e(description)}</p>
</div>`).join("")}
</div></section>`;
}

function fleetStudy(project, article) {
  const source = `${project.repo}/blob/${revision}`;
  const notes = article.replace(
    "<h2>Engineering decisions and trade-offs</h2>",
    '<h2 id="trade-offs">Engineering decisions and trade-offs</h2>'
  );

  return `
<section class="study-hero" aria-labelledby="fleet-title">
  <div>
    <a class="study-back" href="/projects">← All projects</a>
    <h1 id="fleet-title">Fleet OS</h1>
    <p class="study-lead">Deploy Linux containers on the hardware you already own.</p>
    <p>Build on opted-in nodes, route apps from behind NAT, and see why each deployment landed where it did.</p>
    <div class="hero-actions">
      <a class="action action-primary" href="#demo">Watch the 2-minute demo</a>
      <a class="action" href="#placement">Explore a deployment</a>
      <a class="source-link" href="${e(project.repo)}">GitHub ↗</a>
    </div>
  </div>
  <figure class="hero-preview">
    <img src="${assets}/nodes.png" width="1024" height="681" alt="Fleet OS dashboard showing three nodes with CPU, memory, and disk utilization">
    <figcaption>Fleet OS node inventory</figcaption>
  </figure>
</section>
<nav class="study-nav" aria-label="Case study sections">
  <a href="#architecture">Architecture</a><a href="#placement">Scheduler</a><a href="#agent">Go agent</a><a href="#build">BuildKit</a><a href="#demo">Demo</a><a href="#trade-offs">Trade-offs</a>
</nav>
<section id="architecture" class="study-section" data-pane-group>
  <h2>System architecture</h2>
  <p>Follow a deployment, a build, or an incoming web request through Fleet OS.</p>
  ${magnify("arch", "Architecture flow", architecture.map(({ label }) => label))}
  ${architecture.map(({ label, nodes }, i) => `<div class="diagram" id="arch-${i}">
    <h3>${e(label)} path</h3>
    <ol class="diagram-flow">
      ${nodes.map(([name, description]) => `<li><details><summary>${e(name)}</summary><p>${e(description)}</p></details></li>`).join("")}
    </ol>
  </div>`).join("")}
  <p class="diagram-note">Worker connections originate at the agent. The control plane, ingress, and registry still need reachable endpoints.</p>
  <a class="source-link" href="${source}/docs/ARCHITECTURE.md">Architecture source ↗</a>
</section>
<section id="placement" class="study-section">
  <h2>Why did Fleet OS pick this node?</h2>
  <p>Hard constraints eliminate nodes first. Fleet OS ranks the remaining candidates by memory headroom after placement, reliability, and idle capacity.</p>
  <div class="placement-grid">
    <form id="placement-form" class="placement-form" hidden>
      <label for="placement-platform">Image platform</label>
      <select id="placement-platform" name="platform">
        <option value="multi">Multi-architecture</option><option value="linux/arm64">Linux / ARM64</option><option value="linux/amd64">Linux / AMD64</option>
      </select>
      <label for="placement-ram">Memory reservation</label>
      <select id="placement-ram" name="ram">
        <option value="512">512 MiB</option><option value="2048">2 GiB</option><option value="4096">4 GiB</option><option value="8192">8 GiB</option>
      </select>
      <label for="placement-policy">Placement policy</label>
      <select id="placement-policy" name="policy">
        <option value="flexible">Flexible web service</option><option value="pinned">Pinned service with a local volume</option>
      </select>
      <label class="checkbox"><input type="checkbox" name="offline"> Take the Mac offline</label>
      <button type="reset">Reset scenario</button>
    </form>
    <div class="placement-report">
      <p id="placement-outcome" role="status">Example: an ARM64 image rules out the x86 VPS when emulation is disabled.</p>
      <div id="placement-results" class="placement-results"></div>
    </div>
  </div>
  <p class="diagram-note">Example fleet with fixed capacity and load values. This model uses Fleet OS’s 50% headroom, 30% reliability, and 20% idle-capacity weights. It exposes platform, memory, pinning, and node availability. The production scheduler also evaluates constraints such as CPU, tags, and affinity.</p>
  <a class="source-link" href="${source}/control-plane/src/scheduler/placement.ts">Placement algorithm source ↗</a>
</section>
<div class="study-workflows">
  ${steps("agent", "Go agent lifecycle", agentSteps)}
  ${steps("build", "BuildKit pipeline", buildSteps)}
</div>
<section id="demo" class="study-section">
  <h2>Two-minute deployment walkthrough</h2>
  <p>A narrated walkthrough using real dashboard screenshots and an illustrated deployment sequence.</p>
  <video controls preload="none" playsinline width="1280" height="720" poster="${assets}/demo-poster.png" aria-label="Two-minute Fleet OS deployment walkthrough">
    <source src="${assets}/walkthrough.mp4" type="video/mp4">
    <track kind="captions" src="${assets}/walkthrough.vtt" srclang="en" label="English" default>
    <a href="${assets}/walkthrough.mp4">Download the walkthrough</a>
  </video>
  <details class="demo-transcript"><summary>Read the transcript</summary>
    <ol>
      <li>Pair workers. Each Go agent opens its connection to the control plane and reports Docker Engine capacity.</li>
      <li>Define an app in fleet.yaml and submit a prebuilt image, a CLI snapshot, or an exact Git commit.</li>
      <li>For a source build, Fleet OS assigns an opted-in BuildKit worker. It pushes to a registry and returns a digest.</li>
      <li>Placement filters nodes that cannot run the image or lack capacity and ranks the eligible machines.</li>
      <li>The runtime agent pulls the digest and reports health. The ingress proxy can reach it over the agent-opened connection.</li>
      <li>An unhealthy stateless replacement leaves the previous healthy release serving. A pinned local volume stays on its data node.</li>
    </ol>
  </details>
  <div class="study-gallery">
    <figure><a href="${assets}/nodes.png"><img src="${assets}/nodes.png" width="1024" height="681" loading="lazy" alt="Fleet OS node inventory with health, capacity and recent heartbeats"></a><figcaption>Node inventory and recent heartbeats</figcaption></figure>
    <figure><a href="${assets}/node-detail.png"><img src="${assets}/node-detail.png" width="634" height="530" loading="lazy" alt="Fleet OS node detail with resource gauges and container process explorer"></a><figcaption>Node detail and container inspection</figcaption></figure>
  </div>
</section>
<article class="study-notes">
${notes}
</article>`;
}

module.exports = { fleetStudy };
