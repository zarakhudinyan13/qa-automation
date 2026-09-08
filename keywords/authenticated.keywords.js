import { test, expect } from '@playwright/test';

/**
 * TEST KEYWORDS — authenticated page (already logged in)
 * -----------------------------------------------------
 * Bind to authenticatedPage + POM fixtures from fixtures/auth.fixtures.js.
 * Each method is a Playwright test.step (shows as a keyword in the report).
 *
 * Session comes from auth.setup.keywords.js → auth/user.json.
 * Do NOT call LoginPage.login() from these keywords.
 *
 * @param {{ page: import('@playwright/test').Page, header: object, homePage: object, productsPage: object, cartPage: object }} deps
 */
export function createAuthenticatedKeywords({ page, header, homePage, productsPage, cartPage }) {
  async function openAuthenticatedHome() {
    await test.step('Setup authenticated page (open home)', async () => {
      await homePage.navigateTo('');
    });
  }

  return {
    /** Setup keyword: open home on the authenticated tab (no login form). */
    setupPage: openAuthenticatedHome,
    openHome: openAuthenticatedHome,

    async verifyLoggedIn(userName) {
      await test.step('Verify user is already logged in', async () => {
        if (userName) {
          await expect(header.loggedInAs(userName)).toBeVisible();
        } else {
          await expect(header.loggedInIndicator()).toBeVisible();
        }
        await expect(header.logoutLink).toBeVisible();
        await expect(header.signupLoginLink).toHaveCount(0);
      });
    },

    async addProductToCartAndOpenCart(productId) {
      await test.step(`Add product ${productId} to cart and open cart`, async () => {
        await productsPage.navigateTo('products');
        await productsPage.addProductToCart(productId);
        await productsPage.goToCartFromModal();
        await cartPage.verifyCartPageLoaded();
        await expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
        await expect(page.locator('#cart_info_table')).toBeVisible();
      });
    },

    async goToProductsFromHeader() {
      await test.step('Navigate home → products via header', async () => {
        await header.goToProducts();
        await productsPage.verifyProductsPageLoaded();
      });
    },

    async logout() {
      await test.step('Logout authenticated user', async () => {
        await header.logout();
      });
    },

    async verifyLoggedOut() {
      await test.step('Verify session ended (guest header)', async () => {
        await expect(header.signupLoginLink).toBeVisible();
        await expect(page).toHaveURL(/login/);
      });
    },
  };
}
