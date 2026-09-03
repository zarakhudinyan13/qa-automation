/**
 * LOGIN FORM UI TESTS (the ONLY place UI login is intentional)
 * -----------------------------------------------------------
 * These tests VERIFY the login page works (valid / invalid credentials, fields).
 *
 * For every other "user is logged in" UI scenario:
 *   → use fixtures/auth.fixtures.js (authenticatedPage)
 *   → session from AuthenticationAPI.apiLogin / apiSignup — NOT LoginPage.login()
 */
import { test, expect } from '../../fixtures/test.fixtures.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import testData from '../../data/testData.js';

test.describe('Login form - UI only', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo('login');
  });

  test('registered user can login successfully via UI form', async ({ loginPage, header, page }) => {
    const { email, password } = getEnvCredentials();

    await loginPage.assertLoginFormVisible();
    await loginPage.login(email, password);

    await expect(header.loggedInIndicator()).toBeVisible();
    await expect(page).toHaveURL(/automationexercise\.com\/?$/);
  });

  test('user cannot login with invalid email', async ({ loginPage }) => {
    const { password } = getEnvCredentials();

    await loginPage.login(testData.invalidUser.email, password);
    await loginPage.assertLoginErrorVisible();
  });

  test('user cannot login with invalid password', async ({ loginPage }) => {
    const { email } = getEnvCredentials();

    await loginPage.login(email, testData.invalidUser.password);
    await loginPage.assertLoginErrorVisible();
  });

  test('login form fields are visible and enabled', async ({ loginPage }) => {
    await loginPage.assertLoginFormVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});
