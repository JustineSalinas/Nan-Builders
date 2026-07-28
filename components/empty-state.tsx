import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

/** Refined empty state for sections awaiting real content (projects, posts, roles). */
export function EmptyState({
  icon: Icon,
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-brand-stone/50 px-6 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h3 className="mt-6 font-heading text-2xl font-medium text-brand-navy">{title}</h3>
      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      {ctaLabel && ctaHref && (
        <div className="mt-7">
          <ButtonLink
            href={ctaHref}
            tone="outlineNavy"
            external={/^(mailto:|tel:|https?:)/.test(ctaHref)}
          >
            {ctaLabel}
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
