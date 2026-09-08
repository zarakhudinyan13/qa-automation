/**
 * AUTHENTICATED UI TESTS
 * ----------------------
 * These tests never open the Signup/Login form.
 * Session is prepared by setup keywords:
 *   1) tests/auth/auth.setup.js  → setupAuthenticatedSession()
 *   2) storage saved to auth/user.json
 *   3) fixtures/auth.fixtures.js → authenticatedPage + authKeywords
 *
 * Use: import { test } from '../../fixtures/auth.fixtures.js'
 */
import { test } from '../../fixtures/auth.fixtures.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import testData from '../../data/testData.js';

test.describe('Authenticated UI (shared API session)', { tag: '@auth' }, () => {
  test('authenticatedPage lands already logged in', async ({ authKeywords }) => {
    const { userName } = getEnvCredentials();

    await authKeywords.setupPage();
    await authKeywords.verifyLoggedIn(userName);
  });

  test('authenticated user can open products and add to cart', async ({ authKeywords }) => {
    await authKeywords.addProductToCartAndOpenCart(testData.products.firstProductId);
  });

  test('authenticated user navigates home → products via header', async ({ authKeywords }) => {
    await authKeywords.setupPage();
    await authKeywords.goToProductsFromHeader();
  });

  test('authenticated user can logout (session ends)', async ({ authKeywords }) => {
    await authKeywords.setupPage();
    await authKeywords.verifyLoggedIn();
    await authKeywords.logout();
    await authKeywords.verifyLoggedOut();
  });
});
