import type { Metadata } from "next";
import { HardHat } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { PhotoSlot } from "@/components/photo-slot";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A portfolio of design-and-build, interior, and supply projects delivered by Nan Builders across Iloilo.",
};

// TODO: replace these seed entries with real completed projects.
// Add `image: "/projects/<file>.jpg"` once photos land in /public/projects.
const seedProjects: {
  title: string;
  tag: string;
  location: string;
  image?: string;
}[] = [
  { title: "Two-Storey Residence", tag: "Build", location: "Iloilo" },
  { title: "Interior Fit-Out", tag: "Interior", location: "Maasin" },
  { title: "Material Supply & Hauling", tag: "Supply", location: "Iloilo" },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumb="Projects"
        eyebrow="Portfolio"
        title="Complete solutions, delivered"
        description="A look at the homes, spaces, and supply jobs we've helped bring to life. Full case studies and photos are on the way."
      />

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Recent Work"
            title="Projects in progress"
            description="We're preparing a full gallery of completed builds. Here's a preview of the kind of work we take on."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {seedProjects.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.06}>
                <article className="group overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="relative">
                    <PhotoSlot
                      src={p.image}
                      alt={`${p.title} — ${p.location}`}
                      label="Photo coming soon"
                    />
                    <Badge className="absolute left-3 top-3 bg-brand-gold text-brand-navy-900 hover:bg-brand-gold">
                      {p.tag}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl font-medium text-brand-navy">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <EmptyState
              icon={HardHat}
              title="More projects coming soon"
              body="We're compiling photos and details from our recent builds. Want to see references for a specific type of project? Reach out and we'll share relevant work."
              ctaLabel="Request project references"
              ctaHref="/contact?service=Project%20references"
            />
          </div>
        </div>
      </section>

      <CtaBand
        title="Picture your project here."
        subtitle="Let's design and build something you'll be proud to show off."
      />
    </>
  );
}
