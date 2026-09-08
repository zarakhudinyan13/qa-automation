# QA Automation

Playwright tests for [Automation Exercise](https://automationexercise.com).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Set `EMAIL`, `PASSWORD`, and `USER_NAME` in `.env` to a registered account.

## Run tests

```bash
npm test
npm run test:ui
npm run test:auth
```

`test:auth` logs in through the API, writes `auth/user.json`, and opens `authenticatedPage` with that session.

## CI

Set repository secrets `TEST_EMAIL`, `TEST_PASSWORD`, and `TEST_USER_NAME`. The workflow will not create an account.
