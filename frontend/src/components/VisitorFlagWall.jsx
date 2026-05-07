import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const FALLBACK_API_BASE_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000"
    : "";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || FALLBACK_API_BASE_URL;

function countryCodeToFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🏳";
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="h-8 w-16 rounded bg-white/[0.08]" />
      <div className="mt-4 h-4 w-24 rounded bg-white/[0.06]" />
      <div className="mt-2 h-3 w-16 rounded bg-white/[0.05]" />
    </div>
  );
}

export default function VisitorFlagWall() {
  const [state, setState] = useState({
    loading: true,
    configured: false,
    countries: [],
    windowDays: 30,
    minVisitors: 3,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadVisitors() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/visitor-countries`);
        const payload = await response.json();
        if (cancelled) return;

        setState({
          loading: false,
          configured: !!payload.configured,
          countries: payload.countries || [],
          windowDays: payload.window_days || 30,
          minVisitors: payload.min_visitors || 3,
        });
      } catch {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          loading: false,
          configured: false,
          countries: [],
        }));
      }
    }

    loadVisitors();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasCountries = state.countries.length > 0;

  return (
    <section
      id="visitors"
      data-testid="visitor-flag-wall"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionHeader
            index="06"
            title="reading from"
            subtitle="// anonymous recent visitor footprint"
          />
        </Reveal>

        <div className="grid md:grid-cols-12 gap-10 mt-14">
          <Reveal delay={80} className="md:col-span-4">
            <p className="font-display text-3xl md:text-4xl tracking-tight text-white leading-[1.15]">
              A quiet wall of flags.
              <br />
              <span className="text-zinc-500">Real readers, no creep tracking.</span>
            </p>
            <p className="mt-6 max-w-md text-zinc-400 leading-relaxed">
              Aggregated country-level traffic from Plausible over the last{" "}
              <span className="text-zinc-200">{state.windowDays} days</span>.
              Countries with fewer than{" "}
              <span className="text-zinc-200">{state.minVisitors}</span>{" "}
              visitors stay hidden.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
              <Globe2 size={14} />
              anonymous by design
            </div>
          </Reveal>

          <div className="md:col-span-8">
            <Reveal delay={140}>
              <div className="rounded-3xl border border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-md p-5 md:p-6">
                {state.loading && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <LoadingCard key={index} />
                    ))}
                  </div>
                )}

                {!state.loading && hasCountries && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {state.countries.map((country) => (
                      <div
                        key={country.country}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.035]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-3xl leading-none">
                            {countryCodeToFlag(country.country)}
                          </span>
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                            {country.country}
                          </span>
                        </div>
                        <div className="mt-4 font-display text-2xl text-white">
                          {country.visitors}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-zinc-500">
                          {country.share}% of recent readers
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!state.loading && !hasCountries && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-8 text-center">
                    <p className="font-display text-2xl text-white">
                      {state.configured ? "warming up the map" : "connect Plausible to light this up"}
                    </p>
                    <p className="mt-3 max-w-lg mx-auto text-zinc-400 leading-relaxed">
                      {state.configured
                        ? `No country has crossed the ${state.minVisitors}-visitor threshold yet in the current ${state.windowDays}-day window.`
                        : "Add PLAUSIBLE_API_KEY on the backend and traffic will start filling this wall automatically."}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
