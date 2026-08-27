import { test, expect } from '../../fixtures/test.fixtures.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import { generateUniqueEmail } from '../../utils/dataGenerator.js';

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateTo('');
  });

  test('home page loads successfully', async ({ homePage }) => {
    await homePage.verifyHomePageLoaded();
    await expect(homePage.heroText).toBeVisible();
  });

  test('navigation links are visible', async ({ header }) => {
    await expect(header.homeLink).toBeVisible();
    await expect(header.productsLink).toBeVisible();
    await expect(header.cartLink).toBeVisible();
    await expect(header.signupLoginLink).toBeVisible();
    await expect(header.contactUsLink).toBeVisible();
  });

  test('user can subscribe from home page footer', async ({ homePage }) => {
    const email = generateUniqueEmail('subscribe');

    await homePage.scrollToFooter();
    await expect(homePage.subscriptionHeading).toBeVisible();
    await homePage.subscribe(email);
    await expect(homePage.subscriptionSuccess).toBeVisible();
  });

  test('scroll up button returns to top of page', async ({ homePage }) => {
    await homePage.scrollToFooter();
    await expect(homePage.subscriptionHeading).toBeVisible();
    await homePage.clickScrollUp();
    await expect(homePage.heroText).toBeVisible();
  });
});

test.describe('Logout', () => {
  test('logged in user can logout', async ({ loginPage, header, page }) => {
    const { email, password } = getEnvCredentials();

    await loginPage.navigateTo('login');
    await loginPage.login(email, password);
    await header.logout();

    await expect(header.signupLoginLink).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });
});
