import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('hifz trainer', () => {
  test('opens on the Learn pipeline', async ({ page }) => {
    await gotoRoute(page, '/tools/hifz');
    await expect(page.getByRole('heading', { name: 'Hifz Trainer' })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Learn/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Review/ })).toBeVisible();
  });

  test('review queue is reachable', async ({ page }) => {
    await gotoRoute(page, '/tools/hifz');
    await page.getByRole('tab', { name: /Review/ }).click();
    await expect(page.getByText(/due|nothing due|review/i).first()).toBeVisible();
  });
});

test.describe('prayer tracker', () => {
  test('shows the weekly grid with a streak badge', async ({ page }) => {
    await gotoRoute(page, '/tools/tracker');
    await expect(page.getByText(/Streak:/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Fajr on \d{4}-\d{2}-\d{2}/ }).first()).toBeVisible();
  });

  test('toggling a prayer updates the week percentage', async ({ page }) => {
    await gotoRoute(page, '/tools/tracker');
    const before = await page.getByText(/% this week/).textContent();
    await page.getByRole('button', { name: /Fajr on \d{4}-\d{2}-\d{2}/ }).first().click();
    await expect(page.getByText(/% this week/)).not.toHaveText(before ?? '');
  });
});
