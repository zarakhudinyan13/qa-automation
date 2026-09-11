# Homework: stay logged in, then logout on a fresh user

Home tests are already written. **Do not change them.**

This homework is only about **logged-in sessions**.

We log in through the **API**, not the login form.  
Do **not** click Logout on the shared `.env` user — other tests reuse that session.

Read [AUTHENTICATED_PAGE.md](./AUTHENTICATED_PAGE.md) first if you want the full picture of how `authenticatedPage`, fixtures, and setup fit together.

---

## What you already have

| File | What it is |
| --- | --- |
| `tests/ui/home.spec.js` | Guest Home tests. Leave them as they are. |
| `tests/auth/auth.setup.js` | Logs in the `.env` user through the API and saves cookies to `auth/user.json` |
| `fixtures/auth.fixtures.js` | Fixtures for auth tests: `authenticatedPage`, `header`, `freshSession` |
| `utils/session.js` | Helpers that create a browser context from cookies, or create a brand-new user |
| `tests/auth/authenticated.spec.js` | One test already: home is already logged in |
| `pages/HeaderComponent.js` | Header links: Products, Logout, `loggedInAs(name)` |

There is **no** `isolated-session.spec.js` yet. You will create it.

---

## Before you write any test

Read these three files. Do not skip them.

1. `tests/auth/auth.setup.js`
2. `fixtures/auth.fixtures.js`
3. `utils/session.js`

### How login works in this project

1. Setup posts email/password to the site **API** (not the `/login` form).
2. Playwright saves the `sessionid` cookie into `auth/user.json`.
3. Auth tests open a browser **context** that already has those cookies.
4. The page loads already logged in. The header says `Logged in as <your name>`.

### Two sessions you will use

**Shared session** — fixture `authenticatedPage`

- Uses the account from `.env` (`EMAIL`, `PASSWORD`, `USER_NAME`).
- Setup runs once, then many tests reuse the same cookies.
- Fast. **Do not click Logout. Do not delete this account.**

**Isolated session** — fixture `freshSession`

- Creates a **new** account, own cookies, own context.
- After the test, `cleanup()` deletes that account.
- Use this when the test would break the shared user (logout, delete account, …).

---

## Rules

1. Import auth tests from `../../fixtures/auth.fixtures.js` (not `test.fixtures.js`).
2. Do not fill the login form just to get into the site.
3. Do not click Logout in `authenticated.spec.js`.
4. Do not edit `tests/ui/home.spec.js`.
5. Use `HeaderComponent` for header clicks and assertions.

---

## Task 1 — Stay logged in

**File:** `tests/auth/authenticated.spec.js`  
**Keep** the existing test `home page is already logged in`.  
**Add one new test** in the same `describe`.

Use the **shared** session: `authenticatedPage` (and `header`).

```js
test('products page stays logged in', async ({ authenticatedPage, header, homePage }) => {
  const { userName } = getEnvCredentials();

  // 1. Open Home
  // 2. Click Products
  // 3. Header still says Logged in as userName
  // 4. Logout link is visible
  // Do not click Logout
});
```

Exact steps:

1. Open Home (same as the existing test: `homePage.navigateTo('')`).
2. Click **Products** in the header (`header.goToProducts()`).
3. Assert the header still says **Logged in as** your `.env` name.
4. Assert **Logout** is still visible.
5. Do **not** click Logout.

Name from `.env`:

```js
const { userName } = getEnvCredentials();
```

Useful locators (already on `header`):

- `header.loggedInAs(userName)`
- `header.logoutLink`
- `header.goToProducts()`

The test is correct when you can go Home → Products and the header still shows your name.

---

## Task 2 — Logout on a fresh user

**Create this file:** `tests/auth/isolated-session.spec.js`

Use **`freshSession` only**. Do not use `authenticatedPage` here.

`header` in the fixtures is bound to the shared `authenticatedPage`. For the fresh user, build a header from that user’s page:

```js
import { test, expect } from '../../fixtures/auth.fixtures.js';
import { HeaderComponent } from '../../pages/HeaderComponent.js';
import { HomePage } from '../../pages/HomePage.js';

test('logout ends on the login page', async ({ freshSession }) => {
  const page = freshSession.page;
  const homePage = new HomePage(page);
  const header = new HeaderComponent(page);

  // 1. Open Home
  // 2. Confirm you are logged in as freshSession.user.name
  // 3. Click Logout (header.logout())
  // 4. You should be on /login
});
```

Exact steps:

1. Open Home on `freshSession.page`.
2. Confirm the header shows `Logged in as` + `freshSession.user.name`.
3. Click **Logout**.
4. Assert the URL is `/login` (for example `toHaveURL(/\/login/)`).
5. Optional extra check: **Signup / Login** is visible again.

`freshSession` already deletes the throwaway account when the test finishes. You do not call `cleanup()` yourself.

---

## What to turn in

1. Your two test changes:
   - one new test in `tests/auth/authenticated.spec.js`
   - new file `tests/auth/isolated-session.spec.js`
2. Command (must be green):

   ```bash
   npm run test:auth
   ```

3. A short written answer (PR comment or chat — not in the test code):

   **Why can’t logout use the shared session?**

   Hint: `auth.setup.js` writes one `sessionid` into `auth/user.json`. `authenticatedPage` reuses that file. What happens to the next test if you kill that cookie?

---

## How to run

```bash
npm install
npx playwright install chromium
cp .env.example .env
# put a real registered EMAIL, PASSWORD, USER_NAME in .env

npm run test:auth
```

`test:auth` runs `setup` first (API login → `auth/user.json`), then every spec under `tests/auth/`.

Guest Home tests are a different command (`npm run test:ui`). You do not need them for this homework.
