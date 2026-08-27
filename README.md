# QA Automation — Playwright Course Project

Complete Playwright (JavaScript) automation framework for [Automation Exercise](https://automationexercise.com) — the practice site used throughout the 16-lesson course.

## Project Structure

```
qa-automation/
├── api/                    # Reusable API client classes
├── auth/                   # Saved storage state (generated, gitignored)
├── data/                   # Test data and constants
├── fixtures/               # Custom Playwright fixtures (POM + API)
├── pages/                  # Page Object Model classes
├── tests/
│   ├── api/                # API tests (Lessons 12)
│   ├── auth/               # Auth setup + session reuse (Lessons 13–14)
│   └── ui/                 # UI tests (Lessons 3–11)
├── utils/                  # Helpers and data generators
├── .env.example            # Environment template
└── playwright.config.js
```

## Quick Start

### 1. Install dependencies

```bash
npm install
npx playwright install
```

### 2. Configure environment

Copy `.env.example` to `.env` and add your registered user credentials:

```bash
cp .env.example .env
```

```env
BASE_URL=https://automationexercise.com
EMAIL=your.email@example.com
PASSWORD=YourPassword123
USER_NAME=Your Signup Name
```

> **Important:** Register a free account at [automationexercise.com/signup](https://automationexercise.com/signup) before running login/auth tests.

### 3. Run tests

```bash
# All tests
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Authenticated session tests
npm run test:auth

# Headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# Open HTML report
npm run report
```

## Course Lesson Mapping

| Lesson | Topic | Project Location |
|--------|-------|------------------|
| 1–3 | Intro, setup, first test | `playwright.config.js`, `tests/ui/` |
| 4–6 | Locators, elements, assertions | `pages/*.js`, all UI specs |
| 7–8 | Dynamic content, advanced UI | `pages/ProductsPage.js`, hover/cart flows |
| 9 | Forms | `pages/ContactPage.js`, `pages/SignupPage.js` |
| 10 | Page Object Model | `pages/` directory |
| 11 | Test data & utilities | `data/`, `utils/` |
| 12 | API testing | `api/`, `tests/api/` |
| 13–14 | Auth & sessions | `tests/auth/`, `auth/user.json` |
| 15 | Debugging & reporting | trace, screenshot, video in config |
| 16 | CI/CD | `.github/workflows/playwright.yml` |

## Test Coverage

### UI Tests
- Login (valid / invalid credentials)
- Home page & navigation
- Products (search, add to cart, product details)
- Cart (empty state, remove items, subscription)
- Contact form (with file upload)
- Signup & delete account flow

### API Tests
- Authentication (`verifyLogin`, UI login cookies)
- Products (`productsList`, `searchProduct`)
- Brands (`brandsList`)

### Authenticated Tests
- Reuses saved session via `storageState`
- Cart and navigation while logged in

## Best Practices Used

- **Page Object Model** — locators and actions separated in page classes
- **Custom fixtures** — inject pages and API clients into tests
- **Stable locators** — `data-qa` attributes where available, `getByRole`/`getByText` elsewhere
- **No hardcoded credentials** — all secrets in `.env`
- **Reusable API layer** — shared `BaseAPI` with typed response helpers
- **Dynamic test data** — `generateUser()` for signup tests
- **Auth setup project** — login once, reuse session across tests
- **CI-ready** — GitHub Actions with secret-based credentials

## GitHub Actions Secrets

For CI, add these repository secrets:

| Secret | Description |
|--------|-------------|
| `TEST_EMAIL` | Registered user email |
| `TEST_PASSWORD` | Registered user password |
| `TEST_USER_NAME` | Display name shown after login |

## Adding New Tests

1. Add locators/actions to the relevant page class in `pages/`
2. Add test data to `data/testData.js` if needed
3. Write the spec in `tests/ui/` or `tests/api/`
4. Use fixtures: `import { test, expect } from '../../fixtures/test.fixtures.js'`
