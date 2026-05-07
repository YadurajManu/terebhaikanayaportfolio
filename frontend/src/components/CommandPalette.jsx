import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ArrowUpRight,
  AtSign,
  Briefcase,
  Cpu,
  FolderGit2,
  Github,
  Globe2,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Phone,
  Rocket,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PROFILE, PROJECTS } from "../data/portfolio";
import { useTheme } from "../contexts/ThemeContext";

export default function CommandPalette({ open, setOpen, onOpenProject }) {
  const { toggle } = useTheme();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !open) {
        const t = e.target;
        const tag = (t?.tagName || "").toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !t?.isContentEditable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const close = () => setOpen(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    close();
  };

  const sections = [
    { id: "about", label: "about", icon: User },
    { id: "now-building", label: "now building — SubSlot", icon: Rocket },
    { id: "experience", label: "experience", icon: Briefcase },
    { id: "projects", label: "projects", icon: FolderGit2 },
    { id: "stack", label: "tech stack", icon: Layers },
    { id: "visitors", label: "visitor flag wall", icon: Globe2 },
    { id: "contact", label: "contact", icon: AtSign },
  ];

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      data-testid="command-palette"
    >
      <CommandInput
        data-testid="command-palette-input"
        placeholder="type a command or search…"
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>no matches. try `projects` or `email`.</CommandEmpty>

        <CommandGroup heading="navigate">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <CommandItem
                key={s.id}
                data-testid={`cmd-nav-${s.id}`}
                value={`navigate ${s.label} ${s.id}`}
                onSelect={() => scrollTo(s.id)}
              >
                <Icon /> <span>go to {s.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandGroup heading="projects">
          {PROJECTS.map((p) => (
            <CommandItem
              key={p.id}
              data-testid={`cmd-project-${p.id}`}
              value={`open project ${p.name} ${p.tag}`}
              onSelect={() => {
                close();
                onOpenProject?.(p);
              }}
            >
              <Cpu />
              <span>open {p.name}</span>
              <span className="ml-auto font-mono text-[10px] text-zinc-500">
                {p.tag}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="actions">
          <CommandItem
            data-testid="cmd-copy-email"
            value="copy email address"
            onSelect={async () => {
              await navigator.clipboard.writeText(PROFILE.email);
              toast.success("email copied", { description: PROFILE.email });
              close();
            }}
          >
            <Mail /> <span>copy email</span>
            <span className="ml-auto font-mono text-[10px] text-zinc-500">
              {PROFILE.email}
            </span>
          </CommandItem>
          <CommandItem
            data-testid="cmd-copy-phone"
            value="copy phone number"
            onSelect={async () => {
              await navigator.clipboard.writeText(PROFILE.phone);
              toast.success("phone copied", { description: PROFILE.phone });
              close();
            }}
          >
            <Phone /> <span>copy phone</span>
            <span className="ml-auto font-mono text-[10px] text-zinc-500">
              {PROFILE.phone}
            </span>
          </CommandItem>
          <CommandItem
            data-testid="cmd-open-github"
            value="open github profile"
            onSelect={() => {
              window.open(PROFILE.github, "_blank");
              close();
            }}
          >
            <Github /> <span>open github</span>
            <ArrowUpRight className="ml-auto" />
          </CommandItem>
          <CommandItem
            data-testid="cmd-open-linkedin"
            value="open linkedin profile"
            onSelect={() => {
              window.open(PROFILE.linkedin, "_blank");
              close();
            }}
          >
            <Linkedin /> <span>open linkedin</span>
            <ArrowUpRight className="ml-auto" />
          </CommandItem>
          <CommandItem
            data-testid="cmd-toggle-theme"
            value="toggle theme dark light"
            onSelect={() => {
              toggle();
              close();
            }}
          >
            <Moon /> <span>toggle theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
