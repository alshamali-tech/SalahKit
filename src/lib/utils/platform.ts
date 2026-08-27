/**
 * Platform detection (lib/utils/platform.ts).
 * Distinguishes installed-PWA (standalone) from a normal browser tab.
 * Safe in non-browser contexts.
 */

/**
 * True when the app is running as an installed/standalone PWA.
 * @returns Whether window matches the standalone display mode.
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mm = window.matchMedia?.('(display-mode: standalone)');
  const nav = navigator as Navigator & { standalone?: boolean };
  return Boolean(mm?.matches || nav.standalone);
}

/**
 * True when the device is likely a touch-first (mobile/tablet) device.
 * @returns Whether coarse pointer input is primary.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.matchMedia?.('(pointer: coarse)').matches);
}

/**
 * True when the browser supports the Web Notification API.
 * @returns Notification availability.
 */
export function supportsNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * True when service workers are supported.
 * @returns Service-worker availability.
 */
export function supportsServiceWorker(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}
