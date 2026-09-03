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
    const response = await authAPI.request.post(
      `${authAPI.baseUrl}/api/verifyLogin`,
      { form: { password: 'AnyPassword123!' } },
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

  test('apiSignup creates user, logs in, and returns storage state', async ({ authAPI }) => {
    const { user, createBody, loginResponse, storageState } = await authAPI.apiSignup();

    expect(createBody.responseCode).toBe(API_CODES.created);
    expect(createBody.message).toBe('User created!');
    expect(user.email).toContain('@automation.test');
    expect(loginResponse.ok()).toBeTruthy();
    expect(storageState.cookies.find((c) => c.name === 'sessionid')).toBeDefined();

    const { body: deleteBody } = await authAPI.deleteAccount(user.email, user.password);
    expect(deleteBody.responseCode).toBe(API_CODES.ok);
    expect(deleteBody.message).toBe('Account deleted!');
  });
});
