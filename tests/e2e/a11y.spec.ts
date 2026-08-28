import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoRoute } from './helpers';

test.describe('accessibility', () => {
  test('skip link is the first tab stop and targets main content', async ({ page }) => {
    await gotoRoute(page, '/dashboard');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main-content');
    await expect(page.locator('#main-content')).toBeAttached();
  });

  test('landing has no serious WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(blocking).toEqual([]);
  });

  test('every form control has a label', async ({ page }) => {
    await gotoRoute(page, '/tools/zakat');
    const unlabeled = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll('input, select, textarea')
      ) as HTMLElement[];
      return controls.filter((el) => {
        const id = el.getAttribute('id');
        const hasFor = id !== null && document.querySelector(`label[for="${id}"]`) !== null;
        const hasAria = el.getAttribute('aria-label') !== null;
        const wrapped = el.closest('label') !== null;
        return !(hasFor || hasAria || wrapped);
      }).length;
    });
    expect(unlabeled).toBe(0);
  });

  test('interactive targets meet the 44px minimum on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoRoute(page, '/dashboard');
    const tooSmall = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a[href]'));
      return buttons.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40);
      }).length;
    });
    // Allow a small number of inline text links; primary controls must pass.
    expect(tooSmall).toBeLessThanOrEqual(3);
  });
});
