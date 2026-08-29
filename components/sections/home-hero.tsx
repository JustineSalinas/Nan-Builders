import Link from "next/link";
import Image from "next/image";
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
      <div className="container-x relative py-20 md:py-24">
        {/*
          Split hero: type on solid navy, picture in its own frame.

          Laying a photograph behind the headline meant burying it under a scrim
          heavy enough for white text, which turns any image into a dark smudge.
          Giving the render a panel of its own means it can be shown at full
          brightness — and the copy needs no scrim at all, because nothing is
          behind it.
        */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-gold-200">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {/*
                Keep this as plain text. The badge is an inline-flex row that
                never wraps, so wrapping any of these words in an element makes it
                a flex item of its own and pushes the badge off the side of a
                phone screen; as text it stays one wrappable item and breaks after
                the comma.
              */}
              {`Projects from ${site.address.province}, ${site.address.country} to international`}
            </span>

            <h1 className="mt-8 text-balance text-4xl font-medium leading-[1.06] tracking-[-0.02em] sm:text-5xl lg:text-[3.6rem]">
              Building today for a{" "}
              <span className="italic text-brand-gold-200">stronger tomorrow</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-300">
              From plans to completion, we build your vision — design-and-build
              construction, dependable material supply, hauling, and large-format
              printing from our base in Maasin, Iloilo, with design and 3D
              visualization work delivered for clients here and overseas.
            </p>

            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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

          {/*
            Our own work, uncropped by any headline. The caption is deliberate:
            this is a perspective we drew, not a photograph of a finished
            building, and the site says so everywhere else too.
          */}
          <div className="relative">
            {/*
              Panel shape follows the source. A 4:5 box cropped a 16:9 render so
              hard that the height, not the width, decided how many pixels were
              needed — and `sizes` describes width, so Next served a 750px file
              for a box that needed 1080 and it came out upscaled 1.66x. At 5:4
              the crop is gentle, and `sizes` is set to the width cover actually
              consumes rather than the width of the box.
            */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 lg:aspect-[5/4]">
              <Image
                src="/hero/csa-complex-panel.webp"
                alt="Exterior perspective of the CSA Complex, drawn in-house"
                fill
                priority
                quality={90}
                sizes="(min-width: 1024px) 66vw, 100vw"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQAAkABUB8JQBOgBwlvtsAAMyhJmfy4QQvbqFxLYo0F3PFD/wQsBJLzs/brSq/xrG+GmyS30AAAA=="
                className="object-cover object-center"
              />
              {/* Just enough gradient at the foot to carry the caption. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-navy-900/85 to-transparent"
              />
              <p className="absolute bottom-4 left-5 right-5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/75">
                CSA Complex · Exterior perspective
              </p>
            </div>
          </div>
        </div>

        {/* Lines of business, full width beneath both columns */}
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
