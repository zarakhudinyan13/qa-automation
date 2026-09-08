import { test as base, expect } from './test.fixtures.js';
import { HomePage } from '../pages/HomePage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { ContactPage } from '../pages/ContactPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { PaymentPage } from '../pages/PaymentPage.js';
import { SignupPage } from '../pages/SignupPage.js';
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
 * - Shared session: setup project writes auth/user.json, chromium-auth loads it
 *   via Playwright storageState. `page` / `authenticatedPage` already have cookies.
 * - Isolated session: `freshSession` (apiSignup + own context, auto-cleanup).
 * - UI login is only for tests that VERIFY the login form itself (tests/ui/login.spec.js).
 *
 * authenticatedPage = the tab inside the shared authenticated context.
 */
export const test = base.extend({
  /**
   * Shared registered user session (from auth.setup.js → auth/user.json).
   * Playwright injects storageState on the chromium-auth project, so the
   * built-in context/page are already logged in. These aliases make that explicit.
   */
  authenticatedContext: async ({ context }, use) => {
    await use(context);
  },

  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },

  // POM pages bound to the authenticated tab (not a guest `page`)
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
  checkoutPage: async ({ authenticatedPage }, use) => {
    await use(new CheckoutPage(authenticatedPage));
  },
  paymentPage: async ({ authenticatedPage }, use) => {
    await use(new PaymentPage(authenticatedPage));
  },
  signupPage: async ({ authenticatedPage }, use) => {
    await use(new SignupPage(authenticatedPage));
  },
  header: async ({ authenticatedPage }, use) => {
    await use(new HeaderComponent(authenticatedPage));
  },

  /** Helper: fresh apiSignup user in their own browser context (isolated API + UI session) */
  createUserSession: async ({ browser }, use) => {
    await use((overrides) => createUserSession(browser, overrides));
  },

  /**
   * Isolated authenticated page: new user per test, cleaned up afterwards.
   * Use this for logout, checkout, or delete-account so the shared session stays intact.
   */
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
