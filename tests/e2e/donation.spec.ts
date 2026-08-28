import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('donation system', () => {
  test('donate page lists providers with external links', async ({ page }) => {
    await gotoRoute(page, '/donate');
    const kofi = page.getByRole('link', { name: /Ko-fi/i }).first();
    await expect(kofi).toBeVisible();
    await expect(kofi).toHaveAttribute('target', '_blank');
    await expect(kofi).toHaveAttribute('rel', /noopener/);
    await expect(page.getByText(/Free forever/i).first()).toBeVisible();
  });

  test('donation never blocks or gates a tool', async ({ page }) => {
    await gotoRoute(page, '/tools/quran');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByText(/Choose a surah|Al-Fatihah/i).first()).toBeVisible();
  });

  test('settings exposes a support section', async ({ page }) => {
    await gotoRoute(page, '/tools/prayer');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await expect(page.getByText('Support SalahKit').first()).toBeVisible();
  });
});
