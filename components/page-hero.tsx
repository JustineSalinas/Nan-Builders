import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

/** Compact hero for interior pages: deep navy band, eyebrow, serif title, breadcrumb. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-900 text-white">
      {/* Soft brass glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="container-x relative py-20 md:py-24">
        <Reveal>
          <nav className="flex items-center gap-1.5 text-xs font-medium text-white/50">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-brand-gold-200">{crumb}</span>
          </nav>
          {eyebrow && <span className="eyebrow eyebrow-on-dark mt-6">{eyebrow}</span>}
          <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.08] text-white sm:text-5xl">
            {title}
          </h1>
          <span className="accent-rule mt-7" />
          {description && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
