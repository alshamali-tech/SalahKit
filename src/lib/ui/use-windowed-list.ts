/**
 * List windowing hook (P13).
 * Long lists (hadith sections, search results) render only the rows in
 * and around the viewport, so mid-range phones never freeze on
 * hundreds of heavy Arabic text cards.
 */
import { useEffect, useRef, useState } from 'react';

/** Window state for a virtualized range. */
export interface WindowRange {
  /** First visible index (inclusive). */
  start: number;
  /** Last visible index (exclusive). */
  end: number;
  /** Total list length. */
  total: number;
}

/**
 * Computes a visible index window for a scroll container.
 * Call the returned `onScroll` from the container's scroll handler and
 * read `range` to slice the list. Overscan keeps scrolling smooth.
 * @param itemHeightPx - Approximate row height.
 * @param viewportHeightPx - Visible container height (default 600).
 * @param overscan - Extra rows rendered beyond the viewport (default 3).
 * @returns Window range plus the scroll handler to attach.
 */
export function useWindowedList(
  itemHeightPx: number,
  viewportHeightPx = 600,
  overscan = 3
): { range: WindowRange; onScroll: (e: { currentTarget: HTMLElement }) => void } {
  const [scrollTop, setScrollTop] = useState(0);
  const [total, setTotal] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  // Reset the window when the list length changes (new section).
  useEffect(() => {
    setScrollTop(0);
  }, [total]);

  const visible = Math.ceil(viewportHeightPx / Math.max(1, itemHeightPx));
  const start = Math.max(0, Math.floor(scrollTop / Math.max(1, itemHeightPx)) - overscan);
  const end = Math.min(total, start + visible + overscan * 2);

  const onScroll = ({ currentTarget }: { currentTarget: HTMLElement }): void => {
    const next = currentTarget.scrollTop;
    const count = Math.max(
      total,
      Math.ceil(currentTarget.scrollHeight / Math.max(1, itemHeightPx))
    );
    if (count !== total) setTotal(count);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setScrollTop(next));
  };

  return { range: { start, end, total }, onScroll };
}

/**
 * Reports a list's total length into a window hook.
 * @param total - Number of items.
 * @returns A setter to feed the hook.
 */
export function useListTotal(): [number, (n: number) => void] {
  const [total, setTotal] = useState(0);
  return [total, setTotal];
}
