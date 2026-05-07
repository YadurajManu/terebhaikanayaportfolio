import { Copy, Github, Linkedin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { PROFILE } from "../data/portfolio";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.phone);
      toast.success("phone copied", {
        description: PROFILE.phone,
      });
    } catch {
      toast.error("could not copy");
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <SectionHeader
          index="06"
          title="get in touch"
          subtitle="// let's build something"
        />

        <div className="grid md:grid-cols-12 gap-10 mt-14">
          <div className="md:col-span-6">
            <p className="font-display text-3xl md:text-4xl tracking-tight text-white leading-[1.15]">
              Got a real product to build?
              <br />
              <span className="text-zinc-500">I'd like to hear about it.</span>
            </p>
            <p className="mt-6 text-zinc-400 leading-relaxed max-w-md">
              Open to internships at MNCs, founding-engineer roles at early-stage
              startups, and serious freelance contracts. Reach me at the email
              below — I reply within a day.
            </p>

            <a
              data-testid="contact-cta-email"
              href={`mailto:${PROFILE.email}?subject=Hello%20Yaduraj`}
              className="inline-flex items-center gap-3 mt-8 group"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black group-hover:bg-[var(--accent)] transition-colors">
                <Mail size={18} />
              </span>
              <span className="font-display text-xl md:text-2xl text-white group-hover:text-[var(--accent)] transition-colors">
                {PROFILE.email}
              </span>
            </a>
          </div>

          <div className="md:col-span-6 grid grid-cols-1 gap-3">
            <ContactRow
              testid="contact-row-phone"
              icon={<Phone size={14} />}
              label="phone"
              value={PROFILE.phone}
              action={
                <button
                  data-testid="contact-copy-phone"
                  onClick={copyPhone}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-[var(--accent)] transition-colors"
                >
                  <Copy size={12} /> copy
                </button>
              }
            />
            <ContactRow
              testid="contact-row-github"
              icon={<Github size={14} />}
              label="github"
              value="YadurajManu"
              href={PROFILE.github}
            />
            <ContactRow
              testid="contact-row-linkedin"
              icon={<Linkedin size={14} />}
              label="linkedin"
              value="yaduraj-singh"
              href={PROFILE.linkedin}
            />
            <ContactRow
              testid="contact-row-portfolio"
              icon={<span className="font-mono text-xs">↗</span>}
              label="web"
              value={PROFILE.portfolio}
              href={`https://${PROFILE.portfolio}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href, action, testid }) {
  const inner = (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0A0A0A] hover:border-white/15 transition-colors p-4">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-400">
          {icon}
        </span>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {label}
          </span>
          <span className="text-zinc-200 text-[15px]">{value}</span>
        </div>
      </div>
      {action}
    </div>
  );

  if (href) {
    return (
      <a
        data-testid={testid}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block"
      >
        {inner}
      </a>
    );
  }
  return <div data-testid={testid}>{inner}</div>;
}
