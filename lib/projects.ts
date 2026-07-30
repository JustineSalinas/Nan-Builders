/**
 * Portfolio drawn from the owner's company profile document.
 *
 * Framing matters here: most of these are *design, visualization and drafting*
 * scopes delivered by the RTech design arm — not structures Nan Builders built
 * end to end. Copy stays on "perspective", "model" and "drawing" so the page
 * never implies we were the main contractor on, say, the Bangkok tower.
 */
import { projectImages, type ProjectImageKey } from "./project-images.generated";

export type ProjectGroup = "visualization" | "technical";

export type Project = {
  image: ProjectImageKey;
  title: string;
  /** Blank where the source document didn't name a location. */
  location: string;
  /** Short badge — the scope we delivered. */
  discipline: string;
  group: ProjectGroup;
};

export const projects: Project[] = [
  {
    image: "bungalow-himamaylan",
    title: "One-storey residence",
    location: "Himamaylan City",
    discipline: "Exterior perspective",
    group: "visualization",
  },
  {
    image: "two-storey-residence-iloilo",
    title: "Two-storey residence",
    location: "Iloilo City",
    discipline: "Exterior perspective",
    group: "visualization",
  },
  {
    image: "townhouse-residence-iloilo",
    title: "Multi-level residence",
    location: "Iloilo City",
    discipline: "Exterior perspective",
    group: "visualization",
  },
  {
    image: "zatazza-cafe-jaro",
    title: "Zatazza Café",
    location: "Robinsons Jaro, Iloilo City",
    discipline: "Interior fit-out",
    group: "visualization",
  },
  {
    image: "bedroom-interior-iloilo",
    title: "Master bedroom",
    location: "Iloilo City",
    discipline: "Interior perspective",
    group: "visualization",
  },
  {
    image: "grand-lobby-interior",
    title: "Reception and stair hall",
    location: "Saudi Arabia",
    discipline: "Interior perspective",
    group: "visualization",
  },
  {
    image: "formal-living-interior",
    title: "Formal living room",
    location: "Saudi Arabia",
    discipline: "Interior perspective",
    group: "visualization",
  },
  {
    image: "service-station-canopy",
    title: "Service station canopy",
    location: "Saudi Arabia",
    discipline: "3D render",
    group: "visualization",
  },
  {
    image: "service-station-forecourt",
    title: "Service station forecourt",
    location: "Saudi Arabia",
    discipline: "3D render",
    group: "visualization",
  },
  {
    image: "mep-combined-services",
    title: "MEP combined services model",
    location: "",
    discipline: "BIM coordination",
    group: "technical",
  },
  {
    image: "mep-services-coordination",
    title: "Services clash coordination",
    location: "",
    discipline: "BIM coordination",
    group: "technical",
  },
  {
    image: "structural-services-level41",
    title: "Structure and services, Level 41",
    location: "",
    discipline: "BIM coordination",
    group: "technical",
  },
  {
    image: "mahanakhon-bangkok",
    title: "Mahanakhon project",
    location: "Bangkok, Thailand",
    discipline: "Modelling and drafting",
    group: "technical",
  },
  {
    image: "structural-model-residence",
    title: "Architectural and structural model",
    location: "",
    discipline: "Revit model",
    group: "technical",
  },
  {
    image: "joinery-detail-elevation",
    title: "Joinery and furniture details",
    location: "",
    discipline: "Shop drawings",
    group: "technical",
  },
];

/** Resolve a project to its optimized asset (src, intrinsic size, blur data). */
export function imageFor(project: Project) {
  return projectImages[project.image];
}

export const visualizationProjects = projects.filter(
  (p) => p.group === "visualization"
);
export const technicalProjects = projects.filter((p) => p.group === "technical");

/** The three renders that lead the home page. */
export const featuredProjects = [
  projects.find((p) => p.image === "bungalow-himamaylan")!,
  projects.find((p) => p.image === "zatazza-cafe-jaro")!,
  projects.find((p) => p.image === "grand-lobby-interior")!,
];
