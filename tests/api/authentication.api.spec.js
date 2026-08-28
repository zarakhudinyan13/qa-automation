import { test, expect } from '../../fixtures/test.fixtures.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import testData from '../../data/testData.js';
import { API_CODES } from '../../data/constants.js';

test.describe('Authentication API', () => {
  test('POST verifyLogin with valid credentials returns 200', async ({ authAPI }) => {
    const { email, password } = getEnvCredentials();
    const { response, body } = await authAPI.verifyLogin(email, password);

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.ok);
    expect(body.message).toBe('User exists!');
  });

  test('POST verifyLogin with invalid credentials returns 404', async ({ authAPI }) => {
    const { response, body } = await authAPI.verifyLogin(
      testData.invalidUser.email,
      testData.invalidUser.password,
    );

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.notFound);
    expect(body.message).toBe('User not found!');
  });

  test('POST verifyLogin without email returns 400', async ({ authAPI }) => {
    const { password } = getEnvCredentials();
    const response = await authAPI.request.post(
      `${authAPI.baseUrl}/api/verifyLogin`,
      { form: { password } },
    );
    const body = await response.json();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.badRequest);
  });

  test('DELETE verifyLogin returns 405', async ({ authAPI }) => {
    const response = await authAPI.request.delete(`${authAPI.baseUrl}/api/verifyLogin`);
    const body = await response.json();

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.methodNotAllowed);
  });

  test('GET user detail by email returns user data', async ({ authAPI }) => {
    const { email } = getEnvCredentials();
    const { response, body } = await authAPI.getUserDetailByEmail(email);

    expect(response.status()).toBe(API_CODES.ok);
    expect(body.responseCode).toBe(API_CODES.ok);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
  });

  test('apiLogin returns storage state with session cookies', async ({ authAPI }) => {
    const { email, password } = getEnvCredentials();
    const { response, storageState } = await authAPI.apiLogin(email, password);

    expect(response.ok()).toBeTruthy();
    expect(storageState).toBeDefined();
    expect(Array.isArray(storageState.cookies)).toBeTruthy();
    expect(storageState.cookies.length).toBeGreaterThan(0);

    const sessionCookie = storageState.cookies.find((c) => c.name === 'sessionid');
    expect(sessionCookie).toBeDefined();
  });
});
