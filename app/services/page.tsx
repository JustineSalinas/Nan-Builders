import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { heroPhotos } from "@/lib/hero-photos";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/reveal";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Design-and-build construction, design consultation, permits, interior design, material supply, and hauling — the full range of Nan Builders services.",
};

/**
 * Ordered to follow a project's actual sequence: design it, permit it, build it,
 * supply it. The four groups share one canvas rather than alternating bands —
 * four full-width colour changes on one page read as clutter, and white cards on
 * a white band lose their edges entirely.
 */
const groups = ["Design", "Permits", "Build", "Supply"] as const;
const groupCopy: Record<(typeof groups)[number], string> = {
  Design: "Plan and visualize before a single block is laid.",
  Permits: "Clear the paperwork and professional requirements.",
  Build: "Turn approved plans into finished, quality structures.",
  Supply: "Materials and hauling delivered to your site.",
};

/**
 * Supply is also its own top-level page, so the group points there rather than
 * dead-ending at the contact form — otherwise a visitor meets the same business
 * line twice with no signal which page is authoritative.
 */
const groupLink: Partial<
  Record<(typeof groups)[number], { href: string; label: string }>
> = {
  Supply: { href: "/supply", label: "Browse materials & pricing" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        photo={heroPhotos.services}
        crumb="Services"
        eyebrow="What We Do"
        title="Complete solutions for your construction needs"
        description="From the first sketch to final turnover — plus the materials, permits, and hauling in between — Nan Builders covers every stage of your project."
      />

      <section className="bg-brand-stone py-16 sm:py-20">
        <div className="container-x space-y-14 sm:space-y-16">
          {groups.map((group) => {
            const items = services.filter((s) => s.category === group);
            const link = groupLink[group];
            return (
              <div key={group}>
                {/* Group label and its promise sit on one line, separated by a
                    hairline — lighter than a full section heading, and it keeps
                    the four groups reading as one list. */}
                <div className="flex flex-col gap-1.5 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <h2 className="font-heading text-2xl font-medium text-brand-navy">
                    {group}
                  </h2>
                  <div className="sm:text-right">
                    <p className="text-sm text-muted-foreground">
                      {groupCopy[group]}
                    </p>
                    {link && (
                      <Link
                        href={link.href}
                        className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {items.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <Reveal key={s.slug} delay={(i % 2) * 0.06}>
                        {/* Anchor target for the footer's per-service links. */}
                        <Link
                          id={s.slug}
                          href={`/contact?service=${encodeURIComponent(s.title)}`}
                          className="group flex h-full scroll-mt-28 gap-5 rounded-xl border border-border bg-white p-6 transition-colors hover:border-brand-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                        >
                          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy transition-colors group-hover:bg-brand-navy group-hover:text-white">
                            <Icon className="h-6 w-6" strokeWidth={1.5} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="flex items-center gap-1.5 font-heading text-xl font-medium leading-snug text-brand-navy">
                              {s.title}
                              <ArrowUpRight className="h-4 w-4 shrink-0 text-transparent transition-colors group-hover:text-brand-blue" />
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {s.details}
                            </p>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Not sure where to start?"
        subtitle="Tell us your goal and we'll recommend the right mix of services."
      />
    </>
  );
}
