/**
 * AUTHENTICATED UI TESTS
 * ----------------------
 * These tests never open the Signup/Login form.
 * Shared session is prepared by:
 *   1) tests/auth/auth.setup.js  → AuthenticationAPI.apiLogin()
 *   2) storage saved to auth/user.json
 *   3) playwright.config.js chromium-auth → storageState
 *   4) fixtures/auth.fixtures.js → authenticatedPage (same tab as `page`)
 *
 * Logout / account deletion use freshSession so they cannot invalidate
 * the shared sessionid used by parallel tests.
 *
 * Use: import { test, expect } from '../../fixtures/auth.fixtures.js'
 */
import { test, expect } from '../../fixtures/auth.fixtures.js';
import { HeaderComponent } from '../../pages/HeaderComponent.js';
import { getEnvCredentials } from '../../utils/helpers.js';

test.describe('Authenticated UI (shared API session)', () => {
  test('authenticatedPage lands already logged in', async ({ authenticatedPage, header }) => {
    const { userName } = getEnvCredentials();

    await authenticatedPage.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(header.loggedInIndicator()).toBeVisible();
    await expect(header.loggedInAs(userName)).toBeVisible();
    await expect(header.logoutLink).toBeVisible();
    await expect(header.signupLoginLink).toHaveCount(0);
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
    await expect(header.loggedInIndicator()).toBeVisible();
  });

  test('authenticated user stays logged in on contact page', async ({
    contactPage,
    header,
  }) => {
    await contactPage.navigateTo('contact_us');
    await contactPage.verifyContactPageLoaded();
    await expect(header.loggedInIndicator()).toBeVisible();
    await expect(header.logoutLink).toBeVisible();
  });
});

test.describe('Authenticated UI (isolated API session)', () => {
  test('isolated authenticated user can logout (session ends)', async ({ freshSession }) => {
    const header = new HeaderComponent(freshSession.page);

    await freshSession.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(header.loggedInAs(freshSession.user.name)).toBeVisible();

    await header.logout();

    await expect(header.signupLoginLink).toBeVisible();
    await expect(freshSession.page).toHaveURL(/login/);
  });
});
