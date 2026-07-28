/**
 * Services offered by Nan Builders. Icons are lucide-react names resolved in the UI.
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
    title: "Design & Build — Building Construction",
    icon: Building2,
    category: "Build",
    summary: "End-to-end construction, from groundbreaking to turnover.",
    details:
      "A single accountable team takes your project from plans to completion — structural works, finishes, and site management under one roof.",
  },
  {
    slug: "design-consultation",
    title: "Building Design Consultation",
    icon: DraftingCompass,
    category: "Design",
    summary: "Expert guidance on layout, feasibility, and budget.",
    details:
      "Sit down with our designers to shape your ideas into a buildable plan that fits your lot, lifestyle, and budget.",
  },
  {
    slug: "maintenance-repairs",
    title: "Building Maintenance & Repairs",
    icon: Wrench,
    category: "Build",
    summary: "Keep your property in top shape.",
    details:
      "Repairs, renovations, and preventive maintenance for homes and commercial buildings — done right the first time.",
  },
  {
    slug: "interior-design",
    title: "Interior Design & Construction",
    icon: Sofa,
    category: "Design",
    summary: "Interiors that are both beautiful and functional.",
    details:
      "Space planning, fit-out, and finishing that turns bare rooms into spaces you love to live and work in.",
  },
  {
    slug: "sign-and-seal",
    title: "Sign & Seal for Construction Plans",
    icon: BadgeCheck,
    category: "Permits",
    summary: "Licensed professional sign & seal services.",
    details:
      "Get your construction plans reviewed, signed, and sealed by licensed professionals ready for permit submission.",
  },
  {
    slug: "building-permit",
    title: "Building Permit Process Package",
    icon: FileCheck2,
    category: "Permits",
    summary: "We handle the paperwork end to end.",
    details:
      "Skip the queues. We prepare and process your building permit requirements so you can start building sooner.",
  },
  {
    slug: "soil-sand-gravel",
    title: "Soil, Sand & Gravel Supplies",
    icon: Mountain,
    category: "Supply",
    summary: "Reliable aggregate supply, delivered.",
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
    title: "Hollowblocks (CHB) Supply",
    icon: Box,
    category: "Supply",
    summary: "Strong, consistent CHB in bulk.",
    details:
      "Durable concrete hollow blocks supplied in the quantities your build requires, delivered on schedule.",
  },
  {
    slug: "hauling",
    title: "Hauling (Debris / Materials / Lipat Bahay)",
    icon: Truck,
    category: "Supply",
    summary: "Move materials, debris, or your whole home.",
    details:
      "Dump trucks and hauling services for construction materials, debris disposal, and lipat-bahay moves.",
  },
];
