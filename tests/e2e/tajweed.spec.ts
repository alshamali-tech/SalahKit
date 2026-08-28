import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('tajweed', () => {
  test('renders the six views as tabs', async ({ page }) => {
    await gotoRoute(page, '/tools/tajweed');
    for (const label of ['Guided Path', 'The Noon Tree', 'Real Examples', 'Letter Map', 'Live Lab']) {
      await expect(page.getByRole('tab', { name: new RegExp(label) })).toBeVisible();
    }
  });

  test('live lab annotates pasted text', async ({ page }) => {
    await gotoRoute(page, '/tools/tajweed');
    await page.getByRole('tab', { name: /Live Lab/ }).click();
    await page.locator('#tajweed-lab-input').fill('مِنْ قَبْلُ');
    await expect(page.getByText(/rules found/).first()).toBeVisible();
  });

  test('real examples verify against the engine', async ({ page }) => {
    await gotoRoute(page, '/tools/tajweed');
    await page.getByRole('tab', { name: /Real Examples/ }).click();
    await expect(page.getByText(/engine agrees/).first()).toBeVisible();
  });
});
