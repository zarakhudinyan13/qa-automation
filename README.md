# QA Automation

Playwright tests for [Automation Exercise](https://automationexercise.com).

How `authenticatedPage`, fixtures, and setup fit together: [`AUTHENTICATED_PAGE.md`](./AUTHENTICATED_PAGE.md).  
Student homework (stay logged in + logout on a fresh user): [`HOMEWORK.md`](./HOMEWORK.md).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Set `EMAIL`, `PASSWORD`, and `USER_NAME` in `.env` to a registered account.  
`USER_NAME` must match the header after login (`Logged in as ...`).

## How sessions work

This project logs in through the **API**, then opens a browser context that already has cookies. Do not use the login form unless the test is about that form.

| Kind | Fixture | Use it for |
| --- | --- | --- |
| Guest | default `page` | `tests/ui/home.spec.js` — leave these tests as they are |
| Shared | `authenticatedPage` | Fast logged-in checks. Do **not** click Logout. |
| Isolated | `freshSession` | Logout (or anything that would break the shared `.env` user) |

Read before writing auth tests:

- `AUTHENTICATED_PAGE.md`
- `tests/auth/auth.setup.js`
- `fixtures/auth.fixtures.js`
- `utils/session.js`

## Run tests

```bash
npm test              # guest UI + auth
npm run test:ui       # guest Home tests only
npm run test:auth     # setup + authenticated specs (homework command)
```

## CI

Set repository secrets `TEST_EMAIL`, `TEST_PASSWORD`, and `TEST_USER_NAME`. The workflow will not create an account.
