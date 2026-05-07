import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowUpRight, Github, X } from "lucide-react";

export default function ProjectModal({ project, open, onOpenChange }) {
  if (!project) return null;
  const cs = project.caseStudy || {};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="project-modal"
        className="max-w-3xl max-h-[88vh] overflow-y-auto border-white/10 bg-[#0A0A0A] text-white p-0 [&>button]:hidden rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 md:px-8 py-4 border-b border-white/[0.06] bg-[#0A0A0A]/90 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/80 shrink-0">
              {project.tag}
            </span>
            <span className="text-zinc-700 shrink-0">/</span>
            <span className="font-mono text-[11px] text-zinc-400 truncate">{project.id}.md</span>
          </div>
          <button
            data-testid="project-modal-close"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 md:px-8 py-8">
          <DialogTitle asChild>
            <h2 className="font-display text-3xl md:text-5xl tracking-tighter font-medium text-white">
              {project.name}
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <p className="mt-3 text-zinc-400 leading-relaxed">{project.blurb}</p>
          </DialogDescription>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black h-9 px-4 rounded-full font-medium text-[12.5px] hover:bg-zinc-200 transition-colors"
              >
                visit live <ArrowUpRight size={13} />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-zinc-300 border border-white/15 h-9 px-4 rounded-full font-mono text-xs hover:text-white"
              >
                <Github size={13} /> source
              </a>
            )}
            {project.live && (
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </span>
                last deploy {project.lastDeploy}
              </span>
            )}
          </div>

          {/* sections */}
          <Section
            label="// problem"
            content={<p className="text-zinc-300 leading-relaxed">{cs.problem}</p>}
          />

          <Section
            label="// approach"
            content={
              <ul className="space-y-2">
                {cs.approach?.map((p, i) => (
                  <li key={i} className="flex gap-3 text-zinc-300 leading-relaxed">
                    <span className="text-zinc-700 font-mono select-none mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            }
          />

          <Section
            label="// decisions"
            content={
              <ul className="space-y-2">
                {cs.decisions?.map((p, i) => (
                  <li key={i} className="flex gap-3 text-zinc-300 leading-relaxed">
                    <span className="text-[var(--accent)] font-mono select-none mt-0.5">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            }
          />

          <Section
            label="// stack"
            content={
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.015] text-[11.5px] font-mono text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            }
          />

          {project.metrics && (
            <Section
              label="// metrics"
              content={
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.06] bg-black/40 p-3"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        {m.k}
                      </div>
                      <div className="mt-1 font-display text-lg text-white">
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, content }) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
      </div>
      {content}
    </div>
  );
}
