import { test, expect } from '@playwright/test';

test.describe('tool modules', () => {
  test('sidebar navigation switches modules and updates the route', async ({ page }) => {
    await page.goto('/#/tools/prayer');
    await page.getByRole('button', { name: 'Qibla Compass' }).click();
    await expect(page).toHaveURL(/#\/tools\/qibla/);
    await expect(page.getByText('Qibla bearing')).toBeVisible();
    await page.getByRole('button', { name: '99 Names' }).click();
    await expect(page.getByText('Ar-Rahman')).toBeVisible();
  });

  test('dhikr counter increments and announces progress', async ({ page }) => {
    await page.goto('/#/tools/dhikr');
    const counter = page.getByRole('button', { name: /Count SubhanAllah/ });
    await counter.click();
    await counter.click();
    await counter.click();
    await expect(counter).toHaveAttribute('aria-label', 'Count SubhanAllah: 3 of 33');
  });

  test('theme preference persists across reloads', async ({ page }) => {
    await page.goto('/#/tools/prayer');
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('donation prompt never appears on a first visit', async ({ page }) => {
    await page.goto('/#/tools/prayer');
    await page.waitForTimeout(1500);
    await expect(page.getByText('SalahKit is free forever')).toHaveCount(0);
  });

  test('settings dialog opens and changes persist', async ({ page }) => {
    await page.goto('/#/tools/prayer');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('button', { name: 'Hanafi (2×)' }).click();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Open settings' }).click();
    await expect(page.getByRole('button', { name: 'Hanafi (2×)' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
