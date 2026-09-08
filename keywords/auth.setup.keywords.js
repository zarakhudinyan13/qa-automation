import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test';
import { AuthenticationAPI } from '../api/AuthenticationAPI.js';
import { getEnvCredentials } from '../utils/helpers.js';
import { AUTH_FILE } from '../utils/session.js';

/**
 * SETUP KEYWORDS — shared session for authenticatedPage
 * ----------------------------------------------------
 * Run from tests/auth/auth.setup.js (Playwright `setup` project).
 * Each helper is a test.step so it shows as a keyword in the HTML report.
 *
 * Flow:
 *   1) AuthenticationAPI.apiLogin(EMAIL, PASSWORD)
 *   2) Write storage state to auth/user.json
 *   3) chromium-auth tests open authenticatedPage with those cookies
 *
 * Do NOT use LoginPage.login() here.
 */

export async function authenticateRegisteredUser(request) {
  return test.step('API login registered user (shared session)', async () => {
    const { email, password, userName } = getEnvCredentials();
    const authAPI = new AuthenticationAPI(request);
    const { response, storageState } = await authAPI.apiLogin(email, password);

    if (!response.ok()) {
      throw new Error(`API login failed with status ${response.status()}`);
    }

    const sessionCookie = storageState.cookies?.find((cookie) => cookie.name === 'sessionid');
    if (!sessionCookie) {
      throw new Error('API login succeeded but storage state has no sessionid cookie');
    }

    return { email, userName, response, storageState };
  });
}

export async function saveAuthenticatedStorage(storageState, authFile = AUTH_FILE) {
  return test.step('Save storage state for authenticatedPage', async () => {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
    return authFile;
  });
}

/**
 * One-shot setup keyword used by the Playwright setup project.
 * @returns {{ email: string, userName: string, storageState: object, authFile: string }}
 */
export async function setupAuthenticatedSession(request, authFile = AUTH_FILE) {
  return test.step('Setup authenticated session for UI tests', async () => {
    const { email, userName, storageState } = await authenticateRegisteredUser(request);
    const savedPath = await saveAuthenticatedStorage(storageState, authFile);
    return { email, userName, storageState, authFile: savedPath };
  });
}
