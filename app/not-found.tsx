import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeroMotif } from "@/components/page-hero-motif";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * A mistyped URL used to land on Next's stark default — Inter on white, no
 * header, no way back. On a site someone reached by searching for a builder,
 * that reads as broken. This is the same navy band as every other page top, so
 * a wrong turn still looks like the same company.
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <PageHeroMotif variant="plan" />
      <div className="container-x relative flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow eyebrow-on-dark">Error 404</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl">
          That page isn&apos;t on the plans
        </h1>
        <span className="accent-rule mt-7" />
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
          The link may be out of date, or the address mistyped. Everything we do
          is a click away from the home page — or call and we&apos;ll point you
          straight to it.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" tone="ivory" size="lg">
            Back to home <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={`tel:${site.phoneRaw}`} external tone="outlineWhite" size="lg">
            <Phone className="h-4 w-4" /> {site.phone}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
