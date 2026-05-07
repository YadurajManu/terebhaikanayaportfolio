import { EXPERIENCE } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section
      id="experience"
      data-testid="experience-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionHeader
            index="03"
            title="experience"
            subtitle="// work history"
          />
        </Reveal>

        <div className="mt-14 relative">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-zinc-800 via-zinc-900 to-transparent" />
          <div className="space-y-12">
            {EXPERIENCE.map((e, i) => (
              <Reveal
                key={i}
                delay={80 + i * 100}
                data-testid={`experience-${i}`}
                className="relative pl-10"
              >
                <span className="absolute left-0 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-black">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </span>

                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl md:text-3xl text-white tracking-tight">
                    {e.role}
                  </h3>
                  <span className="font-mono text-xs text-zinc-500">
                    {e.period}
                  </span>
                </div>
                <p className="mt-1 font-mono text-sm text-[var(--accent)]/90">
                  @ {e.org}
                </p>

                <ul className="mt-4 space-y-2">
                  {e.points.map((p, j) => (
                    <li key={j} className="flex gap-3 text-zinc-400 leading-relaxed">
                      <span className="text-zinc-700 font-mono select-none">→</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.02] text-[11px] font-mono text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
