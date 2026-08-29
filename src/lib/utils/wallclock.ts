/**
 * Wall-clock timing (P0: no timer may accumulate).
 * Every displayed instant derives from Date.now(); the scheduler only
 * decides WHEN to re-render — aligned to the next boundary, never a
 * drifting tick chain — and wakes instantly on visibility/focus so a
 * throttled hidden tab snaps back to truth the moment it returns.
 */
import { useEffect, useState } from 'react';

/**
 * A self-correcting clock: re-renders exactly on each `stepMs`
 * boundary (setTimeout to the boundary, recomputed every cycle, so no
 * drift can accumulate) and immediately when the tab becomes visible
 * or focused again.
 * @param stepMs - Boundary interval in ms (default 1000 = whole seconds).
 * @returns The current Date, refreshed on every boundary crossing.
 */
export function useWallClock(stepMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: number | undefined;
    const schedule = (): void => {
      const delay = Math.max(16, stepMs - (Date.now() % stepMs));
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, delay);
    };
    schedule();
    const wake = (): void => setNow(new Date());
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('focus', wake);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', wake);
      window.removeEventListener('focus', wake);
    };
  }, [stepMs]);

  return now;
}

/**
 * Milliseconds until the next occurrence of a wall-clock boundary
 * (e.g. the top of the next minute), for precise wake scheduling.
 * @param boundaryMs - Boundary size in ms (e.g. 60000).
 * @returns Delay in ms until the next boundary.
 */
export function msUntilBoundary(boundaryMs: number): number {
  return boundaryMs - (Date.now() % boundaryMs);
}
