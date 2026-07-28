import type { Metadata } from "next";
import { Users, HeartHandshake, TrendingUp, Briefcase } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { CareersForm } from "@/components/careers-form";

export const metadata: Metadata = {
  title: "Work With Us",
  description:
    "Join the Nan Builders team. We're always looking for skilled, reliable people who take pride in quality construction work.",
};

const perks = [
  { icon: HeartHandshake, title: "A team that values you", body: "Honesty, respect, and professionalism on every site." },
  { icon: TrendingUp, title: "Grow your skills", body: "Learn across design, build, supply, and printing." },
  { icon: Briefcase, title: "Steady, quality work", body: "Be part of projects built to last." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumb="Careers"
        eyebrow="Work With Us"
        title="Build your career with Nan Builders"
        description="We're always on the lookout for skilled, dependable people who take pride in doing things right."
      />

      {/* Culture */}
      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Join Us"
            title="Work you can be proud of"
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-brand-stone p-8 text-center">
                    <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy text-white">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 font-heading text-xl font-medium text-brand-navy">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Openings + application */}
      <section className="bg-brand-stone py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Open Roles" title="Current openings" />
            <div className="mt-8">
              {/* TODO: replace with real open positions when hiring. */}
              <EmptyState
                icon={Users}
                title="No listed openings right now"
                body="We don't have a specific role posted at the moment, but we're always glad to hear from great people. Send an open application and we'll keep you in mind."
              />
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-[1.6rem] font-medium text-brand-navy">
                Send an application
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us who you are and what you do — we review every submission.
              </p>
              <div className="mt-6">
                <CareersForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
