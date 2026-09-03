// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Projects map to HOW auth is used:
 *
 * setup          → apiLogin once → write auth/user.json (NO browser UI)
 * chromium       → guest UI tests (login FORM is the only place UI login is OK)
 * chromium-auth  → UI tests with shared session via authenticatedPage fixture
 * examples       → student demos: browser/context + 2 parallel users via apiSignup
 * api            → pure API specs
 */
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
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/ui\/.*\.spec\.js/,
    },
    {
      name: 'chromium-auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/auth\/authenticated\.spec\.js/,
      dependencies: ['setup'],
    },
    {
      name: 'examples',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/examples\/.*\.spec\.js/,
    },
    {
      name: 'api',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/api\/.*\.spec\.js/,
    },
  ],
});
