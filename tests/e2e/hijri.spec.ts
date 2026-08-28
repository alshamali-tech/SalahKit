import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('hijri tools', () => {
  test('converter shows today in both calendars', async ({ page }) => {
    await gotoRoute(page, '/tools/hijri');
    await expect(page.getByText(/AH/).first()).toBeVisible();
    await expect(page.locator('#g-to-h')).toBeVisible();
  });

  test('converting a known date yields a Hijri result', async ({ page }) => {
    await gotoRoute(page, '/tools/hijri');
    await page.locator('#g-to-h').fill('2024-03-11');
    // Ramadan 1445 began around 2024-03-11/12.
    await expect(page.getByText(/1445/).first()).toBeVisible();
  });

  test('calendar view marks today', async ({ page }) => {
    await gotoRoute(page, '/tools/calendar');
    await expect(page.getByText(/Hijri month/).first()).toBeVisible();
    await expect(page.getByText('Today').first()).toBeVisible();
  });
});
