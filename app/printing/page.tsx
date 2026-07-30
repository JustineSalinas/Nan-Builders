import type { Metadata } from "next";
import { Printer, ShieldCheck, Clock, ThumbsUp, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { printingPrices, printingPillars } from "@/lib/pricing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Printing Services",
  description:
    "Large-format printing in Maasin, Iloilo: A0 CAD plots, blueprint copies, scanning, PDF conversion, and lamination. See the full Nan Builders price list.",
};

const pillarIcons = [ShieldCheck, Clock, ThumbsUp];

export default function PrintingPage() {
  return (
    <>
      <PageHero
        crumb="Printing"
        eyebrow="Printing Services"
        title="We print. We build. We deliver."
        description="Professional large-format printing for architects, engineers, and builders — crisp CAD plots, blueprint copies, scanning, and lamination."
      />

      {/* Pillars */}
      <section className="border-b border-border bg-white py-12">
        <div className="container-x grid gap-6 sm:grid-cols-3">
          {printingPillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <Reveal key={p.title} delay={i * 0.08} className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-medium text-brand-navy">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Price list */}
      <section className="bg-brand-stone py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Price List"
            title="Printing services & rates"
            description="Prices are per sheet or per file unless noted. Bulk and project rates available on request."
          />

          <Reveal className="mt-10 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-left">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="px-6 py-5 font-sans text-xs font-semibold uppercase tracking-[0.16em]">
                      <span className="inline-flex items-center gap-2">
                        <Printer className="h-4 w-4 text-brand-gold-200" /> Printing Service
                      </span>
                    </th>
                    <th className="px-6 py-5 text-right font-sans text-xs font-semibold uppercase tracking-[0.16em]">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {printingPrices.map((row, i) => (
                    <tr
                      key={row.service}
                      className={i % 2 === 0 ? "bg-white" : "bg-brand-stone/70"}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.service}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-heading text-xl font-medium text-brand-navy">
                          {row.price}
                        </span>
                        {row.note && (
                          <span className="ml-1 text-xs text-muted-foreground">/ {row.note}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href={`mailto:${site.email}?subject=Printing inquiry`}
              external
              tone="navy"
            >
              <Mail className="h-4 w-4" /> Email your files
            </ButtonLink>
            <ButtonLink href="/contact" tone="outlineNavy">
              Send a printing inquiry
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need a rush print job?"
        subtitle="Message us your files and paper size — we'll confirm turnaround and total."
      />
    </>
  );
}
