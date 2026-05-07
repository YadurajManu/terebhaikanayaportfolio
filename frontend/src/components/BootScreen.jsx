import { useEffect, useState } from "react";

const LINES = [
  { t: 60, text: "[ ok ] booting yaduraj.os v1.0.0…" },
  { t: 220, text: "[ ok ] mounting /modules/portfolio" },
  { t: 380, text: "[ ok ] loading 08 projects · 7 stack categories" },
  { t: 540, text: "[ ok ] establishing self-hosted link · TLS 1.3" },
  { t: 700, text: "[ ok ] available for select projects" },
  { t: 880, text: "$ ready." },
];

const TOTAL = 1500;

export default function BootScreen({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [printed, setPrinted] = useState([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // skip on subsequent navigations within the same tab
    if (typeof window !== "undefined" && sessionStorage.getItem("yr-booted")) {
      setVisible(false);
      onDone?.();
      return;
    }

    const timeouts = [];
    LINES.forEach((l, i) => {
      timeouts.push(
        setTimeout(() => setPrinted((p) => [...p, { ...l, i }]), l.t)
      );
    });

    const fadeT = setTimeout(() => setFading(true), TOTAL - 320);
    const doneT = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("yr-booted", "1");
      onDone?.();
    }, TOTAL);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(fadeT);
      clearTimeout(doneT);
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
      </div>
    </div>
  );
}
