import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      data-testid="theme-toggle"
      onClick={toggle}
      title={theme === "dark" ? "switch to light" : "switch to dark"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
      aria-label="toggle theme"
    >
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
