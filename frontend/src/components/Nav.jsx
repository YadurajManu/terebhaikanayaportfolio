import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { id: "about", label: "about" },
  { id: "now-building", label: "now-building" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "stack", label: "stack" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(100%-1.5rem,820px)] transition-all duration-300`}
    >
      <div
        className={`flex items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-xl ${
          scrolled
            ? "border-white/10 bg-black/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_30px_rgba(0,0,0,0.5)]"
            : "border-white/5 bg-black/30"
        }`}
      >
        <button
          data-testid="nav-logo"
          onClick={() => handleClick("hero")}
          className="font-mono text-sm text-white hover:text-[var(--accent)] transition-colors flex items-center gap-2"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          yaduraj
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">v1</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-${l.id}`}
              onClick={() => handleClick(l.id)}
              className="font-mono text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-full transition-colors hover:bg-white/5"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-1.5 text-zinc-300 hover:text-white"
          aria-label="toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="nav-mobile-menu"
          className="md:hidden mt-2 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-2"
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-mobile-${l.id}`}
              onClick={() => handleClick(l.id)}
              className="block w-full text-left font-mono text-sm text-zinc-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5"
            >
              ./{l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
