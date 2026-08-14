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
  /**
   * Reach is deliberately split. Materials, hauling and printing are physical
   * and local; design, visualization and BIM are not, and have shipped to
   * clients in Negros, Saudi Arabia and Thailand. Copy should never imply we
   * haul sand overseas, or that the design arm stops at the provincial line.
   */
  description:
    "Nan Builders & Construction Supply — design-and-build construction, materials, hauling and large-format printing based in Maasin, Iloilo, with design, 3D visualization and BIM delivered for clients nationwide and overseas.",
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

/**
 * Every page, in order. Used by the footer and the mobile menu, and it's the
 * order the header nav inherits.
 *
 * Ordered by what a visitor needs, not by what we want to say: what we do, then
 * proof we've done it, then the supply and printing lines, and only then who we
 * are. About is a trust page people reach for once they're already interested —
 * it earns its keep late, not in the second slot.
 */
export const allNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Supply", href: "/supply" },
  { label: "Printing", href: "/printing" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Desktop header nav — four items, deliberately.
 *
 * Home and Contact are dropped rather than lost. The logo is the Home link, and
 * the bar already carries the phone number and a Get a Quote button pointing at
 * /contact — a text link would be the third route to the same page in one bar,
 * and the quieter of the three.
 *
 * Supply keeps its slot even though it looks like a service: materials, hauling
 * and delivery are a separate business line from contracting, and the
 * highest-intent local searches ("hollowblocks", "sand and gravel delivery")
 * want that page rather than a section partway down Services.
 *
 * Nothing here is the only way to reach a page. The footer lists all of allNav,
 * and so does the mobile menu.
 */
const headerNavHrefs = ["/services", "/projects", "/supply", "/about"];
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
