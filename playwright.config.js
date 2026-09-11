// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['list'], ['github']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    testIdAttribute: 'data-qa',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      // API login for the .env user → auth/user.json
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    {
      // Guest UI: no cookies. Leave tests/ui/home.spec.js as it is.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/ui\/.*\.spec\.js/,
    },
    {
      // Logged-in UI: depends on setup. Specs live in tests/auth/*.spec.js
      name: 'chromium-auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/auth\/.*\.spec\.js/,
      dependencies: ['setup'],
    },
  ],
});
