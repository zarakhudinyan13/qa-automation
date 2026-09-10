# Homework: Authenticated sessions

You already have guest home tests. This homework is about **being logged in without using the login form**.

Read this whole file before you write code.

---

## 1. How Playwright models a browser

Memorize this. You will use it in every task.

| Piece | Think of it as | In this project |
| --- | --- | --- |
| **browser** | Chrome itself | One Chromium process |
| **context** | One person’s session | Own cookies. This is the login. |
| **page** | One tab | Home, Products, Cart, Contact, Checkout |

Two people on the same computer = **one browser, two contexts**.  
Cookies do not cross from one context to the other. That is why each header can show a different name at the same time.

---

## 2. How this repo logs you in

We do **not** type email/password into the Signup / Login page unless the test is *about* that form.

The flow is:

1. Log in through the **API**.
2. Save cookies (`sessionid`) to a storage file.
3. Open a **context** that already has those cookies.
4. Open a **page** (tab) inside that context. The site already thinks you are logged in.

**Read these three files. Do not skip them.**

- `tests/auth/auth.setup.js` — API login for the `.env` user; writes `auth/user.json`
- `fixtures/auth.fixtures.js` — fixtures you import in auth tests
- `utils/session.js` — helpers that create a context from cookies, or create a brand-new user

Guest tests (`tests/ui/home.spec.js`) use a context with **no cookies**. That is correct. Leave them alone.

---

## 3. Two kinds of logged-in session

### Shared session (fast, reused)

```
.env user  →  auth.setup.js  →  auth/user.json  →  authenticatedPage
```

- One registered account from your `.env` (`EMAIL`, `PASSWORD`, `USER_NAME`).
- Setup runs once, then many tests reuse the same `sessionid`.
- Fixture: **`authenticatedPage`**.
- **Do not click Logout. Do not delete this account.** Other tests (and classmates on CI) reuse it.

### Isolated session (your own throwaway user)

```
apiSignup  →  new context  →  freshSession or createUserSession  →  cleanup()
```

- New account, own cookies, own context.
- Fixture **`freshSession`**: one user, and `cleanup()` deletes the account when the test ends.
- Helper **`createUserSession`**: you create users yourself (needed for two users). You must call `cleanup()` on each.

Use isolated sessions for logout, checkout, and anything that would break the shared `.env` user.

---

## 4. Rules

1. Import auth tests from `../../fixtures/auth.fixtures.js` (not the guest fixtures).
2. Do **not** use the login form as a precondition. No `LoginPage.login()`, no filling `#form` on `/login` just to “get in”.
3. Do **not** log out or delete the shared `.env` user.
4. Guest home tests stay as they are. Do not give them cookies.
5. Follow the Page Object pattern already used by `HomePage` and `HeaderComponent`.

---

## 5. What is already done

You do **not** rewrite this.

| Already in the repo | What it does |
| --- | --- |
| `tests/ui/home.spec.js` | Guest home (no cookies) |
| `tests/auth/auth.setup.js` | API login → `auth/user.json` |
| `tests/auth/authenticated.spec.js` | One test: home is already logged in |
| `authenticatedPage` | Shared `.env` session |
| `freshSession` | New user + auto `cleanup()` |
| `createUserSession(browser, overrides)` | New user when you need more than one |
| `HeaderComponent` | Home / Products / Cart / Contact / Logout / `loggedInAs(name)` |

`npm run test:auth` should already pass with that one logged-in home test.

---

## 6. What you build

### Part A — shared session, stay logged in

**Keep** the existing test `home page is already logged in`.

Add tests that use **`authenticatedPage`** (the shared `.env` user) for:

1. **Products** (`/products`)
2. **Cart** (`/view_cart`)
3. **Contact** (`/contact_us`)

On every one of those pages:

- The header still shows **Logged in as** plus `USER_NAME` from `.env`.
- **Logout** is visible.
- **Signup / Login** is not visible.
- You did **not** click Logout.

How you get there:

