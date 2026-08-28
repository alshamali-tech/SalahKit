import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('quran reader', () => {
  test('opens on Al-Fatihah with its seven ayahs', async ({ page }) => {
    await gotoRoute(page, '/tools/quran');
    await expect(page.getByText(/Al-Fatihah/).first()).toBeVisible();
    await expect(page.getByText('7 ayahs')).toBeVisible();
  });

  test('exposes audio and tajweed overlay controls', async ({ page }) => {
    await gotoRoute(page, '/tools/quran');
    await expect(page.getByRole('button', { name: /Listen to surah/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle tajweed color overlay' })).toBeVisible();
  });

  test('bookmarks are available', async ({ page }) => {
    await gotoRoute(page, '/tools/quran');
    await expect(page.getByRole('button', { name: /Bookmarks/ })).toBeVisible();
  });
});
