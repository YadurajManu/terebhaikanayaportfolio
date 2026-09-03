import { useEffect, useState } from "react";
import { PROJECTS, STACK } from "../data/portfolio";

const projectCount = String(PROJECTS.length).padStart(2, "0");

const LINES = [
  { t: 60, text: "[ ok ] booting yaduraj.os v1.0.0…" },
  { t: 220, text: "[ ok ] mounting /modules/portfolio" },
  {
    t: 380,
    text: `[ ok ] loading ${projectCount} projects · ${STACK.length} stack categories`,
  },
  { t: 540, text: "[ ok ] establishing self-hosted link · TLS 1.3" },
  { t: 700, text: "[ ok ] available for select projects" },
  { t: 880, text: "$ ready." },
];

const TOTAL = 1500;

/**
 * Nobody should have to watch this twice, and some people should never have to
 * watch it at all — it is 1.5s of withheld content on a first visit. So it is
 * skippable by any key, click or scroll, and is not shown at all to anyone who
 * has asked the OS to reduce motion.
 */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BootScreen({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [printed, setPrinted] = useState([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
      try {
        sessionStorage.setItem("yr-booted", "1");
      } catch {
        /* private mode — the sequence simply replays next time */
      }
      onDone?.();
    };

    // Already booted this tab, or the visitor has asked for less motion.
    if (
      (typeof window !== "undefined" && sessionStorage.getItem("yr-booted")) ||
      prefersReducedMotion()
    ) {
      finish();
      return;
    }

    const timeouts = [];
    LINES.forEach((l, i) => {
      timeouts.push(
        setTimeout(() => setPrinted((p) => [...p, { ...l, i }]), l.t)
      );
    });

    const fadeT = setTimeout(() => setFading(true), TOTAL - 320);
    const doneT = setTimeout(finish, TOTAL);

    // Any deliberate input means "I have seen enough" — fade out and get out
    // of the way rather than making them wait for the timer.
    const skip = () => {
      setFading(true);
      timeouts.forEach(clearTimeout);
      clearTimeout(fadeT);
      clearTimeout(doneT);
      setTimeout(finish, 180);
    };

    const events = ["keydown", "pointerdown", "wheel", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, skip, { once: true, passive: true })
    );

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(fadeT);
      clearTimeout(doneT);
      events.forEach((e) => window.removeEventListener(e, skip));
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      data-testid="boot-screen"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] transition-opacity duration-300"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
    >
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 hero-spot pointer-events-none" />

      <div
        className="relative w-[min(560px,calc(100%-2rem))] font-mono text-[12.5px] text-zinc-300 leading-[1.7]"
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(74,222,128,0.7)]" />
          <span className="text-zinc-500">yaduraj.os — boot sequence</span>
        </div>
        <ul className="space-y-1">
          {printed.map((l) => (
            <li key={l.i} className="opacity-0 animate-[revealUp_240ms_ease-out_forwards]">
              {l.text.startsWith("[ ok ]") ? (
                <>
                  <span className="text-zinc-600">[</span>
                  <span className="text-[var(--accent)]"> ok </span>
                  <span className="text-zinc-600">]</span>
                  <span className="text-zinc-300">{l.text.slice(6)}</span>
                </>
              ) : l.text.startsWith("$") ? (
                <>
                  <span className="text-zinc-600">$</span>
                  <span className="text-[var(--accent)]">{l.text.slice(1)}</span>
                </>
              ) : (
                l.text
              )}
            </li>
          ))}
          {printed.length < LINES.length && (
            <li className="text-zinc-500">
              <span className="cursor-blink">_</span>
            </li>
          )}
        </ul>

        <p className="mt-6 text-[11px] text-zinc-600">
          press any key to skip
        </p>
      </div>
    </div>
  );
}
