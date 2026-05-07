import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientAudio() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const stop = () => {
    nodesRef.current.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {}
    });
    nodesRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  };

  const start = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    // master gain — soft
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2);
    master.connect(ctx.destination);

    // low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;
    filter.connect(master);

    // pad chord — D minor (D, F, A, C)
    const freqs = [146.83, 174.61, 220.0, 261.63];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      const og = ctx.createGain();
      og.gain.value = 0.18;
      o.connect(og);
      og.connect(filter);
      o.start();
      return [o, og];
    });

    // gentle LFO on filter cutoff for movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    nodesRef.current = [...oscs.flat(), lfo, lfoGain, filter, master];
  };

  const toggle = () => {
    if (on) {
      stop();
      setOn(false);
    } else {
      start();
      setOn(true);
    }
  };

  useEffect(() => () => stop(), []);

  return (
    <button
      data-testid="ambient-audio-toggle"
      onClick={toggle}
      title={on ? "mute ambient" : "play ambient"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
      aria-label="toggle ambient audio"
    >
      {on ? <Volume2 size={14} /> : <VolumeX size={14} />}
    </button>
  );
}
