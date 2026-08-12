import Link from "next/link";
import { Phone, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/lib/site";

/** The four lines of business, doubling as the hero's primary navigation. */
const pillars = [
  {
    title: "Design & Build",
    body: "End-to-end construction, from groundbreaking to turnover.",
    href: "/services",
  },
  {
    title: "Construction Supply",
    body: "Cement, hollowblocks, steel, sand and gravel.",
    href: "/supply",
  },
  {
    title: "Hauling & Delivery",
    body: "Materials, debris and lipat-bahay moves.",
    href: "/supply",
  },
  {
    title: "Large-Format Printing",
    body: "Plans, tarpaulins and signage up to A0.",
    href: "/printing",
  },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-900 text-white">
      <div className="container-x relative py-24 text-center md:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-gold-200">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {site.address.province}, {site.address.country} · International
          </span>

          <h1 className="mt-8 text-balance text-5xl font-medium leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-[4.25rem]">
            Building today for a{" "}
            <span className="italic text-brand-gold-200">stronger tomorrow</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
            From plans to completion, we build your vision — design-and-build
            construction, dependable material supply, hauling, and large-format
            printing from our base in Maasin, Iloilo, with design and 3D
            visualization work delivered for clients here and overseas.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/contact" tone="ivory" size="lg" className="w-full sm:w-auto">
              Get a Free Quote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink
              href={`tel:${site.phoneRaw}`}
              external
              tone="outlineWhite"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Phone className="h-4 w-4" /> {site.phone}
            </ButtonLink>
          </div>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.28em] text-white/60">
            We supply · We build · We deliver
          </p>
        </div>

        {/* Lines of business, full width beneath the centred column */}
        <nav
          aria-label="What we do"
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group bg-brand-navy-900/40 p-7 text-left transition-colors duration-300 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold"
            >
              {/* Reserve two lines so descriptions align across all four cards */}
              <span className="flex items-baseline justify-between gap-3 sm:min-h-[3.25rem]">
                <span className="font-heading text-lg font-medium leading-snug text-white">
                  {p.title}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 translate-y-1 text-brand-gold-200 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-slate-400">
                {p.body}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
