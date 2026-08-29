"use client";

import { useEffect } from "react";
import { RotateCcw, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/lib/site";

/**
 * Last line of defence for a render that throws.
 *
 * The one thing it must do is keep the phone number on screen: whatever broke,
 * the visitor still has a job they want quoting, and a dead end costs a lead.
 * The error itself is never shown — it means nothing to a customer — but it is
 * logged so it can be found.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled render error:", error);
  }, [error]);

  return (
    <section className="relative overflow-hidden bg-brand-navy-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div className="container-x relative flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow eyebrow-on-dark">Something went wrong</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl">
          This page didn&apos;t load properly
        </h1>
        <span className="accent-rule mt-7" />
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
          Sorry — that&apos;s on us, not you. Try again, and if it keeps
          happening, call and we&apos;ll help you directly.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-ivory px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-900"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <ButtonLink href={`tel:${site.phoneRaw}`} external tone="outlineWhite" size="lg">
            <Phone className="h-4 w-4" /> {site.phone}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
