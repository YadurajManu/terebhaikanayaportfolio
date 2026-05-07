import { useEffect } from "react";

const RESUME_PATH = "/Resume_Web.pdf";

export default function CVRedirect() {
  useEffect(() => {
    window.location.replace(RESUME_PATH);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-zinc-400">
          opening resume...
        </p>
        <a
          href={RESUME_PATH}
          className="mt-4 inline-flex items-center rounded-full border border-white/15 px-5 py-2 font-mono text-sm text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
        >
          open PDF
        </a>
      </div>
    </div>
  );
}
