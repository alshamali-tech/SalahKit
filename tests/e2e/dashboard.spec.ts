import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('dashboard hub', () => {
  test('shows next prayer, Hijri date, streak and the tool grid', async ({ page }) => {
    await gotoRoute(page, '/dashboard');
    await expect(page.getByText('Next prayer').first()).toBeVisible();
    await expect(page.getByText('Streak').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Prayer Times' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hifz Trainer' })).toBeVisible();
  });

  test('tool tiles navigate to their module', async ({ page }) => {
    await gotoRoute(page, '/dashboard');
    await page.getByRole('button', { name: 'Zakat Calculator' }).click();
    await expect(page).toHaveURL(/#\/tools\/zakat/);
  });

  test('landing CTA opens the dashboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open the toolkit/i }).click();
    await expect(page).toHaveURL(/#\/dashboard/);
  });
});
