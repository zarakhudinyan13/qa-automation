# How `authenticatedPage` works

`authenticatedPage` is a **normal Playwright tab that already has login cookies**. Tests that use it never fill the login form. Login happens once over the API, cookies are saved, and the browser reuses them.

## Playwright model

- **browser** — one Chromium process
- **context** — one user session (cookies)
- **page** — one tab inside that context

`authenticatedPage` is that tab. Its context is created from `auth/user.json`, so the site already treats the user as logged in.

The fixture lives in `fixtures/auth.fixtures.js`:

1. `authenticatedContext` opens a browser context with `auth/user.json`
2. `authenticatedPage` opens a new page in that context
3. POM fixtures (`homePage`, `header`) wrap **that** page, not the guest `page`

Auth tests import from the auth fixtures, not the guest ones:

```js
import { test, expect } from '../../fixtures/auth.fixtures.js';
```

Then they can do `authenticatedPage.goto('/')` and immediately assert “Logged in as …”.

**Rule:** UI login is only for tests that **verify the login form**. Logged-in home / products / logout flows use `authenticatedPage` or `freshSession`.

---

## Files we have now

| Area | Files | Role |
| --- | --- | --- |
| Auth fixtures | `fixtures/auth.fixtures.js` | `authenticatedContext`, `authenticatedPage`, `freshSession`, logged-in POM |
| Guest fixtures | `fixtures/test.fixtures.js` | Guest `page` + Home tests + API clients |
| Setup | `tests/auth/auth.setup.js` | API login once → write `auth/user.json` |
| Auth UI tests | `tests/auth/authenticated.spec.js` | Already-logged-in UI (home) |
| Session helpers | `utils/session.js` | `createAuthenticatedContext`, `createUserSession` |
| API login | `api/AuthenticationAPI.js` | `apiLogin` / `apiSignup` return `storageState` |
| Credentials | `.env` (from `.env.example`) | `EMAIL`, `PASSWORD`, `USER_NAME` |
| Storage | `auth/user.json` | Saved cookies (gitignored, created by setup) |
| Config | `playwright.config.js` | `setup` → then `chromium-auth` |
| Guest UI | `tests/ui/home.spec.js` | Guest Home tests — leave them as they are |
| POM | `pages/HomePage.js`, `pages/HeaderComponent.js` | Page objects |

---

## Setup + test flow

```
.env credentials
        ↓
auth.setup.js  →  AuthenticationAPI.apiLogin(EMAIL, PASSWORD)
        ↓
auth/user.json  (cookies / storageState)
        ↓
auth.fixtures.js  →  authenticatedContext + authenticatedPage
        ↓
authenticated.spec.js  (UI already logged in)
```

### 1. One-time local setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # EMAIL, PASSWORD, USER_NAME
```

### 2. Setup project (runs first)

`chromium-auth` depends on `setup`. Setup:

- reads `EMAIL` / `PASSWORD`
- POSTs to `/login` (with CSRF)
- writes cookies to `auth/user.json`

No browser UI in this step.

### 3. Auth UI tests

Each test gets a fresh tab with those cookies. The existing test in `authenticated.spec.js` lands already logged in.

### 4. Commands

```bash
npm run test:auth          # setup + authenticatedPage UI
npm run auth:setup         # only write auth/user.json
npm run test:ui            # guest Home tests
npm test                   # everything
```

---

## Two other auth patterns (not `authenticatedPage`)

**Shared user (the `authenticatedPage` path):** one registered account from `.env`, reused across auth tests. Fast. Do not log this user out.

**Fresh user per test:** `freshSession` (built on `createUserSession(browser)` in `utils/session.js`) — API signup, isolated context, then `cleanup()` deletes the account.

---

## Why fixtures exist

A fixture is **setup + teardown that Playwright injects by argument name**.

Built-in examples you already use without noticing:

```js
test('example', async ({ page, browser, request }) => {
```

You never created `page`. Playwright saw the name `page`, ran its built-in fixture, and passed you a tab.

Custom fixtures work the same way. This:

```js
export const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
```

means: if a test asks for `{ homePage }`, Playwright:

1. Creates a `page`
2. Wraps it in `HomePage`
3. Gives that object to the test
4. After the test, cleans up

**Why fixtures exist:** so tests stay short. The test describes *what to check*, not “create POM, log in, open a tab, close the context.”

---

## Why there are two fixture files (guest vs auth)

There are two different kinds of UI tests:

| Kind | Needs | Import |
| --- | --- | --- |
| Guest / Home **without** cookies | a blank browser | `fixtures/test.fixtures.js` |
| Already logged in | cookies already present | `fixtures/auth.fixtures.js` |

Guest `test` wraps Playwright’s built-in `page` (not logged in):

```js
export const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
});
```

Auth `test` **extends that guest `test`**, then **overrides** the POM so it uses a logged-in tab instead:

```js
export const test = base.extend({
  authenticatedContext: async ({ browser }, use) => {
    const context = await createAuthenticatedContext(browser, AUTH_FILE);
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
  },

  homePage: async ({ authenticatedPage }, use) => {
    await use(new HomePage(authenticatedPage));
  },
  header: async ({ authenticatedPage }, use) => {
    await use(new HeaderComponent(authenticatedPage));
  },
});
```

That override is the important part:

- Guest: `homePage` → guest `page`
- Auth: `homePage` → `authenticatedPage`

Same fixture **name**, different tab. A test that writes `{ homePage }` gets the logged-in version **only because it imported the auth `test`**.

---

## The `test` keyword is not a special “setup keyword”

`test` is just a function. You can rename it.

In setup:

```js
import { test as setup } from '@playwright/test';

