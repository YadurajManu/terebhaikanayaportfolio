import { NOW_BUILDING } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { Sparkles, Zap } from "lucide-react";

export default function NowBuilding() {
  return (
    <section
      id="now-building"
      data-testid="now-building-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <SectionHeader
          index="02"
          title="now building"
          subtitle="// in active development"
        />

        <div
          data-testid="now-building-card"
          className="glow-border mt-14 relative overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-gradient-to-br from-[var(--accent)]/[0.04] via-[#0A0A0A] to-[#0A0A0A] p-8 md:p-12"
        >
          {/* corner accent */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            {NOW_BUILDING.status}
          </div>

          <h3 className="relative mt-6 font-display text-5xl md:text-7xl tracking-tighter font-medium text-white">
            {NOW_BUILDING.name}
          </h3>

          <p className="relative mt-4 max-w-2xl text-lg text-zinc-300 leading-relaxed">
            {NOW_BUILDING.pitch}
          </p>

          <div className="relative mt-10 grid sm:grid-cols-3 gap-4">
            {NOW_BUILDING.bullets.map((b, i) => (
              <div
                key={i}
                data-testid={`now-building-bullet-${i}`}
                className="flex gap-3 items-start rounded-xl border border-white/5 bg-black/30 p-4"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/10 text-[var(--accent)]">
                  {i === 0 ? <Sparkles size={13} /> : <Zap size={13} />}
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-10 flex items-center gap-3 font-mono text-xs text-zinc-500">
            <span className="text-zinc-600">$</span>
            <span>git status — feature branch · alpha tests Q1</span>
            <span className="cursor-blink">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
