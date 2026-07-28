import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Design-and-build construction, design consultation, permits, interior design, material supply, and hauling — the full range of Nan Builders services.",
};

const groups = ["Design", "Build", "Permits", "Supply"] as const;
const groupCopy: Record<(typeof groups)[number], string> = {
  Design: "Plan and visualize before a single block is laid.",
  Build: "Turn approved plans into finished, quality structures.",
  Permits: "Clear the paperwork and professional requirements.",
  Supply: "Materials and hauling delivered to your site.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        eyebrow="What We Do"
        title="Complete solutions for your construction needs"
        description="From the first sketch to final turnover — plus the materials, permits, and hauling in between — Nan Builders covers every stage of your project."
      />

      {groups.map((group, gi) => {
        const items = services.filter((s) => s.category === group);
        return (
          <section
            key={group}
            className={gi % 2 === 0 ? "bg-white py-16" : "bg-brand-stone py-16"}
          >
            <div className="container-x">
              <SectionHeading
                eyebrow={group}
                title={groupCopy[group]}
                className="!max-w-3xl"
              />
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {items.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Reveal key={s.slug} delay={(i % 2) * 0.06}>
                      <div className="flex h-full gap-5 rounded-xl border border-border bg-white p-6">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="font-heading text-xl font-medium leading-snug text-brand-navy">
                            {s.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {s.details}
                          </p>
                          <ButtonLink
                            href={`/contact?service=${encodeURIComponent(s.title)}`}
                            tone="outlineNavy"
                            size="md"
                            className="mt-4 h-9 px-4 text-xs"
                          >
                            Request this service <ArrowRight className="h-3.5 w-3.5" />
                          </ButtonLink>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand
        title="Not sure where to start?"
        subtitle="Tell us your goal and we'll recommend the right mix of services."
      />
    </>
  );
}
