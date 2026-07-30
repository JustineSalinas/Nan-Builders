"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Heading that rises out from behind a mask as it scrolls into view.
 *
 * The mask is the point: the text is clipped by its wrapper, so it reads as
 * emerging from behind an edge rather than sliding in from empty space.
 *
 * Two things here are load-bearing and look redundant until they aren't:
 *
 * 1. The observer watches the *wrapper*, not the text. `whileInView` would put
 *    it on the moving element — which starts translated fully below the mask,
 *    and IntersectionObserver clips against ancestor overflow, so it would
 *    report zero intersection and never fire. The heading would stay invisible
 *    permanently. The trigger has to sit on something that doesn't move.
 *
 * 2. The padding / negative-margin pair. `overflow: hidden` otherwise shears
 *    the descenders off g, y, p and j, which hang below the baseline and so
 *    below the clip edge. The padding grows the clip box; the negative margin
 *    takes that space back out of layout so surrounding rhythm is untouched.
 *
 * MotionProvider's reducedMotion="user" turns the rise into a plain fade for
 * anyone who asked for less movement.
 */
export function RiseText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <span ref={ref} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <motion.span
        className={cn("block", className)}
        initial={{ y: "115%" }}
        animate={inView ? { y: 0 } : { y: "115%" }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
