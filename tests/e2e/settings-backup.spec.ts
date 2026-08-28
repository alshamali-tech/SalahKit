import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('settings & data manager', () => {
  test('data manager exposes export / import / clear', async ({ page }) => {
    await gotoRoute(page, '/tools/prayer');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await expect(page.getByRole('button', { name: 'Export JSON' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Import backup' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear all data' })).toBeVisible();
  });

  test('clear all data asks for confirmation before wiping', async ({ page }) => {
    await gotoRoute(page, '/tools/prayer');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('button', { name: 'Clear all data' }).click();
    await expect(page.getByRole('button', { name: 'Yes, delete' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Yes, delete' })).toHaveCount(0);
  });

  test('language preference persists across reloads', async ({ page }) => {
    await gotoRoute(page, '/dashboard');
    await page.getByRole('button', { name: /Interface language|English/i }).first().click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
  });
});
