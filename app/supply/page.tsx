import type { Metadata } from "next";
import { Truck, PackageCheck, Ruler, PhilippinePeso } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { supplyCatalog } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Construction Supply",
  description:
    "Cement, sand, gravel, hollowblocks (CHB), steel, and pipes supplied and delivered across Iloilo. Plus hauling for materials, debris, and lipat-bahay.",
};

const perks = [
  { icon: PackageCheck, title: "Quality materials", body: "Sourced from trusted brands and suppliers." },
  { icon: Truck, title: "Delivered to site", body: "Dump trucks and hauling on your schedule." },
  { icon: PhilippinePeso, title: "Fair pricing", body: "Competitive rates for bulk and project volumes." },
  { icon: Ruler, title: "Right quantities", body: "We help you estimate what your build needs." },
];

export default function SupplyPage() {
  return (
    <>
      <PageHero
        crumb="Supply"
        eyebrow="Construction Supply"
        title="We supply. We deliver."
        description="A dependable single source for the materials your project runs on — quoted, stocked, and delivered where you need them."
      />

      {/* Perks */}
      <section className="border-b border-border bg-white py-12">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06} className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-medium text-brand-navy">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Catalog */}
      <section className="bg-brand-stone py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Carry"
            title="Materials & aggregates"
            description="Available by the bag, load, or truckload. Pricing is quote-based so you only pay for what your project needs — message us for current rates."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supplyCatalog.map((item, i) => (
              <Reveal key={item.name} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-6">
                  <h3 className="font-heading text-xl font-medium text-brand-navy">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          {/* TODO: add real product photos and any fixed price lists when available */}
        </div>
      </section>

      {/* Hauling callout */}
      <section className="bg-white py-16">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-8 rounded-2xl bg-brand-navy p-8 text-white md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-12">
              <div>
                <span className="eyebrow eyebrow-on-dark">Hauling & Delivery</span>
                <h2 className="mt-4 text-[1.7rem] font-medium text-white sm:text-3xl">
                  Materials, debris, or lipat-bahay
                </h2>
                <p className="mt-3 max-w-xl text-slate-300">
                  Our trucks move construction materials to your site, haul debris away
                  after the job, and handle home moves across Iloilo.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <ButtonLink href="/contact?service=Hauling" tone="ivory">
                  Request hauling
                </ButtonLink>
                <ButtonLink href="/contact?service=Construction%20Supply" tone="outlineWhite">
                  Get a supply quote
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need materials on site fast?"
        subtitle="Send us your list and delivery address for a same-day quote."
      />
    </>
  );
}
