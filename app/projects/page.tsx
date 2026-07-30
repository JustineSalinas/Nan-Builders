import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { PhotoSlot } from "@/components/photo-slot";
import {
  imageFor,
  technicalProjects,
  visualizationProjects,
  type Project,
} from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Perspectives, 3D renders, BIM coordination and shop drawings delivered by Nan Builders for projects across Iloilo, the Philippines and abroad.",
};

function ProjectCard({
  project,
  fit = "cover",
  priority = false,
}: {
  project: Project;
  fit?: "cover" | "contain";
  priority?: boolean;
}) {
  const img = imageFor(project);
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-border bg-white transition-colors hover:border-brand-blue/30">
      <div className="relative">
        <PhotoSlot
          src={img.src}
          blurDataURL={img.blurDataURL}
          alt={`${project.discipline} — ${project.title}${
            project.location ? `, ${project.location}` : ""
          }`}
          fit={fit}
          priority={priority}
          zoomOnHover={fit === "cover"}
          ratio="aspect-[4/3]"
          className={fit === "contain" ? "bg-white" : undefined}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <Badge className="absolute left-3 top-3 bg-brand-navy text-white hover:bg-brand-navy">
          {project.discipline}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-medium leading-snug text-brand-navy">
          {project.title}
        </h3>
        {project.location && (
          <p className="mt-1 text-sm text-muted-foreground">{project.location}</p>
        )}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumb="Projects"
        eyebrow="Portfolio"
        title="Complete solutions, delivered"
        description="Selected design, visualization and engineering work — from homes in Iloilo to coordinated services models on high-rise projects abroad."
      />

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Design & Visualization"
            title="Seeing it before we build it"
            description="Every project starts as a perspective. These are renders and interior studies produced in-house for clients here and overseas."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visualizationProjects.map((p, i) => (
              <Reveal key={p.image} delay={(i % 3) * 0.06} scale>
                <ProjectCard project={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-stone py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="BIM & Engineering"
            title="Modelling and drawings that hold up on site"
            description="Architectural, structural and MEP modelling, clash coordination and shop-drawing packages delivered as part of wider project teams — including the Mahanakhon tower in Bangkok."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicalProjects.map((p, i) => (
              <Reveal key={p.image} delay={(i % 3) * 0.06} scale>
                <ProjectCard project={p} fit="contain" />
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <EmptyState
              icon={Camera}
              title="On-site build photography coming soon"
              body="We're compiling photos from recent builds and supply jobs. Want references for a specific type of project? Reach out and we'll share relevant work."
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
