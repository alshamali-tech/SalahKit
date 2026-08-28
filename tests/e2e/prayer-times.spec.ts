import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('prayer times', () => {
  test('shows all six times with a live countdown', async ({ page }) => {
    await gotoRoute(page, '/tools/prayer');
    for (const name of ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByText(/\d{2}:\d{2}:\d{2}/).first()).toBeVisible();
  });

  test('changing city through the picker recomputes the times', async ({ page }) => {
    await gotoRoute(page, '/tools/prayer');
    await page.getByRole('button', { name: /Makkah, Saudi Arabia/ }).click();
    await page.locator('#city-search').fill('London');
    await page.getByRole('option', { name: /London/ }).click();
    await expect(page.getByRole('button', { name: /London, United Kingdom/ })).toBeVisible();
  });

  test('exposes the five calculation methods as a radiogroup', async ({ page }) => {
    await gotoRoute(page, '/tools/prayer');
    const group = page.getByRole('radiogroup', { name: 'Prayer time calculation method' });
    await expect(group).toBeVisible();
    await expect(group.getByRole('radio', { name: /Muslim World League/ })).toBeVisible();
    await expect(group.getByRole('radio', { name: /ISNA/ })).toBeVisible();
  });
});
