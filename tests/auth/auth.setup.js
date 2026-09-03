/**
 * SETUP PROJECT — runs once before chromium-auth tests.
 *
 * Creates a SHARED session for the registered .env user:
 *   AuthenticationAPI.apiLogin(email, password)
 *   → storageState written to auth/user.json
 *
 * UI tests then open authenticatedPage with those cookies — no LoginPage.login().
 */
import { test as setup } from '@playwright/test';
import { AuthenticationAPI } from '../../api/AuthenticationAPI.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../../auth/user.json');

setup('authenticate registered user via API (shared session)', async ({ request }) => {
  const { email, password } = getEnvCredentials();
  const authAPI = new AuthenticationAPI(request);

  const { response, storageState } = await authAPI.apiLogin(email, password);

  if (!response.ok()) {
    throw new Error(`API login failed with status ${response.status()}`);
  }

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
});
