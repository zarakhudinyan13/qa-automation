import fs from 'fs';
import path from 'path';

export function getEnvCredentials() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const userName = process.env.USER_NAME;

  if (!email || !password) {
    throw new Error('EMAIL and PASSWORD must be set in .env file. Copy .env.example and fill in your credentials.');
  }

  return { email, password, userName: userName || 'Test User' };
}

export function ensureUploadFixture() {
  const fixturesDir = path.join(process.cwd(), 'fixtures');
  const filePath = path.join(fixturesDir, 'sample.txt');

  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Sample upload file for contact form test.');
  }

  return filePath;
}

export async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle');
}
