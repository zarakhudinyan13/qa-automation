import path from 'path';
import { request as playwrightRequest } from '@playwright/test';
import { AuthenticationAPI } from '../api/AuthenticationAPI.js';

const AUTH_FILE = path.join(__dirname, '../auth/user.json');
const BASE_URL = process.env.BASE_URL || 'https://automationexercise.com';

/**
 * Creates an isolated browser context already logged in (cookies/storage applied).
 * Use this when a UI test needs an authenticated user WITHOUT opening the login form.
 *
 * Hierarchy for students:
 *   browser  → one Chromium process
 *   context  → one user session (cookies, storage) — isolated from other contexts
 *   page     → one tab inside that context
 */
export async function createAuthenticatedContext(browser, storageState) {
  return browser.newContext({
    storageState,
    baseURL: BASE_URL,
  });
}

/**
 * Fresh APIRequestContext per user — never share one request between two logins.
 * Same idea as browser contexts: one session container per user.
 */
export async function createAuthAPI() {
  const apiContext = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const authAPI = new AuthenticationAPI(apiContext);
  return { authAPI, apiContext };
}

/**
 * Full reusable flow for a NEW user in UI tests:
 * 1) isolated apiSignup (API — not UI)
 * 2) open a dedicated browser context with that user's storage
 * 3) open a page (tab) ready to use with POM classes
 */
export async function createUserSession(browser, userOverrides = {}) {
  const { authAPI, apiContext } = await createAuthAPI();
  const { user, storageState, createBody, loginResponse } = await authAPI.apiSignup(userOverrides);
  const context = await createAuthenticatedContext(browser, storageState);
  const page = await context.newPage();

  return {
    user,
    storageState,
    createBody,
    loginResponse,
    context,
    page,
    authAPI,
    async cleanup() {
      await authAPI.deleteAccount(user.email, user.password);
      await apiContext.dispose();
      await context.close();
    },
  };
}

/**
 * Shared registered user from auth/user.json (written by auth.setup.js via apiLogin).
 * Prefer fixtures: use `authenticatedPage` instead of calling this in every test.
 */
export function getSharedAuthStoragePath() {
  return AUTH_FILE;
}

export { BASE_URL, AUTH_FILE };
