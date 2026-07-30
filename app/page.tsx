import Link from "next/link";
import {
  CheckCircle2,
  Hammer,
  Printer,
  Truck,
  ArrowRight,
  Quote,
} from "lucide-react";
import { HomeHero } from "@/components/sections/home-hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { PhotoSlot } from "@/components/photo-slot";
import { featuredProjects, imageFor } from "@/lib/projects";
import { values, traits, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Value strip */}
      <section className="border-b border-border bg-white">
        <div className="container-x grid gap-6 py-10 sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand-blue" />
              <div>
                <h3 className="font-heading text-lg font-medium text-brand-navy">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-brand-stone py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Services"
            title="Complete solutions for your construction needs"
            description="Design, build, supply, and printing — Nan Builders brings every part of your project together so nothing falls through the cracks."
          />
          <div className="mt-12">
            <ServiceGrid />
          </div>
          <div className="mt-10">
            <ButtonLink href="/services" tone="outlineNavy">
              See all services <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Selected Work"
            title="Seeing it before we build it"
            description="Every project begins as a perspective. Here's a look at recent design and visualization work."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => {
              const img = imageFor(p);
              return (
                <Reveal key={p.image} delay={i * 0.08} scale>
                  <Link
                    href="/projects"
                    className="group block overflow-hidden rounded-2xl border border-border bg-white transition-colors hover:border-brand-blue/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    <PhotoSlot
                      src={img.src}
                      blurDataURL={img.blurDataURL}
                      alt={`${p.discipline} — ${p.title}, ${p.location}`}
                      ratio="aspect-[4/3]"
                      zoomOnHover
                    />
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-medium text-brand-navy">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.location}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10">
            <ButtonLink href="/projects" tone="outlineNavy">
              View the portfolio <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-brand-navy py-20 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Why Nan Builders"
            title="A team you can build on"
            description="We combine skilled people, dependable supply, and honest project management — so your build stays on time, on budget, and on standard."
            onDark
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {traits.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.06}>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="font-heading text-xl font-medium text-brand-gold-200">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {t.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-promo: Build / Supply / Print */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Three ways we help"
            title="We build. We supply. We print."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Hammer,
                title: "Construction",
                body: "Full design-and-build, renovations, permits, and professional sign & seal.",
                href: "/services",
                cta: "Explore services",
              },
              {
                icon: Truck,
                title: "Construction Supply",
                body: "Cement, sand, gravel, hollowblocks, steel, and hauling — delivered to site.",
                href: "/supply",
                cta: "View supply",
              },
              {
                icon: Printer,
                title: "Printing Services",
                body: "A0 CAD plots, blueprint copies, scanning, PDF conversion, and lamination.",
                href: "/printing",
                cta: "See price list",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-brand-stone p-8">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy text-white">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 font-heading text-xl font-medium text-brand-navy">
                      {c.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {c.body}
                    </p>
                    <Link
                      href={c.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-navy"
                    >
                      {c.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial placeholder */}
      <section className="bg-brand-stone py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Client Voices"
            title="Trusted by homeowners and builders"
            align="center"
          />
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <figure className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <Quote className="mx-auto h-8 w-8 text-brand-blue" />
              {/* TODO: replace with real client testimonials */}
              <blockquote className="mt-4 text-lg font-medium text-foreground">
                Client reviews will appear here soon. Have you worked with us?
                We&apos;d love to feature your story.
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <a
                  href={`mailto:${site.email}?subject=My Nan Builders review`}
                  className="font-semibold text-brand-blue underline-offset-4 hover:underline"
                >
                  Share your experience
                </a>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
