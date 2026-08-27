/**
 * Reduced-motion helper (lib/utils/reduced-motion.ts).
 * Honors the user's OS/browser preference to disable animation.
 */

/**
 * True when the user prefers reduced motion.
 * @returns Whether the prefers-reduced-motion media query matches.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

/**
 * Subscribes to changes in the reduced-motion preference.
 * @param onChange - Called with the new preference.
 * @returns An unsubscribe function.
 */
export function watchReducedMotion(onChange: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (!mq) return () => undefined;
  const handler = (e: MediaQueryListEvent): void => onChange(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/**
 * Duration in ms, forced to 0 when reduced motion is preferred.
 * @param ms - Desired duration.
 * @returns 0 under reduced motion, else ms.
 */
export function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}
