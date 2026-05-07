import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function ScrambleText({
  text,
  duration = 700,
  delay = 0,
  className = "",
  as: Tag = "span",
  testId,
}) {
  const [output, setOutput] = useState(text);
  const rafRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now() + delay;
    const len = text.length;

    const tick = (now) => {
      if (cancelled) return;
      const elapsed = now - start;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const settledIdx = Math.floor(progress * len);

      let next = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (i < settledIdx || ch === " " || ch === "\n") {
          next += ch;
        } else {
          next += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setOutput(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setOutput(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, duration, delay]);

  return (
    <Tag data-testid={testId} className={className}>
      {output}
    </Tag>
  );
}
