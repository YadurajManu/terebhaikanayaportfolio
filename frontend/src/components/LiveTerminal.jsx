import { useEffect, useRef, useState } from "react";

const HELP = [
  ["help", "show available commands"],
  ["projects", "scroll to projects"],
  ["stack", "scroll to tech stack"],
  ["contact", "scroll to contact"],
  ["resume", "open résumé pdf"],
  ["github", "open github profile"],
  ["linkedin", "open linkedin profile"],
  ["email", "copy email to clipboard"],
  ["theme", "toggle light/dark"],
  ["clear", "clear terminal"],
  ["whoami", "print bio"],
];

const WHOAMI = [
  "yaduraj singh · 20",
  "full-stack engineer · ai/ml builder",
  "dehradun · greater noida, india",
  "// production code at twenty",
];

export default function LiveTerminal({ onTheme }) {
  const [history, setHistory] = useState([
    { type: "out", text: "// type `help` for commands" },
  ]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const exec = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const append = (lines) =>
      setHistory((h) => [...h, { type: "in", text: raw }, ...lines.map((l) => ({ type: "out", text: l }))]);

    if (!cmd) {
      setHistory((h) => [...h, { type: "in", text: "" }]);
      return;
    }
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd === "help") {
      append([
        "available commands:",
        ...HELP.map(([c, d]) => `  ${c.padEnd(10)} — ${d}`),
      ]);
    } else if (cmd === "whoami") {
      append(WHOAMI);
    } else if (cmd === "projects" || cmd === "stack" || cmd === "contact" || cmd === "about" || cmd === "experience") {
      scrollTo(cmd);
      append([`→ scrolling to ${cmd}/`]);
    } else if (cmd === "resume" || cmd === "cv") {
      // /cv is a 308 to /Resume_Web.pdf (vercel.json) — same document either way.
      window.open("/cv", "_blank");
      append(["→ opening /cv → Resume_Web.pdf"]);
    } else if (cmd === "github") {
      window.open("https://github.com/YadurajManu", "_blank");
      append(["→ opening github/YadurajManu"]);
    } else if (cmd === "linkedin") {
      window.open("https://www.linkedin.com/in/yadurajenc", "_blank");
      append(["→ opening linkedin/yadurajenc"]);
    } else if (cmd === "email") {
      navigator.clipboard?.writeText("yadurajsingham@gmail.com");
      append(["✓ yadurajsingham@gmail.com copied"]);
    } else if (cmd === "theme") {
      onTheme?.();
      append(["→ theme toggled"]);
    } else if (cmd === "ls" || cmd === "ls -la") {
      append([
        "drwxr-xr-x  hero/",
        "drwxr-xr-x  about/",
        "drwxr-xr-x  now-building/",
        "drwxr-xr-x  experience/",
        "drwxr-xr-x  projects/",
        "drwxr-xr-x  stack/",
        "drwxr-xr-x  contact/",
      ]);
    } else if (cmd === "sudo make me a sandwich") {
      append(["okay."]);
    } else {
      append([`zsh: command not found: ${cmd}. try \`help\`.`]);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    }
  };

  return (
    <div
      data-testid="live-terminal"
      onClick={() => inputRef.current?.focus()}
      className="group relative rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden cursor-text"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      {/* title bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[10px] text-zinc-500">~/yaduraj — zsh</span>
        <span className="text-[10px] text-zinc-600">{focused ? "● live" : "○ idle"}</span>
      </div>

      <div
        ref={scrollRef}
        className="px-4 py-3 max-h-[160px] min-h-[140px] overflow-y-auto text-[12.5px] leading-relaxed"
      >
        {history.map((h, i) => (
          <div key={i} className={h.type === "in" ? "text-zinc-300" : "text-zinc-400"}>
            {h.type === "in" ? (
              <>
                <span className="text-[var(--accent)]">~/yaduraj</span>
                <span className="text-zinc-600"> $ </span>
                {h.text}
              </>
            ) : (
              <span className="whitespace-pre">{h.text}</span>
            )}
          </div>
        ))}
        <div className="flex items-center text-zinc-300">
          <span className="text-[var(--accent)]">~/yaduraj</span>
          <span className="text-zinc-600"> $ </span>
          <input
            ref={inputRef}
            data-testid="live-terminal-input"
            value={input}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent outline-none border-none text-zinc-200 caret-[var(--accent)] ml-1"
          />
        </div>
      </div>
    </div>
  );
}
