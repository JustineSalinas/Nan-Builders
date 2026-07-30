import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "ivory" | "gold" | "navy" | "outlineNavy" | "outlineWhite";
type Size = "md" | "lg";

const tones: Record<Tone, string> = {
  // Signature CTA on light canvas — the exact logo blue.
  blue: "bg-brand-blue text-white hover:bg-brand-blue-500 shadow-sm shadow-brand-blue/25",
  // Primary CTA on the deep navy bands. The logo blue is too close to the navy
  // to carry a solid fill there, so the crisp light panel does the work.
  ivory:
    "bg-brand-ivory text-brand-navy-900 hover:bg-white shadow-sm shadow-black/20",
  // Champagne. Kept for the odd accent CTA — at this size it leans brown, so
  // prefer `ivory` on dark bands and `blue` on light ones.
  gold: "bg-brand-gold text-brand-navy-900 hover:bg-brand-gold-600 shadow-sm shadow-brand-gold/20",
  navy: "bg-brand-navy text-white hover:bg-brand-navy-800",
  outlineNavy:
    "border border-brand-navy/25 text-brand-navy hover:border-brand-navy hover:bg-brand-navy hover:text-white",
  outlineWhite:
    "border border-white/25 text-white hover:bg-white hover:text-brand-navy-900",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[0.72rem]",
  lg: "h-12 px-8 text-[0.78rem]",
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-sans font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

/** A Next.js Link (or plain anchor) styled as a premium brand button. */
export function ButtonLink({
  href,
  tone = "blue",
  size = "md",
  external = false,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  tone?: Tone;
  size?: Size;
  external?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const cls = cn(base, tones[tone], sizes[size], className);
  if (external) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
