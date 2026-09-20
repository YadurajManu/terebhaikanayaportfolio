import { ABOUT_POINTS, PROFILE } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { Check } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionHeader
            index="04"
            title="about"
            subtitle="// what sets me apart"
          />
        </Reveal>

        <div className="grid md:grid-cols-12 gap-10 mt-14">
          <Reveal delay={80} className="md:col-span-5">
            <p className="font-display text-3xl md:text-4xl leading-[1.15] text-white tracking-tight">
              From coursework to production.{" "}
              <span className="text-zinc-500">
                I learn by building and operating software.
              </span>
            </p>
            <p className="mt-6 text-zinc-400 leading-relaxed">
              {PROFILE.education}. I study at Gautam Buddha University and build
              across web, infrastructure and embedded systems. I’m looking to
              contribute to an engineering team and learn through code reviews,
              collaboration and real product work.
            </p>
          </Reveal>

          <ul className="md:col-span-7 space-y-3">
            {ABOUT_POINTS.map((p, i) => (
              <Reveal as="li" key={i} delay={120 + i * 60}
                data-testid={`about-point-${i}`}
                className="group flex gap-4 items-start border border-white/5 bg-white/[0.015] hover:border-white/10 hover:bg-white/[0.025] transition-colors rounded-xl p-4"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-zinc-300 text-[15px] leading-relaxed">
                  {p}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
