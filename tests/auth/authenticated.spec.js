/**
 * AUTHENTICATED UI TESTS
 * ----------------------
 * These tests never open the Signup/Login form.
 * Session is prepared by:
 *   1) tests/auth/auth.setup.js  → AuthenticationAPI.apiLogin()
 *   2) storage saved to auth/user.json
 *   3) fixtures/auth.fixtures.js → authenticatedPage (browser context + cookies)
 *
 * Use: import { test, expect } from '../../fixtures/auth.fixtures.js'
 */
import { test, expect } from '../../fixtures/auth.fixtures.js';

test.describe('Authenticated UI (shared API session)', () => {
  test('authenticatedPage lands already logged in', async ({ authenticatedPage, header }) => {
    await authenticatedPage.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(header.loggedInIndicator()).toBeVisible();
    await expect(header.logoutLink).toBeVisible();
  });

  test('authenticated user can open products and add to cart', async ({
    authenticatedPage,
    productsPage,
    cartPage,
  }) => {
    await productsPage.navigateTo('products');
    await productsPage.addProductToCart('1');
    await productsPage.goToCartFromModal();

    await cartPage.verifyCartPageLoaded();
    await expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
    await expect(authenticatedPage.locator('#cart_info_table')).toBeVisible();
  });

  test('authenticated user navigates home → products via header', async ({
    homePage,
    header,
    productsPage,
  }) => {
    await homePage.navigateTo('');
    await header.goToProducts();
    await productsPage.verifyProductsPageLoaded();
  });

  test('authenticated user can logout (session ends)', async ({
    authenticatedPage,
    header,
  }) => {
    await authenticatedPage.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(header.loggedInIndicator()).toBeVisible();

    await header.logout();

    await expect(header.signupLoginLink).toBeVisible();
    await expect(authenticatedPage).toHaveURL(/login/);
  });
});
