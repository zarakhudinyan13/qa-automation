import path from 'path';
import { request as playwrightRequest } from '@playwright/test';
import { AuthenticationAPI } from '../api/AuthenticationAPI.js';
import { dismissGoogleVignette } from './helpers.js';
import { allSettledOrThrow } from './promises.js';

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
      await allSettledOrThrow([
        () => apiContext.dispose(),
        () => context.close(),
      ]);
    },
  };
}

async function cleanupSessions(sessions) {
  await allSettledOrThrow(sessions.map((session) => () => session.cleanup()));
}

/**
 * One browser, two contexts, two users.
 * Each call to createUserSession uses its own API context and cookie jar.
 * close() always cleans up both, including when the test fails.
 */
export async function openTwoSessions(browser, overridesA = {}, overridesB = {}) {
  const created = await Promise.allSettled([
    createUserSession(browser, overridesA),
    createUserSession(browser, overridesB),
  ]);
  const sessions = created
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
  const failure = created.find((result) => result.status === 'rejected');

  if (failure) {
    await cleanupSessions(sessions).catch(() => {});
    throw failure.reason;
  }

  const [sessionA, sessionB] = sessions;
  return {
    sessionA,
    sessionB,
    async close() {
      await cleanupSessions([sessionA, sessionB]);
    },
  };
}

export function getSharedAuthStoragePath() {
  return AUTH_FILE;
}

export { BASE_URL, AUTH_FILE };
