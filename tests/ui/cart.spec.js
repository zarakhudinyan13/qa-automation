import { test, expect } from '../../fixtures/test.fixtures.js';
import testData from '../../data/testData.js';
import { generateUniqueEmail } from '../../utils/dataGenerator.js';

test.describe('Cart Page', () => {
  test('empty cart shows message', async ({ cartPage }) => {
    await cartPage.navigateTo('view_cart');
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartEmpty();
  });

  test('user can remove product from cart', async ({ productsPage, cartPage }) => {
    await productsPage.navigateTo('products');
    await productsPage.addProductToCart(testData.products.firstProductId);
    await productsPage.goToCartFromModal();

    await cartPage.verifyCartNotEmpty();
    const countBefore = await cartPage.getCartItemCount();
    await cartPage.removeProduct(0);
    await cartPage.verifyCartEmpty();
    expect(countBefore).toBeGreaterThan(0);
  });

  test('user can subscribe from cart page footer', async ({ cartPage }) => {
    const email = generateUniqueEmail('cart.subscribe');

    await cartPage.navigateTo('view_cart');
    await cartPage.scrollToFooter();
    await cartPage.subscribe(email);
    await expect(cartPage.subscriptionSuccess).toBeVisible();
  });
});
