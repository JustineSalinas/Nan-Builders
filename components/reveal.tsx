"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fade + slide-up on scroll into view.
 *
 * Reduced motion is honoured globally by MotionProvider (`reducedMotion:
 * "user"`), which strips the transform and leaves the fade — the CSS
 * `prefers-reduced-motion` block can't reach JS-driven transforms on its own.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  scale = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span";
  /**
   * Settle in from very slightly oversized. Meant for image cards, where it
   * reads as the photo coming to rest; on a block of text it just looks like a
   * zoom, so it stays off by default.
   */
  scale?: boolean;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 22, ...(scale ? { scale: 1.05 } : {}) }}
      whileInView={{ opacity: 1, y: 0, ...(scale ? { scale: 1 } : {}) }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: scale ? 0.75 : 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
