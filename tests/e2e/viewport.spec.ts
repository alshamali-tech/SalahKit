import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WIDTHS = [320, 768, 1024, 1440];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px (S6)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/tools/prayer');
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('sidebar collapses below 768px into a drawer', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#/tools/prayer');
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible();
  await expect(page.locator('aside').filter({ hasText: 'Qibla Compass' })).toBeHidden();

  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.locator('aside').filter({ hasText: 'Qibla Compass' })).toBeVisible();
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(page.locator('aside').filter({ hasText: 'Qibla Compass' })).toBeHidden();
});

test('landing has no serious WCAG 2.1 AA violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical'
  );
  expect(blocking).toEqual([]);
});
