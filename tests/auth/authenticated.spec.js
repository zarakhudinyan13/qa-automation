/**
 * Shared-session tests (authenticatedPage).
 * Keep the home test. Add Products, Cart, and Contact here (HOMEWORK.md Part A).
 * Do not click Logout in this file.
 */
import { test, expect } from '../../fixtures/auth.fixtures.js';
import { getEnvCredentials } from '../../utils/helpers.js';

test.describe('Authenticated home', () => {
  test('home page is already logged in', async ({ authenticatedPage, header, homePage }) => {
    const { userName } = getEnvCredentials();

    await homePage.navigateTo('');

    await expect(authenticatedPage).toHaveURL(/automationexercise\.com\/?$/);
    await homePage.verifyHomePageLoaded();
    await expect(header.loggedInIndicator()).toBeVisible();
    await expect(header.loggedInAs(userName)).toBeVisible();
    await expect(header.logoutLink).toBeVisible();
    await expect(header.signupLoginLink).toHaveCount(0);
  });
});
