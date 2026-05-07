import { STATS } from "../data/portfolio";

export default function Stats() {
  return (
    <section data-testid="stats-strip" className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-md p-5 md:p-7 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
          {STATS.map((s, i) => (
            <div
              key={i}
              data-testid={`stat-${i}`}
              className="flex flex-col items-start gap-1 relative md:px-2"
            >
              {i > 0 && (
                <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-px bg-white/[0.06]" />
              )}
              <span
                className="font-display text-3xl md:text-4xl tracking-tighter font-medium text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
