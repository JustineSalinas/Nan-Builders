/**
 * Central business + site config for Nan Builders & Construction Supply.
 * Edit contact details, credentials, and nav here — everything reads from this file.
 */

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL once the domain is live (Vercel
 * exposes VERCEL_PROJECT_PRODUCTION_URL automatically on its own deployments)
 * — sitemap.xml, robots.txt, JSON-LD, and OG tags all read from it.
 */
const resolvedUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const site = {
  name: "Nan Builders",
  legalName: "Nan Builders & Construction Supply",
  tagline: "From plans to completion, we build your vision.",
  motto: "We Supply. We Build. We Deliver.",
  description:
    "Nan Builders & Construction Supply — design-and-build construction, quality construction materials, hauling, and large-format printing in Maasin, Iloilo.",
  url: resolvedUrl,
  brandBlue: "#002CB9", // exact colour sampled from the owner's logo artwork
  registrationNo: "2RC0001174040",
  dtiNo: "3956473",
  email: "renan.nanbuilders@gmail.com",
  phone: "0967 066 8200",
  phoneRaw: "09670668200",
  phoneIntl: "+639670668200",
  whatsapp: "https://wa.me/639670668200",
  address: {
    street: "Delgado St.",
    city: "Maasin",
    province: "Iloilo",
    country: "Philippines",
    full: "Delgado St., Maasin, Iloilo, Philippines",
  },
  hours: [
    { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { day: "Saturday", time: "8:00 AM – 5:00 PM" },
    { day: "Sunday", time: "By appointment" },
  ],
  socials: {
    facebook: "", // TODO: add Facebook page URL
    instagram: "",
  },
} as const;

/** Every page, in order. Used by the footer and the mobile menu. */
export const allNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Supply", href: "/supply" },
  { label: "Printing", href: "/printing" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Desktop header nav — trimmed to six so the bar stays calm.
 * Printing, Insights and Careers are reachable from the footer, the mobile
 * menu, and (for Printing) the Services page.
 */
const headerNavHrefs = ["/", "/about", "/services", "/projects", "/supply", "/contact"];
export const mainNav = allNav.filter((item) => headerNavHrefs.includes(item.href));

export const values = [
  { title: "Quality", body: "We deliver high-quality work and materials, every project." },
  { title: "Reliability", body: "Dependable, on-time service you can count on." },
  { title: "Integrity", body: "We build with honesty and professionalism." },
] as const;

export const traits = [
  { title: "Experienced", body: "Skilled team with years on the ground." },
  { title: "Efficient", body: "On-time delivery and cost-effective solutions." },
  { title: "Trusted", body: "Committed to safety and quality." },
  { title: "Customer-Focused", body: "We listen, we plan, we build for you." },
] as const;
