# QA Automation — Playwright Course Project

Complete Playwright (JavaScript) automation framework for [Automation Exercise](https://automationexercise.com) — the practice site used throughout the 16-lesson course.

## Project Structure

```
qa-automation/
├── api/                    # Reusable API clients (apiLogin, apiSignup, ...)
├── auth/                   # Shared storage state from setup (gitignored)
├── data/                   # Test data and constants
├── fixtures/
│   ├── test.fixtures.js    # Guest pages (no session)
│   └── auth.fixtures.js    # authenticatedPage + POM on API session
├── pages/                  # Page Object Model
├── tests/
│   ├── api/                # Pure API tests
│   ├── auth/               # Shared session UI (NO UI login)
│   ├── examples/           # Student demos: browser / context / 2 users
│   └── ui/                 # Guest UI + login/signup FORM checks
├── utils/
│   ├── session.js          # createAuthenticatedContext, createUserSession
│   ├── dataGenerator.js
│   └── helpers.js
└── playwright.config.js
```

## Auth rule (read this first)

| Goal | How | Import |
|------|-----|--------|
| Test the **login form** | UI only — `LoginPage.login()` | `fixtures/test.fixtures.js` |
| Test the **signup forms** | UI only — `startSignup` + `SignupPage` | `fixtures/test.fixtures.js` |
| UI test where user is **already logged in** | `apiLogin` / `apiSignup` → storage → `authenticatedPage` | `fixtures/auth.fixtures.js` |
| **Two users** at once | One `browser`, two `context`s, each with its own storage | `utils/session.js` + `tests/examples/` |

**Do not** call `LoginPage.login()` as a precondition for cart/home/authenticated flows.  
Use API session + `authenticatedPage` instead.

### Hierarchy (students)

```
browser   → one Chromium process
context   → one user session (cookies) — isolated from other contexts
page      → one tab inside that context  (= authenticatedPage)
```

### Shared registered user (fast)

1. `auth.setup.js` → `AuthenticationAPI.apiLogin(EMAIL, PASSWORD)`  
2. Saves `auth/user.json`  
3. Auth fixtures open `authenticatedContext` + `authenticatedPage` with that file  

### Fresh user per test

```js
const session = await createUserSession(browser); // isolated API + browser context
// session.page is already logged in — bind POM: new HomePage(session.page)
await session.cleanup(); // deleteAccount + close context
```

### Two users in parallel

See `tests/examples/multi-user-contexts.spec.js`:

1. `createAuthAPI()` twice (isolated API request contexts)  
2. `apiSignup()` in `Promise.all`  
3. `browser.newContext({ storageState })` twice  
4. Act on both pages in parallel — cookies never mix  

## Quick Start

```bash
npm install
npx playwright install
cp .env.example .env   # set EMAIL, PASSWORD, USER_NAME
npm test
```

```bash
npm run test:ui         # guest UI + login/signup forms
npm run test:api        # API only
npm run test:auth       # setup + authenticatedPage UI
npm run test:examples   # browser/context multi-user lesson
```

## Course Lesson Mapping

| Lesson | Topic | Project Location |
|--------|-------|------------------|
| 1–3 | Intro, setup, first test | `playwright.config.js`, `tests/ui/` |
| 4–6 | Locators, elements, assertions | `pages/*.js` |
| 7–8 | Dynamic content, advanced UI | `pages/ProductsPage.js` |
| 9 | Forms | `pages/ContactPage.js`, `pages/SignupPage.js` |
| 10 | Page Object Model | `pages/` |
| 11 | Test data & utilities | `data/`, `utils/` |
| 12 | API testing | `api/`, `tests/api/` |
| 13–14 | Auth, sessions, multi-user | `fixtures/auth.fixtures.js`, `tests/auth/`, `tests/examples/` |
| 15 | Debugging & reporting | config trace / screenshot / video |
| 16 | CI/CD | `.github/workflows/playwright.yml` |

## GitHub Actions Secrets

| Secret | Description |
|--------|-------------|
| `TEST_EMAIL` | Registered user email |
| `TEST_PASSWORD` | Registered user password |
| `TEST_USER_NAME` | Display name after login |

## Adding New Tests

- **Guest UI** → `tests/ui/` + `test.fixtures.js`  
- **Logged-in UI** → `tests/auth/` + `auth.fixtures.js` (`authenticatedPage`)  
- **API** → `tests/api/` + `authAPI` / `productsAPI` fixtures  
- **Multi-user** → `createUserSession(browser, request)` or copy the examples spec  
