import { test as base, expect } from './test.fixtures.js';
import { HomePage } from '../pages/HomePage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { dismissGoogleVignette } from '../utils/helpers.js';
import {
  AUTH_FILE,
  BASE_URL,
  createAuthenticatedContext,
  createUserSession,
  openTwoSessions,
} from '../utils/session.js';

export const test = base.extend({
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

  freshSession: async ({ browser }, use) => {
    const session = await createUserSession(browser);
    try {
      await use(session);
    } finally {
      await session.cleanup();
    }
  },

  twoSessions: async ({ browser }, use) => {
    const sessions = await openTwoSessions(
      browser,
      { name: 'Context User A' },
      { name: 'Context User B' },
    );
    try {
      await use(sessions);
    } finally {
      await sessions.close();
    }
  },
});

export { expect, BASE_URL, createUserSession, createAuthenticatedContext, openTwoSessions, AUTH_FILE };
