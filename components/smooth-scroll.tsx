"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Momentum scrolling.
 *
 * The wheel no longer jumps the page a fixed number of pixels; it feeds a value
 * that eases toward its target each frame, which is what reads as "smooth".
 * Three deliberate limits keep it from becoming the kind of scroll-hijacking
 * that people hate:
 *
 *   - Off entirely under prefers-reduced-motion. Eased scrolling is exactly the
 *     vestibular trigger that setting exists for.
 *   - Touch is left alone. Phones already have momentum, done by the compositor
 *     at a smoothness JS can't match; overriding it is what makes sites feel
 *     broken on mobile.
 *   - Short duration (0.9s) and a steep ease. Long durations look impressive in
 *     a demo and feel like lag when you're trying to reach a phone number.
 *
 * If it ever feels wrong, deleting the <SmoothScroll /> line in layout.tsx
 * returns the site to native scrolling with nothing else to unpick.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 0.9,
      // Steep at the start, settling quickly — momentum without float.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Native momentum on phones is better than anything we'd do here.
      syncTouch: false,
      // Let Lenis own in-page anchor jumps too, so #service links ease rather
      // than teleport while the rest of the page glides.
      anchors: true,
    });

    registerSmoothScroll(lenis);

    /*
     * Turn off CSS smooth scrolling for as long as Lenis is driving.
     *
     * The two fight over anchor jumps — the browser eases to the target while
     * Lenis eases to its own idea of it. A stylesheet rule scoped to the class
     * Lenis adds looked tidier but lost the cascade to the base-layer rule; an
     * inline style is unambiguous, and it reverts with the component, so
     * reduced-motion and no-JS visitors keep the CSS behaviour.
     */
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      registerSmoothScroll(null);
      document.documentElement.style.scrollBehavior = previousBehavior;
      lenis.destroy();
    };
  }, []);

  return null;
}
