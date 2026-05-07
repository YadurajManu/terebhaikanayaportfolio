import { ArrowDownRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { PROFILE } from "../data/portfolio";

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute inset-0 hero-spot pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pt-32 pb-24">
        {/* Status pill */}
        <div className="reveal flex items-center gap-3 font-mono text-xs text-zinc-400 mb-10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="text-zinc-300">available for select projects</span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} /> {PROFILE.location}
          </span>
        </div>

        {/* Terminal whoami */}
        <div
          className="reveal font-mono text-sm text-zinc-500 mb-6"
          style={{ animationDelay: "60ms" }}
        >
          <span className="text-[var(--accent)]">~/yaduraj</span>
          <span className="text-zinc-600"> $ </span>
          <span className="text-zinc-300">whoami</span>
        </div>

        {/* Name */}
        <h1
          data-testid="hero-name"
          className="reveal font-display text-[14vw] sm:text-[10vw] md:text-[88px] lg:text-[112px] leading-[0.92] font-medium text-white"
          style={{ animationDelay: "120ms" }}
        >
          Yaduraj
          <br />
          <span className="text-zinc-500">Singh.</span>
        </h1>

        {/* Tagline */}
        <p
          data-testid="hero-tagline"
          className="reveal mt-8 max-w-2xl text-base md:text-lg text-zinc-400 leading-relaxed"
          style={{ animationDelay: "200ms" }}
        >
          {PROFILE.role}, 20.{" "}
          <span className="text-zinc-200">{PROFILE.tagline}</span>
        </p>

        {/* Meta row */}
        <div
          className="reveal mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "260ms" }}
        >
          <button
            data-testid="hero-cta-work"
            onClick={() => scrollTo("projects")}
            className="group inline-flex items-center gap-2 bg-white text-black h-11 px-5 rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            view work
            <ArrowDownRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </button>

          <button
            data-testid="hero-cta-resume"
            onClick={() => {
              // placeholder — will wire up when PDF uploaded
              window.alert(
                "Resume PDF coming soon. Email yadurajsingham@gmail.com for the latest copy."
              );
            }}
            className="inline-flex items-center gap-2 bg-transparent text-zinc-300 border border-white/15 h-11 px-5 rounded-full font-mono text-sm hover:text-white hover:border-white/30 transition-colors"
          >
            download resume
          </button>

          <a
            data-testid="hero-cta-email"
            href={`mailto:${PROFILE.email}`}
            className="inline-flex items-center gap-2 bg-transparent text-zinc-400 h-11 px-3 font-mono text-sm hover:text-white transition-colors"
          >
            <Mail size={14} /> {PROFILE.email}
          </a>
        </div>

        {/* Socials */}
        <div
          className="reveal mt-14 flex items-center gap-5 font-mono text-xs text-zinc-500"
          style={{ animationDelay: "320ms" }}
        >
          <a
            data-testid="hero-link-github"
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <Github size={14} /> github/YadurajManu
          </a>
          <a
            data-testid="hero-link-linkedin"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <Linkedin size={14} /> yaduraj-singh
          </a>
          <a
            data-testid="hero-link-portfolio"
            href={`https://${PROFILE.portfolio}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline hover:text-white transition-colors"
          >
            ↗ {PROFILE.portfolio}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-0 right-0 z-10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          <span>// scroll</span>
          <span className="hidden sm:inline">production code at twenty</span>
          <span>v1.0.0 · {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}
