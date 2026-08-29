"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { pauseSmoothScroll, resumeSmoothScroll } from "@/lib/smooth-scroll";

/**
 * The portfolio grid, with a lightbox.
 *
 * The cards used to be inert `<article>`s: a visitor met a 400px-wide render of
 * a hotel lobby and had no way to see it bigger, which is the one thing a
 * portfolio page exists for. Each card is now a button that opens the full
 * image, and once open, arrow keys walk the set — nobody wants to close and
 * reopen a dialog eleven times.
 */

export type GalleryItem = {
  id: string;
  title: string;
  location: string;
  discipline: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  /** Drawings must not be cropped; photographs and renders may be. */
  fit: "cover" | "contain";
};

export function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  /**
   * Return focus to the card that opened the dialog, rather than dumping the
   * keyboard at the top of the document.
   *
   * This has to happen in an effect, after the close has committed. Doing it
   * inside the state updater looks tidier and doesn't work: updaters are
   * expected to be pure, React may run them more than once, and the focus call
   * lands before the DOM has caught up.
   */
  const lastOpened = useRef<number | null>(null);
  useEffect(() => {
    if (openIndex !== null) {
      lastOpened.current = openIndex;
      return;
    }
    if (lastOpened.current !== null) {
      cardRefs.current[lastOpened.current]?.focus();
      lastOpened.current = null;
    }
  }, [openIndex]);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + items.length) % items.length
      ),
    [items.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKeyDown);

    // The page behind must not scroll while the dialog is over it. Momentum
    // scrolling ignores overflow:hidden, so it has to be stopped as well.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pauseSmoothScroll();
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      resumeSmoothScroll();
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={(index % 3) * 0.06} scale>
            <button
              type="button"
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              onClick={() => setOpenIndex(index)}
              aria-haspopup="dialog"
              className="group block h-full w-full overflow-hidden rounded-2xl border border-border bg-white text-left transition-colors hover:border-brand-blue/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-navy-900">
                <Image
                  src={item.src}
                  alt={`${item.discipline} — ${item.title}${
                    item.location ? `, ${item.location}` : ""
                  }`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  placeholder="blur"
                  blurDataURL={item.blurDataURL}
                  className={cn(
                    item.fit === "contain" ? "object-contain" : "object-cover",
                    item.fit === "cover" &&
                      "transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  )}
                />
                <Badge className="absolute left-3 top-3 bg-brand-navy text-white hover:bg-brand-navy">
                  {item.discipline}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-medium leading-snug text-brand-navy">
                  {item.title}
                </h3>
                {item.location && (
                  <p className="mt-1 text-sm text-muted-foreground">{item.location}</p>
                )}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} — enlarged`}
          className="fixed inset-0 z-[60] flex flex-col bg-brand-navy-900/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 text-white">
            <div>
              <p className="font-heading text-lg font-medium">{active.title}</p>
              <p className="mt-0.5 text-sm text-slate-400">
                {active.discipline}
                {active.location ? ` · ${active.location}` : ""}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Stop clicks on the image itself from closing the dialog. */}
          <div
            className="mt-4 flex min-h-0 flex-1 items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {/*
              Never shown larger than the file actually is.
              Twelve of these came out of the company-profile document at around
              573px wide. Stretched to fill a 1400px viewport they turn to mush,
              and a soft image shown large reads as broken where the same image
              shown at its own size reads as small. The cap comes off by itself
              as better exports replace them.
            */}
            <Image
              key={active.src}
              src={active.src}
              alt={`${active.discipline} — ${active.title}`}
              width={active.width}
              height={active.height}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={active.blurDataURL}
              className="h-auto max-h-full w-auto max-w-full object-contain"
              style={{ maxWidth: active.width, maxHeight: active.height }}
            />
          </div>

          <div
            className="mt-4 flex shrink-0 items-center justify-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous project</span>
            </button>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              {openIndex! + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next project</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
