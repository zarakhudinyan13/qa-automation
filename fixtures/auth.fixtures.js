import { test as base, expect } from './test.fixtures.js';
import { HomePage } from '../pages/HomePage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { ContactPage } from '../pages/ContactPage.js';
import { createAuthenticatedKeywords, setupAuthenticatedSession } from '../keywords/index.js';
import {
  AUTH_FILE,
  BASE_URL,
  createAuthenticatedContext,
  createUserSession,
} from '../utils/session.js';

/**
 * Auth fixtures — for UI tests that need a LOGGED-IN user.
 *
 * RULE FOR STUDENTS:
 * - Do NOT call LoginPage.login() here for "already logged in" scenarios.
 * - Session comes from AuthenticationAPI.apiLogin / apiSignup (storage state).
 * - UI login is only for tests that VERIFY the login form itself (tests/ui/login.spec.js).
 *
 * authenticatedPage = a Page inside a Context that already has shared session cookies.
 * authKeywords      = test keywords bound to that page (setupPage, verifyLoggedIn, ...).
 */
export const test = base.extend({
  /**
   * Shared registered user session (from auth.setup.js → auth/user.json).
   * Same user across the auth project — fast, stable, no UI login.
   */
  authenticatedContext: async ({ browser }, use) => {
    const context = await createAuthenticatedContext(browser, AUTH_FILE);
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
  },

  // POM pages bound to the authenticated tab (not the guest `page`)
  homePage: async ({ authenticatedPage }, use) => {
    await use(new HomePage(authenticatedPage));
  },
  productsPage: async ({ authenticatedPage }, use) => {
    await use(new ProductsPage(authenticatedPage));
  },
  cartPage: async ({ authenticatedPage }, use) => {
    await use(new CartPage(authenticatedPage));
  },
  productDetailsPage: async ({ authenticatedPage }, use) => {
    await use(new ProductDetailsPage(authenticatedPage));
  },
  contactPage: async ({ authenticatedPage }, use) => {
    await use(new ContactPage(authenticatedPage));
  },
  header: async ({ authenticatedPage }, use) => {
    await use(new HeaderComponent(authenticatedPage));
  },

  /**
   * Test keywords bound to the authenticated tab.
   * Use these in tests/auth instead of repeating POM calls.
   */
  authKeywords: async ({ authenticatedPage, header, homePage, productsPage, cartPage }, use) => {
    await use(
      createAuthenticatedKeywords({
        page: authenticatedPage,
        header,
        homePage,
        productsPage,
        cartPage,
      }),
    );
  },

  /** Helper: fresh apiSignup user in their own browser context (isolated API + UI session) */
  createUserSession: async ({ browser }, use) => {
    await use((overrides) => createUserSession(browser, overrides));
  },
});

export {
  expect,
  BASE_URL,
  createUserSession,
  createAuthenticatedContext,
  createAuthenticatedKeywords,
  setupAuthenticatedSession,
};
