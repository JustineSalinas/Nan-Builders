/**
 * Services offered by Nan Builders. Icons are lucide-react names resolved in the UI.
 *
 * Titles are kept to two or three words so they set cleanly as card headings and
 * in the footer. Anything that used to trail the title — the parenthetical, the
 * em-dash qualifier — belongs in `summary`, which is the one-line pitch; `details`
 * is the longer paragraph.
 */
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  DraftingCompass,
  Wrench,
  Sofa,
  BadgeCheck,
  FileCheck2,
  Mountain,
  ShoppingCart,
  Box,
  Truck,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  details: string;
  category: "Design" | "Build" | "Permits" | "Supply";
};

export const services: Service[] = [
  {
    slug: "design-and-build",
    title: "Design & Build",
    icon: Building2,
    category: "Build",
    summary: "End-to-end building construction, groundbreaking to turnover.",
    details:
      "A single accountable team takes your project from plans to completion — structural works, finishes, and site management under one roof.",
  },
  {
    slug: "design-consultation",
    title: "Design Consultation",
    icon: DraftingCompass,
    category: "Design",
    summary: "Expert guidance on layout, feasibility, and budget.",
    details:
      "Sit down with our designers to shape your ideas into a buildable plan that fits your lot, lifestyle, and budget.",
  },
  {
    slug: "maintenance-repairs",
    title: "Maintenance & Repairs",
    icon: Wrench,
    category: "Build",
    summary: "Keep your property in top shape.",
    details:
      "Repairs, renovations, and preventive maintenance for homes and commercial buildings — done right the first time.",
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    icon: Sofa,
    category: "Design",
    summary: "Interior design and fit-out, beautiful and functional.",
    details:
      "Space planning, fit-out, and finishing that turns bare rooms into spaces you love to live and work in.",
  },
  {
    slug: "sign-and-seal",
    title: "Sign & Seal",
    icon: BadgeCheck,
    category: "Permits",
    summary: "Licensed sign and seal for your construction plans.",
    details:
      "Get your construction plans reviewed, signed, and sealed by licensed professionals ready for permit submission.",
  },
  {
    slug: "building-permit",
    title: "Building Permits",
    icon: FileCheck2,
    category: "Permits",
    summary: "The full building permit package, handled for you.",
    details:
      "Skip the queues. We prepare and process your building permit requirements so you can start building sooner.",
  },
  {
    slug: "soil-sand-gravel",
    title: "Soil, Sand & Gravel",
    icon: Mountain,
    category: "Supply",
    summary: "Reliable aggregate supply, delivered to your site.",
    details:
      "Quality soil, sand, and gravel supplied and delivered to your site in the volumes your project needs.",
  },
  {
    slug: "construction-supplies",
    title: "Construction Supplies",
    icon: ShoppingCart,
    category: "Supply",
    summary: "Cement, steel, and the essentials.",
    details:
      "A dependable source for cement, rebar, pipes, and everyday construction materials at fair prices.",
  },
  {
    slug: "hollowblocks",
    title: "Hollowblocks (CHB)",
    icon: Box,
    category: "Supply",
    summary: "Strong, consistent CHB in bulk.",
    details:
      "Durable concrete hollow blocks supplied in the quantities your build requires, delivered on schedule.",
  },
  {
    slug: "hauling",
    title: "Hauling & Lipat Bahay",
    icon: Truck,
    category: "Supply",
    summary: "Debris, materials, or your whole home — moved.",
    details:
      "Dump trucks and hauling services for construction materials, debris disposal, and lipat-bahay moves.",
  },
];
