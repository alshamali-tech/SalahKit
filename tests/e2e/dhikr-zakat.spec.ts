import { test, expect } from '@playwright/test';
import { gotoRoute } from './helpers';

test.describe('dhikr counter', () => {
  test('counts taps toward the target and supports undo', async ({ page }) => {
    await gotoRoute(page, '/tools/dhikr');
    const counter = page.getByRole('button', { name: /Count SubhanAllah/ });
    await counter.click();
    await counter.click();
    await expect(counter).toHaveAttribute('aria-label', 'Count SubhanAllah: 2 of 33');
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(counter).toHaveAttribute('aria-label', 'Count SubhanAllah: 1 of 33');
  });

  test('target picker offers 33, 99 and 100', async ({ page }) => {
    await gotoRoute(page, '/tools/dhikr');
    await page.getByRole('button', { name: '99', exact: true }).click();
    await expect(page.getByRole('button', { name: /Count SubhanAllah: 0 of 99/ })).toBeVisible();
  });
});

test.describe('zakat calculator', () => {
  test('computes 2.5% above the silver nisab', async ({ page }) => {
    await gotoRoute(page, '/tools/zakat');
    await page.locator('#z-cash').fill('10000');
    await expect(page.getByText(/Zakat due/i).first()).toBeVisible();
    await expect(page.getByText(/\$250/).first()).toBeVisible();
  });

  test('shows below-nisab state for small amounts', async ({ page }) => {
    await gotoRoute(page, '/tools/zakat');
    await page.locator('#z-cash').fill('10');
    await expect(page.getByText(/Below nisab/i).first()).toBeVisible();
  });
});
