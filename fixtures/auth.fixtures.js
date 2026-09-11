/**
 * Fixtures for logged-in UI tests. Import these from tests/auth/*.spec.js.
 *
 * authenticatedPage — shared .env user (auth/user.json). Fast. Do not logout.
 * freshSession      — new account, own context; cleanup() deletes it after the test.
 *
 * See AUTHENTICATED_PAGE.md and HOMEWORK.md.
 */
import { test as base, expect } from './test.fixtures.js';
import { HomePage } from '../pages/HomePage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { dismissGoogleVignette } from '../utils/helpers.js';
import {
  AUTH_FILE,
  BASE_URL,
  createAuthenticatedContext,
  createUserSession,
} from '../utils/session.js';

export const test = base.extend({
  // Shared .env user. Do not logout or delete this account.
  authenticatedContext: async ({ browser }, use) => {
    const context = await createAuthenticatedContext(browser, AUTH_FILE);
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await page.addLocatorHandler(page.locator('#google_vignette'), async () => {
      await dismissGoogleVignette(page);
    });
    await use(page);
  },

  homePage: async ({ authenticatedPage }, use) => {
    await use(new HomePage(authenticatedPage));
  },
  header: async ({ authenticatedPage }, use) => {
    await use(new HeaderComponent(authenticatedPage));
  },

  createUserSession: async ({ browser }, use) => {
    await use((overrides) => createUserSession(browser, overrides));
  },

  // Isolated user. Use this for Logout — not authenticatedPage.
  freshSession: async ({ browser }, use) => {
    const session = await createUserSession(browser);
    try {
      await use(session);
    } finally {
      await session.cleanup();
    }
  },
});

export { expect, BASE_URL, createUserSession, createAuthenticatedContext, AUTH_FILE };
