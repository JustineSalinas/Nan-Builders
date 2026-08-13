import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get a free quote from Nan Builders & Construction Supply. Call 0967 066 8200, message us on WhatsApp, or send an inquiry online.",
};

// Keyless Google Maps embed — no API key or billing account needed.
// Deliberately queries the ADDRESS, not the business name: name searches
// fuzzy-match unrelated firms (e.g. "Nan construction inc." over in Jaro).
// Swap this for a Place-ID embed once the Google Business Profile is verified.
const mapQuery = encodeURIComponent(site.address.full);
const mapEmbedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service = "" } = await searchParams;

  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Contact Us"
        title="Let's build your vision together"
        description="Tell us about your project and get a free, no-obligation quote. We usually respond within one business day."
      />

      <section className="bg-white py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Details */}
          <div>
            <Reveal>
              <h2 className="font-heading text-[1.6rem] font-medium text-brand-navy">
                Get in touch
              </h2>
              <p className="mt-3 text-muted-foreground">
                Prefer to talk it through? Reach us directly — we&apos;re happy to help.
              </p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {[
                { icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phoneRaw}` },
                { icon: MessageCircle, label: "WhatsApp", value: "Message us", href: site.whatsapp, external: true },
                { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal key={c.label} delay={i * 0.06}>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 rounded-xl border border-border bg-brand-stone p-4 transition-colors hover:border-brand-blue/40 hover:bg-white"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {c.label}
                        </span>
                        <span className="block font-medium text-brand-navy">{c.value}</span>
                      </span>
                    </a>
                  </Reveal>
                );
              })}

              <Reveal delay={0.2}>
                <div className="flex items-start gap-4 rounded-xl border border-border bg-brand-stone p-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Visit us
                    </span>
                    <span className="block font-medium text-brand-navy">{site.address.full}</span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="rounded-xl border border-border bg-brand-stone p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Clock className="h-4 w-4" /> Business hours
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {site.hours.map((h) => (
                      <li key={h.day} className="flex justify-between">
                        <span>{h.day}</span>
                        <span className="font-medium text-foreground">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-[1.6rem] font-medium text-brand-navy">
                Request a quote
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in the form and we&apos;ll get back to you shortly.
              </p>
              <div className="mt-6">
                <ContactForm defaultService={service} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Location */}
      {/*
        Padded top and bottom. With pb only, the card's top edge landed exactly
        on the seam where the white section above meets the stone band, so the
        rounded corners had nothing to sit against and the map read as though it
        had slipped out of the layout.
      */}
      <section className="bg-brand-stone py-16">
        <div className="container-x">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <iframe
              title={`Map of ${site.legalName}, ${site.address.full}`}
              src={mapEmbedSrc}
              className="block h-[22rem] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-brand-navy">
                <MapPin className="h-4 w-4 shrink-0 text-brand-blue" />
                {site.address.full}
              </p>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline self-start text-sm font-medium text-brand-blue sm:self-auto"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
