export default function SectionHeader({ index, title, subtitle }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
        <span className="text-[var(--accent)]">{index}</span>
        <span className="h-px w-8 bg-zinc-800" />
        <span>{subtitle}</span>
      </div>
      <h2 className="font-display text-4xl md:text-5xl tracking-tighter font-medium text-white">
        {title}
        <span className="text-[var(--accent)]">.</span>
      </h2>
    </div>
  );
}