- Use the header links, or `navigateTo(...)` on a page object. Either is fine.
- For Cart, you may add a product from Products first, then open Cart. An empty cart is also fine as long as you are on `/view_cart` and still logged in.

**Create page objects** (same style as `HomePage.js`):

- `pages/ProductsPage.js`
- `pages/CartPage.js`
- `pages/ContactPage.js`

Wire them as fixtures on `authenticatedPage` in `fixtures/auth.fixtures.js` if that keeps tests clean. Instantiating them in the spec with `new ProductsPage(authenticatedPage)` is also acceptable.

Suggested spec: keep Part A in `tests/auth/authenticated.spec.js`.

---

### Part B — isolated session: logout, then checkout

Use **`freshSession`** only. Do **not** use `authenticatedPage` here.

Write **two** tests (same spec file is fine):

**B1. Logout**

1. Open home with `freshSession.page`.
2. Header shows `Logged in as` + `freshSession.user.name`.
3. Click **Logout**.
4. You land on the login page (`/login`).
5. **Signup / Login** is visible. **Logged in as** is gone.

**B2. Add to cart → checkout (logged-in checkout, not the guest popup)**

On this site, a **guest** who clicks Proceed To Checkout gets a **Register / Login** popup and does **not** go to `/checkout`.

A **logged-in** user must go to **`/checkout`**. The guest popup must **not** appear.

Steps:

1. Start from `freshSession` (already signed in).
2. Open Products, add a product to the cart, open Cart.
3. Click **Proceed To Checkout**.
4. URL contains `/checkout`.
5. Checkout content is visible (address details / review order).
6. The guest checkout popup (`#checkoutModal`) is **not** shown.

You will need `pages/CheckoutPage.js` (and Cart/Products from Part A).

You do **not** need to finish payment. Stop at checkout.

Suggested spec: `tests/auth/isolated-session.spec.js`.

---

### Part C — two users, two contexts, both homes at once

**One test. Two users. Two contexts. Both home pages open at the same time.**

1. Create two users with `createUserSession` (different `name` on each).

   The **fixture** already has `browser` bound:

   `const userA = await createUserSession({ name: 'Ada West' });`

   If you import the helper from `utils/session.js` instead, pass browser first:

   `const userA = await createUserSession(browser, { name: 'Ada West' });`

   Either way you get `{ user, page, context, cleanup }`.
2. Same **browser**, two **contexts**, one **page** per user. Each helper call already created a context and a page.
3. Open **both** homes (you can use `Promise.all` so they are open together).
4. User A’s header shows **only** A’s name. User B’s header shows **only** B’s name.
   - A must not show B’s name.
   - B must not show A’s name.
5. Call **`cleanup()`** on **both** sessions (this deletes both accounts). Use `try/finally` so cleanup still runs if an assertion fails.

Do **not** use the shared `.env` user for this test.

Suggested spec: `tests/auth/two-users.spec.js`.

---

## 7. What to turn in

1. New page objects + specs (Parts A–C).
2. `npm run test:auth` — all green (setup + shared-session tests).
3. The two-user test — green.
4. A few lines (in the PR / homework comment, not in production code) answering:

   **Why can’t logout use the shared session?**

   Read section 8, then write it in your own words.

---

## 8. Why logout cannot use the shared session

Read this, then write your own short answer.

The shared session is **one** `sessionid` saved in `auth/user.json` and reused by every `authenticatedPage` test.

Logout tells the site to kill that cookie. After that:

- this test is logged out, **and**
- the next test that loads `auth/user.json` is also logged out.

Those tests will fail because the header no longer says Logged in as.

`freshSession` creates a **different** account and a **different** context. Logging that user out (or deleting the account) does not touch the `.env` user’s `sessionid`.

---

## 9. How to run

```bash
npm install
npx playwright install chromium
cp .env.example .env
# put a real registered EMAIL, PASSWORD, USER_NAME in .env

npm run test:auth
npx playwright test tests/auth/two-users.spec.js --project=chromium-auth
```

`test:auth` runs the `setup` project first (writes `auth/user.json`), then every spec under `tests/auth/`.
