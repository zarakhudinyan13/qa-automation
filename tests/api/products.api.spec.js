import { test, expect } from '../../fixtures/test.fixtures.js';
import testData from '../../data/testData.js';
import { API_CODES } from '../../data/constants.js';

test.describe('Products API', () => {
  test('GET productsList returns all products', async ({ productsAPI }) => {
    const { response, body } = await productsAPI.getAllProducts();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.ok);
    expect(body.products).toBeDefined();
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('POST productsList returns 405 method not allowed', async ({ productsAPI }) => {
    const { response, body } = await productsAPI.postToProductsList();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.methodNotAllowed);
  });

  test('POST searchProduct returns matching products', async ({ productsAPI }) => {
    const { response, body } = await productsAPI.searchProduct(testData.searchTerms.top);

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.ok);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('POST searchProduct without parameter returns 400', async ({ productsAPI }) => {
    const { response, body } = await productsAPI.searchProductWithoutParam();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.badRequest);
  });
});
