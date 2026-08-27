/**
 * Polite live-region announcer (lib/utils/aria.ts).
 * Provides a single visually-hidden aria-live region that screen
 * readers announce when text is pushed to it.
 */

let region: HTMLElement | null = null;

/**
 * Ensures the live region exists in the DOM, creating it once.
 * @returns The aria-live element.
 */
function ensureRegion(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  if (region && document.body.contains(region)) return region;
  region = document.createElement('div');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('role', 'status');
  region.style.position = 'absolute';
  region.style.width = '1px';
  region.style.height = '1px';
  region.style.overflow = 'hidden';
  region.style.clip = 'rect(0 0 0 0)';
  region.style.whiteSpace = 'nowrap';
  document.body.appendChild(region);
  return region;
}

/**
 * Announces a message to assistive technology (polite).
 * Clears then sets the text so repeated identical messages re-announce.
 * @param message - Text to announce.
 */
export function announce(message: string): void {
  const el = ensureRegion();
  if (!el) return;
  el.textContent = '';
  // Defer so the clear registers as a change.
  window.setTimeout(() => {
    el.textContent = message;
  }, 50);
}
