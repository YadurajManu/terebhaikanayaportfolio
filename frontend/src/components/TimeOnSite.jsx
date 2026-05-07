import { useEffect, useRef, useState } from "react";

export default function TimeOnSite() {
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(Math.floor((performance.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <span
      data-testid="time-on-site"
      className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 tabular-nums"
      title="time on site"
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]/70" />
      {mm}:{ss}
    </span>
  );
}
