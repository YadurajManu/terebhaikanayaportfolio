/**
 * Fleet OS control-plane / agent topology.
 *
 * Inline SVG rather than a mermaid runtime: it is one static picture, and
 * shipping a diagram library to draw it would cost more than the whole page.
 * Every colour is a theme variable, so it follows light mode for free.
 *
 * The point the drawing has to make is directional — every arrow leaving a
 * node points *outward*, and the only line back in is the reverse tunnel the
 * control plane holds open. That is what lets a node behind a home router
 * serve traffic with no port forward.
 */
export default function FleetTopology() {
  const nodes = [
    { x: 200, label: "Raspberry Pi", arch: "arm64" },
    { x: 370, label: "old laptop", arch: "amd64" },
    { x: 540, label: "spare VPS", arch: "amd64" },
  ];

  return (
    <svg
      viewBox="0 0 720 430"
      role="img"
      aria-labelledby="fleet-topology-title fleet-topology-desc"
      className="w-full h-auto"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      <title id="fleet-topology-title">Fleet OS topology</title>
      <desc id="fleet-topology-desc">
        A control plane running the API, scheduler, ingress, a registry and
        Postgres with Redis. Below it, three nodes — a Raspberry Pi on arm64, an
        old laptop and a spare VPS on amd64 — each running an agent. Every agent
        connection points outward to the control plane over HTTPS. The control
        plane holds one reverse tunnel back to a node for ingress.
      </desc>

      <defs>
        <marker
          id="fleet-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-3)" />
        </marker>
        <marker
          id="fleet-arrow-accent"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* ── inputs ─────────────────────────────────────────────── */}
      {[
        { y: 66, label: "git push" },
        { y: 100, label: "fleet CLI" },
        { y: 134, label: "visitor" },
      ].map((i) => (
        <g key={i.label}>
          <text
            x="14"
            y={i.y + 4}
            fill="var(--text-2)"
            fontSize="12.5"
          >
            {i.label}
          </text>
          <line
            x1="96"
            y1={i.y}
            x2="158"
            y2={i.y}
            stroke="var(--text-3)"
            strokeWidth="1.25"
            markerEnd="url(#fleet-arrow)"
          />
        </g>
      ))}

      {/* ── control plane ──────────────────────────────────────── */}
      <rect
        x="166"
        y="30"
        width="540"
        height="140"
        rx="14"
        fill="var(--surface)"
        stroke="var(--border-hover)"
        strokeWidth="1.25"
      />
      <text x="186" y="56" fill="var(--text-3)" fontSize="11" letterSpacing="1.6">
        CONTROL PLANE — YOUR SERVER, OR HOSTED
      </text>

      {[
        { x: 186, w: 168, label: "API · scheduler", sub: "ingress" },
        { x: 370, w: 140, label: "registry", sub: "multi-arch" },
        { x: 526, w: 160, label: "Postgres", sub: "+ Redis" },
      ].map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y="76"
            width={b.w}
            height="72"
            rx="10"
            fill="var(--surface-2)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x={b.x + b.w / 2}
            y="108"
            textAnchor="middle"
            fill="var(--text)"
            fontSize="13"
          >
            {b.label}
          </text>
          <text
            x={b.x + b.w / 2}
            y="128"
            textAnchor="middle"
            fill="var(--text-3)"
            fontSize="11.5"
          >
            {b.sub}
          </text>
        </g>
      ))}

      {/* ── nodes ──────────────────────────────────────────────── */}
      <text x="14" y="352" fill="var(--text-3)" fontSize="11" letterSpacing="1.6">
        YOUR
      </text>
      <text x="14" y="368" fill="var(--text-3)" fontSize="11" letterSpacing="1.6">
        HARDWARE
      </text>

      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x={n.x}
            y="316"
            width="150"
            height="80"
            rx="12"
            fill="var(--surface)"
            stroke="var(--border-hover)"
            strokeWidth="1.25"
          />
          <circle cx={n.x + 22} cy="342" r="3.5" fill="var(--accent)" />
          <text x={n.x + 36} y="346" fill="var(--accent)" fontSize="12">
            agent
          </text>
          <text x={n.x + 22} y="368" fill="var(--text-2)" fontSize="12">
            {n.label}
          </text>
          <text x={n.x + 22} y="385" fill="var(--text-3)" fontSize="11">
            {n.arch}
          </text>
        </g>
      ))}

      {/* ── outbound-only links (dashed, pointing UP) ──────────── */}
      {nodes.map((n) => (
        <line
          key={`out-${n.label}`}
          x1={n.x + 52}
          y1="312"
          x2={n.x + 52}
          y2="176"
          stroke="var(--text-3)"
          strokeWidth="1.25"
          strokeDasharray="4 5"
          markerEnd="url(#fleet-arrow)"
        />
      ))}
      <text x="200" y="248" fill="var(--text-3)" fontSize="11.5">
        outbound only — no inbound port
      </text>

      {/* ── the one line back in ───────────────────────────────── */}
      <line
        x1="486"
        y1="176"
        x2="486"
        y2="312"
        stroke="var(--accent)"
        strokeWidth="1.5"
        markerEnd="url(#fleet-arrow-accent)"
      />
      <text x="498" y="248" fill="var(--accent)" fontSize="11.5">
        reverse tunnel · ingress
      </text>
    </svg>
  );
}
