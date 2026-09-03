/**
 * The visual slot at the top of a project card.
 *
 * If the project declares an `image`, that is what renders — a real screenshot
 * always beats a generated one. Otherwise this draws a deterministic dot-matrix
 * derived from the project id, so every card has a distinct, stable identity
 * without pretending to be a screenshot of software it is not showing.
 *
 * Drop a real capture at public/projects/<id>.png and add to portfolio.json:
 *   "image": { "src": "/projects/<id>.png", "alt": "…what is on screen…" }
 */

/** xmutable-free 32-bit hash — same id always yields the same pattern. */
function seedFrom(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic PRNG (mulberry32). */
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLS = 22;
const ROWS = 11;

function Matrix({ id }) {
  const next = rng(seedFrom(id));
  const cells = [];

  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const v = next();
      // Bias density toward the lower-left so the composition has a diagonal
      // drift rather than looking like uniform noise.
      const drift = (c / COLS) * 0.55 + ((ROWS - r) / ROWS) * 0.25;
      if (v > 0.34 + drift * 0.5) continue;
      const lit = v < 0.06;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * 16 + 6}
          y={r * 16 + 6}
          width={lit ? 5 : 4}
          height={lit ? 5 : 4}
          rx="1"
          fill={lit ? "var(--accent)" : "currentColor"}
          opacity={lit ? 0.85 : 0.16 + v * 0.5}
        />
      );
    }
  }
  return <g>{cells}</g>;
}

export default function ProjectCover({ project, className = "" }) {
  const { image, id } = project;

  if (image?.src) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-black/40 ${className}`}
        style={{ aspectRatio: "16 / 9" }}
      >
        <img
          src={image.src}
          alt={image.alt || ""}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      data-testid={`project-cover-${id}`}
      aria-hidden="true"
      className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-black/40 text-zinc-500 ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <svg
        viewBox="0 0 364 184"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <Matrix id={id} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/[0.07] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}
