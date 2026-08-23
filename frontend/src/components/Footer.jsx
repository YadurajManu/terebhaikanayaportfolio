import { PROFILE } from "../data/portfolio";

/**
 * Plain <a> rather than react-router <Link>: these are real server-rendered
 * documents outside the SPA, so they must trigger a full navigation.
 */
const AGENT_LINKS = [
  { href: "/about", label: "about" },
  { href: "/docs", label: "api docs" },
  { href: "/contact", label: "contact" },
  { href: "/privacy", label: "privacy" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/openapi.json", label: "openapi" },
];

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/[0.05] mt-12"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-10 pb-6">
        <nav
          data-testid="footer-agent-links"
          aria-label="Documentation and machine-readable resources"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px]"
        >
          {AGENT_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-zinc-500 transition-colors hover:text-[var(--accent)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="font-mono text-[11px] text-zinc-500">
          <span className="text-[var(--accent)]">$</span> echo "© {new Date().getFullYear()} {PROFILE.name}. crafted in dehradun."
        </div>
        <div className="font-mono text-[11px] text-zinc-600">
          built with react · tailwind · self-belief
        </div>
      </div>
    </footer>
  );
}
