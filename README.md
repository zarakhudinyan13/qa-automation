# QA Automation

Playwright tests for [Automation Exercise](https://automationexercise.com).

Homework for authenticated sessions is in [`HOMEWORK.md`](./HOMEWORK.md). Read that before adding auth tests.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Set `EMAIL`, `PASSWORD`, and `USER_NAME` in `.env` to a registered account.  
`USER_NAME` must match the name shown in the header after login (`Logged in as ...`).

## How sessions work

In Playwright:

- **browser** = Chrome
- **context** = one person’s cookies (the session)
- **page** = one tab

This project logs in through the **API**, saves cookies, then opens a context that is already signed in. Do not use the login form unless the test is about the form itself.

| Kind | How it is built | Fixture / helper | Use it for |
| --- | --- | --- | --- |
| Guest | No cookies | default `page` | `tests/ui/home.spec.js` |
| Shared | `.env` user → `auth/user.json` | `authenticatedPage` | Fast logged-in checks. Do not logout or delete this user. |
| Isolated | New account, own context | `freshSession` or `createUserSession` | Logout, checkout, two users. Call `cleanup()` (automatic on `freshSession`). |

Two people = one browser, two contexts.

Read:

- `tests/auth/auth.setup.js`
- `fixtures/auth.fixtures.js`
- `utils/session.js`

## Run tests

```bash
npm test              # guest UI + auth (auth depends on setup)
npm run test:ui       # guest UI only
npm run test:auth     # setup + authenticated specs
```

## CI

Set repository secrets `TEST_EMAIL`, `TEST_PASSWORD`, and `TEST_USER_NAME`. The workflow will not create an account.
