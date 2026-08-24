import { test, expect } from '@playwright/test';

test.describe('offline mode (S5)', () => {
  test('shows the offline banner and keeps computing prayer times', async ({ page, context }) => {
    await page.goto('/#/tools/prayer');
    await expect(page.getByText('Fajr').first()).toBeVisible();
    await expect(page.getByText(/Offline mode/)).toHaveCount(0);

    await context.setOffline(true);
    await expect(page.getByText(/Offline mode — every tool still works/)).toBeVisible();

    // The on-device engine never depends on the network.
    await expect(page.getByText(/\d{2}:\d{2}:\d{2}/).first()).toBeVisible();
    await expect(page.getByText('Dhuhr').first()).toBeVisible();
  });

  test('qibla and Quran remain fully usable with the network blocked', async ({ page, context }) => {
    await page.goto('/#/tools/qibla');
    await context.setOffline(true);
    await expect(page.getByText('Qibla bearing')).toBeVisible();

    await page.goto('/#/tools/quran');
    await expect(page.getByText(/Al-Fatihah/)).toBeVisible();
  });
});
