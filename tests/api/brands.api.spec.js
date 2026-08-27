import { test, expect } from '../../fixtures/test.fixtures.js';
import { API_CODES } from '../../data/constants.js';

test.describe('Brands API', () => {
  test('GET brandsList returns all brands', async ({ brandsAPI }) => {
    const { response, body } = await brandsAPI.getAllBrands();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.ok);
    expect(body.brands).toBeDefined();
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('PUT brandsList returns 405 method not allowed', async ({ brandsAPI }) => {
    const { response, body } = await brandsAPI.putToBrandsList();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.methodNotAllowed);
  });
});
