# QA Automation

Playwright tests for [Automation Exercise](https://automationexercise.com).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Set `EMAIL`, `PASSWORD`, and `USER_NAME` in `.env` for a registered account, or create one:

```bash
npm run bootstrap
```

## Run tests

```bash
npm test
npm run test:ui
npm run test:auth
```

`test:auth` logs in through the API, writes `auth/user.json`, and opens `authenticatedPage` with that session.

## CI

GitHub Actions bootstraps credentials (uses `TEST_EMAIL` / `TEST_PASSWORD` / `TEST_USER_NAME` if those secrets exist) and runs the suite.
