import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { RiseText } from "@/components/rise-text";
import { PageHeroMotif, type HeroMotif } from "@/components/page-hero-motif";
import type { HeroPhoto } from "@/lib/hero-photos";

/** Compact hero for interior pages: deep navy band, eyebrow, serif title, breadcrumb. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumb,
  motif = "grid",
  photo,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumb: string;
  /** Backdrop drawing. Defaults to the blueprint grid every page used to share. */
  motif?: HeroMotif;
  /** A photograph instead of a drawing. Takes precedence over `motif`. */
  photo?: HeroPhoto;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-900 text-white">
      {/* Soft brass glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
      />
      {photo ? (
        // Same scrim as the home hero: a flat tint plus a gradient that goes
        // deepest at top and foot, where the breadcrumb and the description
        // sit. The photograph is atmosphere; the words are the message.
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          <div className="absolute inset-0 bg-brand-navy-900/58" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-900/70 via-brand-navy-900/35 to-brand-navy-900/88" />
        </div>
      ) : (
        <PageHeroMotif variant={motif} />
      )}
      <div className="container-x relative py-20 md:py-24">
        <Reveal>
          {/*
            white/50 was fine on flat navy but drops to 3.6:1 over a
            photograph, and this is 12px text. /70 clears 4.5:1 on both, so the
            breadcrumb doesn't need to know which backdrop it landed on.
          */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-brand-gold-200">{crumb}</span>
          </nav>
          {eyebrow && <span className="eyebrow eyebrow-on-dark mt-6">{eyebrow}</span>}
        </Reveal>
        {/* Outside the Reveal above so the mask rise isn't competing with a
            slide on its own parent. */}
        <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.08] text-white sm:text-5xl">
          <RiseText delay={0.1}>{title}</RiseText>
        </h1>
        <Reveal delay={0.26}>
          <span className="accent-rule mt-7" />
          {description && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
