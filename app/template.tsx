"use client";

import { motion } from "motion/react";

/**
 * Route transition.
 *
 * `template.tsx` remounts on every navigation, which is exactly the hook a
 * page transition needs — `layout.tsx` would persist and never re-run.
 *
 * Deliberately small: 220ms, a 10px rise, no blur, no slide across the
 * viewport. Text has to be readable the moment it lands, and anything longer
 * turns a click into a wait — a visitor moving from Services to Supply is
 * looking for a price, not choreography. MotionProvider's reducedMotion:"user"
 * strips the transform for anyone who asked for less motion, leaving the fade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
