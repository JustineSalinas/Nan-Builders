import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { EmptyState } from "@/components/empty-state";
import { ProjectGallery, type GalleryItem } from "@/components/project-gallery";
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

/**
 * Flatten a project into something the client gallery can take. The image
 * lookup stays here, on the server, so the whole manifest isn't shipped to the
 * browser just to render eleven cards.
 */
function toGalleryItems(projects: Project[], fit: "cover" | "contain"): GalleryItem[] {
  return projects.map((project) => {
    const image = imageFor(project);
    return {
      id: project.image,
      title: project.title,
      location: project.location,
      discipline: project.discipline,
      src: image.src,
      width: image.width,
      height: image.height,
      blurDataURL: image.blurDataURL,
      fit,
    };
  });
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        motif="plan"
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

          <ProjectGallery items={toGalleryItems(visualizationProjects, "cover")} />
        </div>
      </section>

      <section className="bg-brand-stone py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="BIM & Engineering"
            title="Modelling and drawings that hold up on site"
            description="Architectural, structural and MEP modelling, clash coordination and shop-drawing packages delivered as part of wider project teams — including the Mahanakhon tower in Bangkok."
          />

          <ProjectGallery items={toGalleryItems(technicalProjects, "contain")} />

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
