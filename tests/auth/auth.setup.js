/**
 * Shared-session setup (runs before chromium-auth tests).
 *
 * 1. Log in the .env user through the API (not the login form).
 * 2. Write cookies to auth/user.json.
 * 3. Auth tests open a context from that file (see fixtures/auth.fixtures.js).
 *
 * Do not log this user out or delete the account. Other tests reuse sessionid.
 */
import { test as setup } from '@playwright/test';
import { AuthenticationAPI } from '../../api/AuthenticationAPI.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../../auth/user.json');

setup('authenticate via API', async ({ request }) => {
  const { email, password } = getEnvCredentials();
  const authAPI = new AuthenticationAPI(request);
  const { response, storageState } = await authAPI.apiLogin(email, password);

  if (!response.ok()) {
    throw new Error(`API login failed with status ${response.status()}`);
  }

  const sessionCookie = storageState.cookies?.find((cookie) => cookie.name === 'sessionid');
  if (!sessionCookie) {
    throw new Error('API login did not return a sessionid cookie');
  }

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
});
