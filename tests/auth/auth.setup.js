import { test as setup } from '@playwright/test';
import { AuthenticationAPI } from '../../api/AuthenticationAPI.js';
import { getEnvCredentials } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../../auth/user.json');

setup('authenticate registered user', async ({ request }) => {
  const { email, password } = getEnvCredentials();
  const authAPI = new AuthenticationAPI(request);

  const { response, storageState } = await authAPI.apiLogin(email, password);

  if (!response.ok()) {
    throw new Error(`API login failed with status ${response.status()}`);
  }

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
});
