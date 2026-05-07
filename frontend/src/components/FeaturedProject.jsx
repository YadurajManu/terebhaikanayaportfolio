import { ArrowUpRight, Github, Sparkles } from "lucide-react";

export default function FeaturedProject({ project, onOpen }) {
  if (!project) return null;
  return (
    <div
      data-testid="featured-project"
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] via-[#0A0A0A] to-[#0A0A0A] hover:border-white/20 transition-colors"
    >
      {/* corner accent */}
      <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-[var(--accent)]/8 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

      <div className="relative grid md:grid-cols-12 gap-8 p-7 md:p-10">
        {/* left */}
        <div className="md:col-span-7 flex flex-col">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
              <Sparkles size={11} /> featured
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500">{project.tag}</span>
            {project.live && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </span>
                  live · last deploy {project.lastDeploy}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-6 font-display text-4xl md:text-6xl tracking-tighter font-medium text-white">
            {project.name}
          </h3>

          <p className="mt-4 max-w-xl text-zinc-400 leading-relaxed">
            {project.blurb}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.015] text-[10.5px] font-mono text-zinc-400"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              data-testid="featured-case-study"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-2 bg-white text-black h-10 px-5 rounded-full font-medium text-[13px] hover:bg-zinc-200 transition-colors"
            >
              read case study
              <ArrowUpRight size={14} />
            </button>
            {project.url && (
              <a
                data-testid="featured-live-url"
                href={project.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-zinc-300 border border-white/15 h-10 px-4 rounded-full font-mono text-xs hover:text-white hover:border-white/30 transition-colors"
              >
                ↗ {project.url.replace(/^https?:\/\//, "")}
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-mono"
              >
                <Github size={13} /> source
              </a>
            )}
          </div>
        </div>

        {/* right — metrics */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 self-stretch content-start">
          {project.metrics?.map((m, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-black/40 p-4"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {m.k}
              </div>
              <div className="mt-2 font-display text-2xl text-white tracking-tight">
                {m.v}
              </div>
            </div>
          ))}
          <div className="col-span-2 rounded-xl border border-white/[0.04] bg-black/30 p-4 font-mono text-[11px] text-zinc-500">
            <span className="text-zinc-600">$</span> curl -I {project.url?.replace(/^https?:\/\//, "")}{" "}
            <span className="text-[var(--accent)]/80">→ 200 OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
