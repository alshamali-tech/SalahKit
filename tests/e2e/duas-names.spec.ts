import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('duas library', () => {
  test('lists duas with category filters', async ({ page }) => {
    await gotoRoute(page, '/tools/duas');
    await expect(page.getByRole('tab', { name: /All/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Morning/ })).toBeVisible();
    await expect(page.getByText(/adhkar/).first()).toBeVisible();
  });

  test('search narrows the collection', async ({ page }) => {
    await gotoRoute(page, '/tools/duas');
    await page.getByPlaceholder(/Search/i).fill('morning');
    await expect(page.getByText(/Morning/i).first()).toBeVisible();
  });
});

test.describe('99 names', () => {
  test('renders the grid with search', async ({ page }) => {
    await gotoRoute(page, '/tools/names');
    await expect(page.getByText('Ar-Rahman')).toBeVisible();
    await page.locator('#names-search').fill('Merciful');
    await expect(page.getByText('Ar-Rahman')).toBeVisible();
    await expect(page.getByText('of 99')).toBeVisible();
  });
});
