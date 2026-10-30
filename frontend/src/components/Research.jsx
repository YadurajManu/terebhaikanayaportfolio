import { ArrowUpRight, BookOpen, Check, Copy, FileText } from "lucide-react";
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const PAPER_URL = "https://ieeexplore.ieee.org/document/11469066/";
const DOI_URL = "https://doi.org/10.1109/IC3ECSBHI67834.2026.11469066";
const CITATION = "Shashwat Upadhayay, Vatsalya Bhadaurya, Yaduraj Singh, Vinayak Dwivedi, Yuvraj Singh, and Sharmishtha, \"Development of a Real-Time Multi Modal Sensor for Field Based Microplastic Detection,\" in Proceedings of the 2026 2nd International Conference on Cognitive Computing in Engineering, Communications, Sciences and Biomedical Health Informatics (IC3ECSBHI), pp. 736-741, 2026, doi: 10.1109/IC3ECSBHI67834.2026.11469066.";

export default function Research() {
  const [copied, setCopied] = useState(false);

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(CITATION);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="research"
      data-testid="research-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionHeader
            index="04"
            title="research & publications"
            subtitle="// IEEE conference paper"
          />
        </Reveal>

        <Reveal delay={100}>
          <article
            data-testid="research-paper-card"
            className="group relative mt-12 md:mt-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] transition-colors duration-300 hover:border-[var(--accent)]/30"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />

            <div className="grid md:grid-cols-12 gap-8 p-6 sm:p-8 md:gap-10 md:p-10">
              <aside className="md:col-span-3 md:border-r md:border-white/[0.06] md:pr-8">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
                  <BookOpen size={13} aria-hidden="true" />
                  <span>IEEE publication</span>
                </div>
                <p className="mt-7 font-display text-6xl leading-none tracking-tighter text-white sm:text-7xl">
                  01
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                  IEEE · 2026
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-zinc-400">
                    conference paper
                  </span>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-zinc-400">
                    co-author · 3rd
                  </span>
                </div>
              </aside>

              <div className="md:col-span-9">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  IC3ECSBHI 2026 <span className="px-1.5 text-zinc-700">/</span> environmental sensing
                </p>
                <h3 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[2.65rem]">
                  Development of a Real-Time Multi Modal Sensor for Field Based Microplastic Detection
                </h3>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
                  Co-authored research on a real-time, multimodal sensor for field-based microplastic detection, combining sensing, environmental monitoring, and applied computing.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.06] pt-5 font-mono text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    Yaduraj Singh, third author
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FileText size={13} aria-hidden="true" />
                    pp. 736–741
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    Role: third co-author · Research area: field-based microplastic sensing
                  </span>
                </div>

                <div className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    data-testid="research-paper-link"
                    href={PAPER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-medium text-[13px] text-black transition-colors hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                  >
                    Read on IEEE Xplore
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>

                  <details className="w-full sm:w-auto">
                    <summary className="w-fit cursor-pointer list-none rounded-md font-mono text-xs text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A] [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-2">
                        Citation details
                        <span aria-hidden="true" className="text-[var(--accent)]">+</span>
                      </span>
                    </summary>
                    <div className="mt-4 max-w-xl rounded-xl border border-white/[0.06] bg-black/30 p-4 sm:absolute sm:right-10 sm:z-10 sm:mt-3 sm:max-w-md">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        2026 2nd International Conference on Cognitive Computing in Engineering, Communications, Sciences and Biomedical Health Informatics (IC3ECSBHI)
                      </p>
                      <a
                        href={DOI_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block break-all font-mono text-xs text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        doi:10.1109/IC3ECSBHI67834.2026.11469066
                      </a>
                      <button
                        type="button"
                        onClick={copyCitation}
                        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.1] px-3 font-mono text-xs text-zinc-300 transition-colors hover:border-[var(--accent)]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                        {copied ? "Citation copied" : "Copy citation"}
                      </button>
                      <span className="sr-only" aria-live="polite">
                        {copied ? "Citation copied to clipboard" : ""}
                      </span>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
