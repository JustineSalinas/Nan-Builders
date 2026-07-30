import { Phone, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Let's build your vision together.",
  subtitle = "Tell us about your project and get a free, no-obligation quote.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div className="container-x relative flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <Reveal>
          <span className="eyebrow eyebrow-on-dark">Start your project</span>
          <h2 className="mt-4 max-w-xl text-3xl font-medium leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-slate-300">{subtitle}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" tone="ivory" size="lg">
            Get a Free Quote
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href={`tel:${site.phoneRaw}`} external tone="outlineWhite" size="lg">
            <Phone className="h-4 w-4" /> {site.phone}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
