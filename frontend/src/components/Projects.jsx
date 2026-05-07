import { ArrowUpRight, Github } from "lucide-react";
import { PROJECTS } from "../data/portfolio";
import SectionHeader from "./SectionHeader";

export default function Projects() {
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
          iOS. Click any card — most are live and self-hosted.
        </p>

        <div className="mt-14 grid md:grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, index }) {
  const idx = String(index + 1).padStart(2, "0");
  const Wrapper = p.url ? "a" : "div";
  const wrapperProps = p.url
    ? { href: p.url, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      data-testid={`project-card-${index}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0A0A] hover:border-white/20 transition-colors p-6 md:p-7"
    >
      {/* gradient hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-zinc-600">{idx}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/80">
            {p.tag}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-white transition-colors">
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              data-testid={`project-${index}-repo`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md hover:bg-white/5"
              aria-label="github repo"
            >
              <Github size={14} />
            </a>
          )}
          {p.url && (
            <span className="p-1.5">
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
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
        {p.stack.map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.015] text-[10.5px] font-mono text-zinc-400"
          >
            {s}
          </span>
        ))}
      </div>

      {p.url && (
        <div className="relative mt-5 pt-5 border-t border-white/[0.05] font-mono text-[11px] text-zinc-500">
          <span className="text-zinc-600">↗</span>{" "}
          <span className="group-hover:text-[var(--accent)] transition-colors">
            {p.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      )}
    </Wrapper>
  );
}
