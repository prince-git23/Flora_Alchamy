import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at app startup — idempotent but avoids chunk-level repetition
gsap.registerPlugin(ScrollTrigger);

/**
 * Check if the user prefers reduced motion.
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the viewport is desktop-width.
 */
export function isDesktop() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

export { gsap, ScrollTrigger };
