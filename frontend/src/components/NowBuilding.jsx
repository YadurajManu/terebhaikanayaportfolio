import { NOW_BUILDING } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

export default function NowBuilding() {
  return (
    <section
      id="now-building"
      data-testid="now-building-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionHeader
            index="02"
            title="now building"
            subtitle="// in active development"
          />
        </Reveal>

        <Reveal delay={120}>
          <a
            data-testid="now-building-card"
            href={NOW_BUILDING.url}
            target="_blank"
            rel="noreferrer"
            className="press-feedback-card glow-border group mt-14 block relative overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-gradient-to-br from-[var(--accent)]/[0.04] via-[#0A0A0A] to-[#0A0A0A] p-8 md:p-12 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-[var(--accent)]/45 hover:shadow-[0_24px_80px_rgba(74,222,128,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/55 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-[18%] w-[36%] bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.18),transparent_68%)] blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-95 pointer-events-none" />
          <div className="absolute inset-y-8 left-[28%] w-px bg-gradient-to-b from-transparent via-[var(--accent)]/14 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

          <div className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            {NOW_BUILDING.status}
          </div>

          <div className="relative mt-6 flex flex-wrap items-start justify-between gap-5">
            <div>
              <h3 className="font-display text-5xl md:text-7xl tracking-tighter font-medium text-white">
                {NOW_BUILDING.name}
              </h3>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                {NOW_BUILDING.url.replace(/^https?:\/\//, "")}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition-all duration-300 group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/[0.08] group-hover:text-white">
              {NOW_BUILDING.cta}
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>

          <p className="relative mt-4 max-w-2xl text-lg text-zinc-300 leading-relaxed">
            {NOW_BUILDING.pitch}
          </p>

          <div className="relative mt-10 grid sm:grid-cols-3 gap-4">
            {NOW_BUILDING.bullets.map((b, i) => (
              <div
                key={i}
                data-testid={`now-building-bullet-${i}`}
                className="flex gap-3 items-start rounded-xl border border-white/5 bg-black/30 p-4 transition-colors duration-300 group-hover:border-white/10 group-hover:bg-black/35"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/10 text-[var(--accent)]">
                  {i === 0 ? <Sparkles size={13} /> : <Zap size={13} />}
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="text-zinc-600">$</span>
              <span>git status — private beta · llm cost control</span>
              <span className="cursor-blink">_</span>
            </div>
            <div className="inline-flex items-center gap-2 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
              tap to open preview
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>
        </a>
        </Reveal>
      </div>
    </section>
  );
}
