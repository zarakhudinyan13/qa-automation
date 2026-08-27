import { test, expect } from '../../fixtures/test.fixtures.js';
import { generateUser } from '../../utils/dataGenerator.js';
import { getEnvCredentials } from '../../utils/helpers.js';

test.describe('Signup Flow', () => {
  test('user can register and delete account via UI', async ({
    loginPage,
    signupPage,
    header,
    page,
  }) => {
    const user = generateUser();

    await loginPage.navigateTo('login');
    await loginPage.assertSignupFormVisible();
    await loginPage.startSignup(user.name, user.email);

    await expect(page.getByText(/Enter Account Information/i)).toBeVisible();
    await signupPage.fillAccountInformation(user);
    await signupPage.createAccount();
    await signupPage.verifyAccountCreated();
    await signupPage.continueAfterSignup();

    await expect(header.loggedInAs(user.name)).toBeVisible({ timeout: 15_000 });

    await header.deleteAccount();
    await signupPage.verifyAccountDeleted();
    await signupPage.continueAfterSignup();
  });

  test('signup with existing email shows error', async ({ loginPage }) => {
    const { email } = getEnvCredentials();

    await loginPage.navigateTo('login');
    await loginPage.startSignup('Existing User', email);
    await loginPage.assertExistingEmailErrorVisible();
  });
});
