import { useEffect } from "react";
import { connectToasts } from "../lib/notify";
import { Toaster, toast } from "sonner";
import { useTheme } from "../contexts/ThemeContext";

export default function ToastHost() {
  const { theme } = useTheme();
  useEffect(() => connectToasts(toast), []);
  return <Toaster theme={theme} position="bottom-right" toastOptions={{ style: {
    background: "var(--surface)", border: "1px solid var(--border)",
    color: "var(--text)", fontFamily: "JetBrains Mono, monospace",
  } }} />;
}
