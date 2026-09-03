import { NOW_BUILDING } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { ArrowUpRight, Github, Sparkles, Zap } from "lucide-react";

/**
 * The card used to be one big <a target="_blank">, so any click ejected the
 * visitor off the site before they had read anything. The primary action is now
 * an overlay button that opens the case study; the external links sit above it.
 *
 * The overlay is a sibling that covers the card rather than a wrapper, because
 * putting <a> elements inside a <button> is invalid and gives screen readers and
 * touch targets a genuinely broken control.
 */
export default function NowBuilding({ onOpenProject }) {
  const open = () => onOpenProject?.(NOW_BUILDING);

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
          <div
            data-testid="now-building-card"
            className="press-feedback-card glow-border group mt-14 block relative overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-gradient-to-br from-[var(--accent)]/[0.04] via-[#0A0A0A] to-[#0A0A0A] p-8 md:p-12 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-[var(--accent)]/45 hover:shadow-[0_24px_80px_rgba(74,222,128,0.08)] focus-within:border-[var(--accent)]/45"
          >
            {/* Primary action: covers the whole card, sits under the real links. */}
            <button
              type="button"
              data-testid="now-building-open"
              onClick={open}
              aria-label={`Read the ${NOW_BUILDING.name} case study`}
              className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            />

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

              <div className="relative z-20 flex flex-wrap items-center gap-2">
                <a
                  data-testid="now-building-live"
                  href={NOW_BUILDING.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition-all duration-300 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
                >
                  {NOW_BUILDING.cta}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                {NOW_BUILDING.repo && (
                  <a
                    data-testid="now-building-repo"
                    href={NOW_BUILDING.repo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${NOW_BUILDING.name} source on GitHub`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:text-white hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
                  >
                    <Github size={14} />
                  </a>
                )}
              </div>
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
                <span>git status — {NOW_BUILDING.statusLine || NOW_BUILDING.status}</span>
                <span className="cursor-blink">_</span>
              </div>
              <span className="text-zinc-400 transition-colors duration-300 group-hover:text-[var(--accent)]">
                read case study →
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
