"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Fixed call / quote bar for phones.
 *
 * Most visitors to a contractor's site arrive on a phone and the win is a call,
 * so the two actions that matter shouldn't require scrolling back to the hero.
 *
 * It stays hidden until the hero is out of view: at the top of the page the
 * same two buttons are already on screen, and covering them with a copy of
 * themselves is noise. Desktop never sees it — the header carries the number
 * and the quote button there.
 */

/** Roughly the fold. Past this, the hero's own buttons are gone. */
const SHOW_AFTER_PX = 480;

export function MobileCallBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    function onScroll() {
      // Coalesce to one read per frame; a scroll handler that touches layout on
      // every event is the classic way to lose 60fps on a mid-range phone.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
        frame = 0;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-navy-900/95 backdrop-blur md:hidden",
          "flex items-center gap-2 px-3 py-3",
          "transition-transform duration-300 ease-out",
          visible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <a
          href={`tel:${site.phoneRaw}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/25 text-sm font-semibold text-white transition-colors active:bg-white/10"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <Link
          href="/contact"
          className="inline-flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-lg bg-brand-ivory text-sm font-semibold text-brand-navy transition-colors active:bg-white"
        >
          Get a Quote <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {/*
        Sits at the end of the document so the bar never covers the last of the
        footer. Only as tall as the bar, and only on the screens that get one.
      */}
      <div aria-hidden className="h-[68px] md:hidden" />
    </>
  );
}
