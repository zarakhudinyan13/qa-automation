import { test, expect } from '../../fixtures/test.fixtures.js';
import testData from '../../data/testData.js';

test.describe('Products Page', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.navigateTo('products');
  });

  test('products page loads with product list', async ({ productsPage }) => {
    await productsPage.verifyProductsPageLoaded();
    await expect(await productsPage.getProductCount()).toBeGreaterThan(0);
  });

  test('user can search for products', async ({ productsPage }) => {
    await productsPage.searchProduct(testData.searchTerms.top);
    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(await productsPage.getProductCount()).toBeGreaterThan(0);
  });

  test('user can add product to cart', async ({ productsPage }) => {
    await productsPage.addProductToCart(testData.products.firstProductId);
    await expect(productsPage.addedToCartMessage).toBeVisible();
  });

  test('user can add multiple products to cart', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(testData.products.firstProductId);
    await productsPage.continueShopping();
    await productsPage.addProductToCart(testData.products.secondProductId);
    await productsPage.goToCartFromModal();

    await cartPage.verifyCartPageLoaded();
    await expect(await cartPage.getCartItemCount()).toBeGreaterThanOrEqual(2);
  });

  test('user can view product details', async ({ productsPage, productDetailsPage }) => {
    await productsPage.openFirstProductDetails();
    await productDetailsPage.verifyProductDetailsVisible();
    await expect(productDetailsPage.writeReviewHeading).toBeVisible();
  });
});
