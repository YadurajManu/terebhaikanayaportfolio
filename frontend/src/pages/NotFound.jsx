import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Game404 from "../components/Game404";
import ThemeToggle from "../components/ThemeToggle";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // full-bleed game — nothing on this page should scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[var(--bg)]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="hero-spot pointer-events-none absolute inset-0" />

      <Game404 onExit={() => navigate("/")} />

      {/* minimal chrome — the escape hatch stays reachable at all times */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5">
        <Link
          data-testid="404-logo"
          to="/"
          className="pointer-events-auto flex items-center gap-2 font-mono text-sm text-[var(--text)] transition-colors hover:text-[var(--accent)]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          yaduraj
          <span className="hidden text-zinc-600 sm:inline">/</span>
          <span className="hidden text-zinc-500 sm:inline">404</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          <span className="hidden font-mono text-[11px] text-zinc-600 md:inline">
            {location.pathname}
          </span>
          <ThemeToggle />
          <Link
            data-testid="404-home-link"
            to="/"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-4 font-mono text-[12px] text-zinc-400 transition-colors hover:border-white/20 hover:text-[var(--text)]"
          >
            <ArrowLeft size={13} /> back to home
          </Link>
        </div>
      </header>
    </div>
  );
}
