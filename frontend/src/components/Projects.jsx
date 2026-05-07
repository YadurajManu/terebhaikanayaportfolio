import { ArrowUpRight, Github } from "lucide-react";
import { PROJECTS } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import FeaturedProject from "./FeaturedProject";

export default function Projects({ onOpenProject }) {
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <SectionHeader
          index="04"
          title="projects"
          subtitle="// shipped & live"
        />

        <p className="mt-6 max-w-2xl text-zinc-400">
          Eight production projects across SaaS, real-time, AI/ML, embedded, and
          iOS. Click any card for a deeper case study.
        </p>

        {featured && (
          <div className="mt-14">
            <FeaturedProject project={featured} onOpen={onOpenProject} />
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {rest.map((p, i) => (
            <ProjectCard
              key={p.id}
              p={p}
              index={i}
              onOpen={() => onOpenProject?.(p)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, index, onOpen }) {
  const idx = String(index + 2).padStart(2, "0"); // start at 02, since 01 is featured

  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid={`project-card-${p.id}`}
      className="group relative block text-left overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0A0A] hover:border-white/20 transition-colors p-6 md:p-7"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] text-zinc-600 shrink-0">{idx}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/80 truncate">
            {p.tag}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-white transition-colors shrink-0">
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              data-testid={`project-${p.id}-repo`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md hover:bg-white/5"
              aria-label="github repo"
            >
              <Github size={14} />
            </a>
          )}
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              data-testid={`project-${p.id}-live`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md hover:bg-white/5"
              aria-label="open live site"
            >
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          )}
        </div>
      </div>

      <h3 className="relative mt-6 font-display text-2xl md:text-3xl text-white tracking-tight">
        {p.name}
      </h3>

      <p className="relative mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">
        {p.blurb}
      </p>

      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {p.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.015] text-[10.5px] font-mono text-zinc-400"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="relative mt-5 pt-5 border-t border-white/[0.05] flex items-center justify-between font-mono text-[11px]">
        {p.live ? (
          <span className="inline-flex items-center gap-2 text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </span>
            <span>live · {p.lastDeploy}</span>
          </span>
        ) : (
          <span className="text-zinc-600">archived · open-source</span>
        )}
        <span className="text-zinc-500 group-hover:text-[var(--accent)] transition-colors">
          read case study →
        </span>
      </div>
    </button>
  );
}
