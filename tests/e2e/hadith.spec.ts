import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('hadith library', () => {
  test('shows the hadith of the day and both views', async ({ page }) => {
    await gotoRoute(page, '/tools/hadith');
    await expect(page.getByText(/Hadith of the Day/)).toBeVisible();
    await expect(page.getByRole('tab', { name: /Full Sahihayn/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Curated Gems/ })).toBeVisible();
  });

  test('curated view has category filters and favorites', async ({ page }) => {
    await gotoRoute(page, '/tools/hadith');
    await page.getByRole('tab', { name: /Curated Gems/ }).click();
    await expect(page.getByRole('button', { name: /Faith & Intention|All/ }).first()).toBeVisible();
  });

  test('degrades gracefully offline', async ({ page, context }) => {
    await context.setOffline(true);
    await gotoRoute(page, '/tools/hadith');
    await page.getByRole('tab', { name: /Full Sahihayn/ }).click();
    await expect(page.getByText(/offline/i).first()).toBeVisible();
  });
});