setup('authenticate via API', async ({ request }) => {
```

That is still `test()`. They renamed it to `setup` so the file reads like “this is preparation,” not a product assertion. Playwright still runs it as a test in the `setup` **project**.

In auth specs:

```js
import { test, expect } from '../../fixtures/auth.fixtures.js';
```

This is **not** Playwright’s default `test`. It is the **extended** one from `auth.fixtures.js`.

Chain:

```
@playwright/test  →  test.fixtures.js  →  auth.fixtures.js
     built-in           guest POM            + authenticatedPage
     page, browser                           + POM rebound to that page
```

`test.extend()` copies the previous `test` and **adds/overrides fixtures**. That is the “merge.” It is fixture inheritance, not Playwright turning `test` into `setup`.

When you write:

```js
test('home page is already logged in', async ({ authenticatedPage, header }) => {
```

Playwright looks at the **parameter names** and runs those fixtures **before** the test body:

1. `authenticatedContext` — new browser context loaded with `auth/user.json`
2. `authenticatedPage` — new tab in that context
3. `header` — `new HeaderComponent(authenticatedPage)` (the override)

Only then does your test body run. The page is already logged in because the **context was created with cookies**, not because `test` and `setup` fused.

If this spec imported `test` from `test.fixtures.js` instead, `{ header }` would wrap the **guest** `page`. Same `test(` syntax, different fixture bag.

---

## Why authentication exists (and why it is API, not UI)

Logging in through the login form is **slow**. For home / products / logout-as-logged-in-user, you only need a **session**. Cookies are enough.

So authentication is split:

**A. Once per run (setup project)** — get cookies

```
auth.setup.js
  → API login with EMAIL/PASSWORD
  → write auth/user.json
```

Config says auth UI tests **cannot start until that file exists**:

```js
{
  name: 'chromium-auth',
  use: { ...devices['Desktop Chrome'] },
  testMatch: /tests\/auth\/.*\.spec\.js/,
  dependencies: ['setup'],
},
```

`dependencies: ['setup']` is the only link. Setup writes a file. Auth tests read that file. They are not the same `test` object.

**B. Once per test (auth fixtures)** — put those cookies in a browser

```
createAuthenticatedContext(browser, AUTH_FILE)
  → context with cookies
  → authenticatedPage = a tab in that context
```

The site sees the cookies and treats the user as logged in. The test never opens `/login`.

---

## What you are seeing vs what is actually happening

It **looks like** `test` became authenticated because there is no login in the test. Playwright still did work **before** that function ran:

| When | What | Mechanism |
| --- | --- | --- |
| Once before the auth project | API login → `auth/user.json` | **Project** named `setup` + `dependencies` |
| Every auth test | Context + tab with those cookies | **Fixtures** on the extended `test` |
| Inside the test | Assertions | Your test body |

`test as setup` is a rename.  
`test.extend()` is how fixtures stack.  
`({ authenticatedPage })` is how Playwright knows to run the logged-in setup.

The test is not “already authenticated” because `test` merged with `setup`. It is authenticated because **this file imported the auth `test`**, asked for `authenticatedPage`, and that fixture loaded cookies that **setup already wrote to disk**.
