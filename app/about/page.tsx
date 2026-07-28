import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Target,
  Heart,
  Award,
  Gauge,
  ShieldCheck,
  Users,
  Phone,
  Mail,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/reveal";
import { values, traits, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nan Builders & Construction Supply is a Maasin, Iloilo firm delivering design-and-build construction, materials, and printing with quality, reliability, and integrity.",
};

/** One icon per trait — repeating a single icon four times reads as filler. */
const traitIcons: Record<string, LucideIcon> = {
  Experienced: Award,
  Efficient: Gauge,
  Trusted: ShieldCheck,
  "Customer-Focused": Users,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        eyebrow="About Us"
        title="Building your vision, from plans to completion"
        description="Nan Builders & Construction Supply brings design, construction, materials, and printing together under one trusted, locally rooted team."
      />

      {/* Story + mission */}
      <section className="bg-white py-16">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            eyebrow="Who We Are"
            title="A complete construction partner in Iloilo"
            description="Based on Delgado St. in Maasin, Iloilo, we serve homeowners, contractors, and businesses who want one dependable partner for the whole journey — designing the plan, building the structure, supplying the materials, and even printing the blueprints."
          />
          <Reveal delay={0.1} className="space-y-6">
            <div className="rounded-xl border border-border bg-brand-stone p-6">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-brand-gold" />
                <h3 className="font-heading text-xl font-medium text-brand-navy">
                  Our Mission
                </h3>
              </div>
              <p className="mt-3 text-muted-foreground">
                Building today for a stronger tomorrow — delivering quality work and
                materials that stand the test of time, on schedule and on budget.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-brand-stone p-6">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-brand-gold" />
                <h3 className="font-heading text-xl font-medium text-brand-navy">
                  Our Promise
                </h3>
              </div>
              <p className="mt-3 text-muted-foreground">
                From plans to completion, we build your vision — listening first,
                planning carefully, and treating every project as if it were our own.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core values — numbered, hairline-divided, no card soup */}
      <section className="bg-brand-stone py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Principles"
            title="Core values"
            description="Three standards govern how we quote, how we build, and how we answer the phone."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="h-full">
                <div className="h-full bg-white p-8">
                  <span className="font-heading text-sm font-medium tracking-[0.18em] text-brand-gold-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-heading text-2xl font-medium text-brand-navy">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How those values show up on site */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="In Practice"
            title="What that means on your project"
          />
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {traits.map((t, i) => {
              const Icon = traitIcons[t.title];
              return (
                <Reveal key={t.title} delay={i * 0.05}>
                  <div className="border-t border-border pt-6">
                    <Icon className="h-5 w-5 text-brand-blue" />
                    <h3 className="mt-4 font-heading text-lg font-medium text-brand-navy">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company registration + principal office */}
      <section className="bg-brand-stone py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-xl border border-brand-navy bg-brand-navy p-8 text-white sm:p-10">
              <span className="eyebrow eyebrow-on-dark">Company Registration</span>
              <h2 className="mt-5 font-heading text-[1.6rem] font-medium text-white">
                Registered and accredited
              </h2>
              <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Registered name
                  </dt>
                  <dd className="text-right text-sm text-white">{site.legalName}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Registration No.
                  </dt>
                  <dd className="text-right font-heading text-lg font-medium text-brand-gold-200">
                    {site.registrationNo}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    DTI No.
                  </dt>
                  <dd className="text-right font-heading text-lg font-medium text-brand-gold-200">
                    {site.dtiNo}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Principal office
                  </dt>
                  <dd className="text-right text-sm text-white">
                    {site.address.city}, {site.address.province}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-slate-400">
                Copies of our registration and DTI certificates are available on
                request for tendering and permit requirements.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-border bg-white p-8 sm:p-10">
              <span className="eyebrow">Principal Office</span>
              <h2 className="mt-5 font-heading text-[1.6rem] font-medium text-brand-navy">
                Office and business hours
              </h2>

              <address className="mt-8 flex items-start gap-3 not-italic">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.province}
                  <br />
                  {site.address.country}
                </span>
              </address>

              <dl className="mt-8 divide-y divide-border border-y border-border">
                {site.hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between gap-6 py-3"
                  >
                    <dt className="text-sm font-medium text-brand-navy">{h.day}</dt>
                    <dd className="text-sm text-muted-foreground">{h.time}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-sm text-brand-navy transition-colors hover:text-brand-blue"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-blue" />
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 break-all text-sm text-brand-navy transition-colors hover:text-brand-blue"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-blue" />
                  {site.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
