/**
 * Playwright shared helpers (Blueprint: tests/e2e/helpers.ts).
 * Centralises navigation to hash routes and IndexedDB seeding so specs
 * stay declarative.
 */
import type { Page } from '@playwright/test';

/**
 * Navigates to a hash route and waits for the app shell to render.
 * @param page - Playwright page.
 * @param path - Route path without the leading '#', e.g. '/dashboard'.
 */
export async function gotoRoute(page: Page, path: string): Promise<void> {
  await page.goto(`/#${path}`);
  await page.waitForSelector('#main-content', { state: 'attached' });
}

/**
 * Seeds IndexedDB settings before the app boots, via an init script.
 * Useful for asserting the app honours a persisted city/method.
 * @param page - Playwright page.
 * @param settings - Partial settings merged over defaults.
 */
export async function seedSettings(
  page: Page,
  settings: Record<string, unknown>
): Promise<void> {
  await page.addInitScript((json: string) => {
    window.localStorage.setItem('salahkit:settings-cache', json);
  }, JSON.stringify(settings));
}

/**
 * Asserts the document has no horizontal overflow at the current size.
 * @param page - Playwright page.
 */
export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 1) throw new Error(`Horizontal overflow of ${overflow}px detected`);
}
