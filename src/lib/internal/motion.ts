/**
 * Reduced-motion helpers for JS-driven motion (flip durations, exit-unmount
 * timeouts). CSS animations/transitions are gated globally by the
 * `@media (prefers-reduced-motion: reduce)` reset in theme.css; this covers the
 * cases CSS can't reach.
 */

/** True when the user has asked for reduced motion. SSR-safe (false on server). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** A duration honouring reduced-motion: `0` when reduced, else `ms`. */
export function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}
