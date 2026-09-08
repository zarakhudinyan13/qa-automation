/**
 * SETUP PROJECT — runs once before chromium-auth tests.
 *
 * Uses setup keywords (keywords/auth.setup.keywords.js):
 *   AuthenticationAPI.apiLogin(email, password)
 *   → storageState written to auth/user.json
 *
 * UI tests then open authenticatedPage with those cookies — no LoginPage.login().
 */
import { test as setup } from '@playwright/test';
import { setupAuthenticatedSession } from '../../keywords/index.js';

setup('authenticate registered user via API (shared session)', async ({ request }) => {
  await setupAuthenticatedSession(request);
});
