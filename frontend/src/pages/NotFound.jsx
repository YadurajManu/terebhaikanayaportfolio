import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 hero-spot pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        <div
          className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-[10px] text-zinc-500">~/yaduraj/404 — zsh</span>
            <span className="text-[10px] text-zinc-600">○ idle</span>
          </div>

          <div className="px-5 py-6 text-[13px] text-zinc-300 leading-relaxed">
            <p>
              <span className="text-[var(--accent)]">~/yaduraj</span>
              <span className="text-zinc-600"> $ </span>
              <span className="text-zinc-200">cat {window.location.pathname || "/unknown"}</span>
            </p>
            <p className="mt-1 text-zinc-400">
              cat: {window.location.pathname || "/unknown"}: No such file or directory
            </p>

            <p className="mt-4">
              <span className="text-[var(--accent)]">~/yaduraj</span>
              <span className="text-zinc-600"> $ </span>
              <span className="text-zinc-200">echo "did i lose you in the routing?"</span>
            </p>
            <p className="mt-1 text-zinc-400">did i lose you in the routing?</p>

            <p className="mt-4">
              <span className="text-[var(--accent)]">~/yaduraj</span>
              <span className="text-zinc-600"> $ </span>
              <span className="text-zinc-200">ls -la /</span>
            </p>
            <ul className="mt-1 text-zinc-500 space-y-0.5">
              <li>drwxr-xr-x  hero/</li>
              <li>drwxr-xr-x  about/</li>
              <li>drwxr-xr-x  projects/</li>
              <li>drwxr-xr-x  contact/</li>
            </ul>

            <p className="mt-4">
              <span className="text-[var(--accent)]">~/yaduraj</span>
              <span className="text-zinc-600"> $ </span>
              <span className="cursor-blink">_</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Link
            data-testid="404-home-link"
            to="/"
            className="inline-flex items-center gap-2 bg-white text-black h-10 px-5 rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft size={14} /> back to home
          </Link>
          <span className="font-mono text-[11px] text-zinc-500">
            // error 404 · file not found
          </span>
        </div>
      </div>
    </div>
  );
}
