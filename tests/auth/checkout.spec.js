/**
 * AUTHENTICATED CHECKOUT
 * ----------------------
 * Guest users who click Proceed To Checkout see a Register/Login modal.
 * These tests start already logged in (apiSignup → freshSession) so checkout
 * is a real authenticated page — no LoginPage.login().
 */
import { test, expect } from '../../fixtures/auth.fixtures.js';
import { HeaderComponent } from '../../pages/HeaderComponent.js';
import { ProductsPage } from '../../pages/ProductsPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';
import { PaymentPage } from '../../pages/PaymentPage.js';
import testData from '../../data/testData.js';

test.describe('Authenticated checkout (isolated API session)', () => {
  test('logged-in user reaches checkout with address details (no login modal)', async ({
    freshSession,
  }) => {
    const page = freshSession.page;
    const header = new HeaderComponent(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productsPage.navigateTo('products');
    await expect(header.loggedInAs(freshSession.user.name)).toBeVisible();

    await productsPage.addProductToCart(testData.products.firstProductId);
    await productsPage.goToCartFromModal();
    await cartPage.verifyCartPageLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.verifyCheckoutPageLoaded();
    await expect(checkoutPage.checkoutLoginModal).toBeHidden();
    await expect(checkoutPage.deliveryAddress).toContainText(freshSession.user.firstName);
    await expect(checkoutPage.deliveryAddress).toContainText(freshSession.user.address1);
    await expect(checkoutPage.billingAddress).toContainText(freshSession.user.lastName);
  });

  test('logged-in user can place an order from checkout', async ({ freshSession }) => {
    const page = freshSession.page;
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    await productsPage.navigateTo('products');
    await productsPage.addProductToCart(testData.products.firstProductId);
    await productsPage.goToCartFromModal();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutPageLoaded();
    await checkoutPage.placeOrder('Please deliver on a weekday.');

    await paymentPage.verifyPaymentPageLoaded();
    await paymentPage.pay(testData.payment);
    await paymentPage.verifyOrderPlaced();
  });
});
