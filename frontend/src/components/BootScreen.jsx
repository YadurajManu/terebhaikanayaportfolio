import { useLayoutEffect, useRef } from "react";
import "./BootScreen.css";
export function shouldPlayIntro() {
  if (typeof window === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  try { return !sessionStorage.getItem("yr-booted"); } catch { return true; }
}
export default function BootScreen({ onDone }) {
  const done = useRef(onDone);
  done.current = onDone;
  const root = useRef(null);
  useLayoutEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem("yr-booted", "1"); } catch { /* Storage may be unavailable. */ }
      done.current?.();
    };
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) { finish(); return; }
    const mobile = window.matchMedia('(max-width: 600px)').matches;
    const duration = mobile ? 500 : 750;
    const delay = mobile ? 450 : 650;
    const target = document.querySelector('[data-testid="hero-name"]');
    let clone;
    const animations = [];
    if (target && root.current) {
      const rect = target.getBoundingClientRect();
      const computed = getComputedStyle(target);
      clone = target.cloneNode(true);
      clone.removeAttribute('data-testid');
      clone.setAttribute('aria-hidden', 'true');
      Object.assign(clone.style, { position: 'fixed', margin: '0', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, font: computed.font, letterSpacing: computed.letterSpacing, opacity: '1', visibility: 'visible', transformOrigin: 'top left', animation: 'none' });
      root.current.appendChild(clone);
      const scale = mobile ? 1.1 : 1.25;
      const x = (window.innerWidth - rect.width * scale) / 2 - rect.left;
      const y = (window.innerHeight - rect.height * scale) / 2 - rect.top;
      animations.push(clone.animate([{ opacity: 0, transform: `translate(${x}px,${y + 20}px) scale(${scale})` }, { opacity: 1, transform: `translate(${x}px,${y}px) scale(${scale})` }], { duration: 250, delay: delay - 200, fill: 'both' }));
      animations.push(clone.animate([{ transform: `translate(${x}px,${y}px) scale(${scale})` }, { transform: 'translate(0,0) scale(1)' }], { duration, delay, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }));
      animations.push(root.current.animate([{ backgroundColor: computed.getPropertyValue('--bg') }, { backgroundColor: 'transparent' }], { duration, delay, fill: 'forwards' }));
    }
    const timer = setTimeout(finish, delay + duration);
    const events = ["keydown", "click", "wheel", "touchstart", "resize"];
    events.forEach(event => window.addEventListener(event, finish, { passive: true }));
    media?.addEventListener?.("change", finish);
    return () => {
      clearTimeout(timer);
      animations.forEach(animation => animation.cancel());
      clone?.remove();
      events.forEach(event => window.removeEventListener(event, finish));
      media?.removeEventListener?.("change", finish);
    };
  }, []);
  return <div ref={root} className="signature-intro" data-testid="boot-screen" aria-label="Yaduraj Singh introduction">
    <div className="signature-grid" aria-hidden="true" />
    <div className="signature-stage" aria-hidden="true">
      <span className="signature-caption">HARDWARE · SOFTWARE · INTELLIGENCE</span>
      <svg className="signature-circuit" viewBox="0 0 600 160" fill="none">
        <path className="signature-wire" pathLength="1" d="M220 25L255 65L290 25M255 65V135M385 30H325V75H380V130H320" />
        <path className="signature-pulse" pathLength="1" d="M0 80H170L195 55L220 25L255 65V135H300L320 130H380V75H325V30H385L420 65H600" />
      </svg>

    </div>
    <button className="signature-skip">Skip intro ↗</button>
  </div>;
}
