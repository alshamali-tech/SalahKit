import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
  test('loads with the live next-prayer hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SalahKit – Free Offline Islamic Tools/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('offline');
    await expect(page.getByText(/Next prayer/).first()).toBeVisible();
    await expect(page.getByText(/\d{2}:\d{2}:\d{2}/).first()).toBeVisible();
  });

  test('FAQ accordion expands and includes the funding question', async ({ page }) => {
    await page.goto('/');
    const question = page.getByRole('button', { name: 'Does it really work offline?' });
    await question.scrollIntoViewIfNeeded();
    await question.click();
    await expect(page.locator('#faq-panel-1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'How is this free?' }).first()).toBeVisible();
  });

  test('hero CTA opens the prayer tool via the hash router', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open the toolkit' }).click();
    await expect(page).toHaveURL(/#\/tools\/prayer/);
    await expect(page.getByText('Dhuhr').first()).toBeVisible();
  });

  test('feature tiles deep-link into their tools', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Zakat Calculator/ }).click();
    await expect(page).toHaveURL(/#\/tools\/zakat/);
    await expect(page.getByText('Your zakatable wealth')).toBeVisible();
  });

  test('comparison table states the free pricing', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('cell', { name: /Free forever/ })).toBeVisible();
  });
});
