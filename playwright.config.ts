import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E setup (S3, S12).
 * Happy paths: landing load, tool navigation, settings persistence,
 * offline mode (network blocking), donation toast timing, viewports
 * 320/768/1024/1440 and an axe accessibility scan.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-320', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev -- --port 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
