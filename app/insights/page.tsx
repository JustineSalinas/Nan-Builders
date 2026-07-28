import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { EmptyState } from "@/components/empty-state";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Media & Insights",
  description:
    "News, building tips, and client reviews from Nan Builders & Construction Supply.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        crumb="Insights"
        eyebrow="Media & Insights"
        title="News, tips & client reviews"
        description="Practical building advice, project updates, and stories from the people we've worked with."
      />

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="From the Team"
            title="Fresh content on the way"
          />
          <div className="mt-10">
            {/* TODO: replace with a real posts grid (MDX or CMS) once articles exist. */}
            <EmptyState
              icon={Newspaper}
              title="No posts published yet"
              body="We're getting our first articles and client reviews ready — building tips, permit guides, and behind-the-scenes looks at our projects. Check back soon, or subscribe by reaching out."
              ctaLabel="Get notified"
              ctaHref={`mailto:${site.email}?subject=Notify me about Nan Builders updates`}
            />
          </div>
        </div>
      </section>

      <CtaBand
        title="Have a question about your build?"
        subtitle="We're happy to share advice — no strings attached."
      />
    </>
  );
}
