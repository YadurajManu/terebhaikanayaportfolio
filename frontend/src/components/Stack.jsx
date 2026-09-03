import { STACK } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

/**
 * Path-style label for a group name. Collapses every run of non-alphanumerics
 * to a single hyphen — the previous version only collapsed whitespace, so a
 * group called "AI / ML" rendered as `/ai-/-ml` and read as noise.
 */
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Stack() {
  return (
    <section
      id="stack"
      data-testid="stack-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionHeader
            index="05"
            title="tech stack"
            subtitle="// daily drivers"
          />
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {STACK.map((g, i) => (
            <Reveal key={g.group} delay={60 + i * 70} data-testid={`stack-group-${i}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  /{slug(g.group)}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it}
                    data-testid={`stack-item-${slug(it)}`}
                    className="group cursor-default px-3 py-1.5 rounded-md border border-white/[0.08] bg-white/[0.01] text-[12.5px] font-mono text-zinc-300 hover:text-white hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.04] transition-colors"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
