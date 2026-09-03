/**
 * Ensures EMAIL / PASSWORD / USER_NAME exist for CI and local runs.
 *
 * Priority:
 * 1) Existing env (GitHub secrets or exported vars)
 * 2) Create a fresh account via Automation Exercise API
 *
 * Writes:
 * - .env (picked up by playwright.config.js dotenv)
 * - prints KEY=value lines for `>> $GITHUB_ENV` when used in Actions
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || 'https://automationexercise.com').replace(/\/$/, '');

function writeEnvFile({ email, password, userName }) {
  const content = [
    `BASE_URL=${BASE_URL}`,
    `EMAIL=${email}`,
    `PASSWORD=${password}`,
    `USER_NAME=${userName}`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(process.cwd(), '.env'), content, 'utf8');
}

function emitGithubEnv({ email, password, userName }) {
  // GitHub Actions: append to GITHUB_ENV when present
  const lines = [
    `BASE_URL=${BASE_URL}`,
    `EMAIL=${email}`,
    `PASSWORD=${password}`,
    `USER_NAME=${userName}`,
  ];

  if (process.env.GITHUB_ENV) {
    fs.appendFileSync(process.env.GITHUB_ENV, `${lines.join('\n')}\n`);
  }

  for (const line of lines) {
    console.log(line);
  }
}

async function createAccountViaApi() {
  const ts = Date.now();
  const user = {
    name: `CI User ${ts}`,
    email: `ci.user.${ts}@automation.test`,
    password: 'Password123!',
    title: 'Mr',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1990',
    firstname: 'CI',
    lastname: `Runner${ts}`,
    company: 'QA Automation',
    address1: '1 Test Street',
    address2: 'Suite CI',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile_number: '1234567890',
  };

  const body = new URLSearchParams(user);
  const response = await fetch(`${BASE_URL}/api/createAccount`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const json = await response.json();
  if (json.responseCode !== 201) {
    throw new Error(`Failed to create CI user: ${JSON.stringify(json)}`);
  }

  return {
    email: user.email,
    password: user.password,
    userName: user.name,
  };
}

async function main() {
  let credentials;

  if (process.env.EMAIL && process.env.PASSWORD) {
    credentials = {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      userName: process.env.USER_NAME || 'Test User',
    };
    console.log('Using existing EMAIL/PASSWORD from environment.');
  } else {
    console.log('No EMAIL/PASSWORD set — creating a fresh test user via API...');
    credentials = await createAccountViaApi();
    console.log(`Created user: ${credentials.email}`);
  }

  writeEnvFile(credentials);
  emitGithubEnv(credentials);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
