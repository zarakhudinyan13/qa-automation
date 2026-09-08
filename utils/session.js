import path from 'path';
import { request as playwrightRequest } from '@playwright/test';
import { AuthenticationAPI } from '../api/AuthenticationAPI.js';
import { dismissGoogleVignette } from './helpers.js';

const AUTH_FILE = path.join(__dirname, '../auth/user.json');
const BASE_URL = process.env.BASE_URL || 'https://automationexercise.com';

export async function createAuthenticatedContext(browser, storageState) {
  return browser.newContext({
    storageState,
    baseURL: BASE_URL,
  });
}

export async function createAuthAPI() {
  const apiContext = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const authAPI = new AuthenticationAPI(apiContext);
  return { authAPI, apiContext };
}

export async function createUserSession(browser, userOverrides = {}) {
  const { authAPI, apiContext } = await createAuthAPI();
  const { user, storageState, createBody, loginResponse } = await authAPI.apiSignup(userOverrides);
  const context = await createAuthenticatedContext(browser, storageState);
  const page = await context.newPage();
  await page.addLocatorHandler(page.locator('#google_vignette'), async () => {
    await dismissGoogleVignette(page);
  });

  return {
    user,
    storageState,
    createBody,
    loginResponse,
    context,
    page,
    authAPI,
    async cleanup() {
      try {
        await authAPI.deleteAccount(user.email, user.password);
      } catch {
        // account may already be gone
      }
      await apiContext.dispose();
      await context.close();
    },
  };
}

export function getSharedAuthStoragePath() {
  return AUTH_FILE;
}

export { BASE_URL, AUTH_FILE };
