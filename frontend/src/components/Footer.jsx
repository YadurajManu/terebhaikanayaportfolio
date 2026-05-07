import { PROFILE } from "../data/portfolio";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/[0.05] mt-12"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
