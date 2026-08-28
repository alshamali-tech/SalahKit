import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('qibla', () => {
  test('shows bearing, distance and the dial', async ({ page }) => {
    await gotoRoute(page, '/tools/qibla');
    await expect(page.getByText('Qibla bearing')).toBeVisible();
    // Bearing reads like 119.0° from Makkah defaults.
    await expect(page.getByText(/\d{1,3}\.\d°/).first()).toBeVisible();
    await expect(page.getByText(/km to Kaaba/).first()).toBeVisible();
    await expect(page.locator('svg[role="img"]').first()).toBeVisible();
  });

  test('provides a manual fallback note for sensor-less devices', async ({ page }) => {
    await gotoRoute(page, '/tools/qibla');
    await expect(page.getByText(/true north|magnetic/i).first()).toBeVisible();
  });
});
