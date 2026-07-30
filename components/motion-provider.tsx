"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Honours the OS "reduce motion" setting across every motion component.
 *
 * The `prefers-reduced-motion` block in globals.css only zeroes CSS animation
 * and transition durations. Motion animates transforms from JS, so it sails
 * straight past that guard — and its own default is `reducedMotion: "never"`.
 * Without this wrapper, a visitor who asked for less motion still gets every
 * slide, rise and zoom on the site.
 *
 * "user" keeps opacity fades (which don't trigger vestibular symptoms) and
 * drops transform-based movement.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
