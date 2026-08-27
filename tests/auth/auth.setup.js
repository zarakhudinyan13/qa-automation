import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import path from 'path';

const authFile = path.join(__dirname, '../../auth/user.json');

setup('authenticate registered user', async ({ page }) => {
  const { email, password, userName } = getEnvCredentials();
  const loginPage = new LoginPage(page);

  await loginPage.navigateTo('login');
  await loginPage.login(email, password);

  await expect(page.getByText(/Logged in as/i)).toBeVisible({
    timeout: 15_000,
  });

  await page.context().storageState({ path: authFile });
});
