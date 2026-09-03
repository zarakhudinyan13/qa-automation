/**
 * STUDENT EXAMPLE — browser vs context vs page + TWO USERS IN PARALLEL
 * --------------------------------------------------------------------
 *
 * Playwright hierarchy (memorize this):
 *
 *   browser   → one browser process (Chromium)
 *   context   → one independent user session (own cookies / localStorage)
 *   page      → one tab inside that context
 *
 * Why contexts matter for multi-user:
 *   User A cookies must NOT leak into User B.
 *   Separate contexts = separate sessions, even in the same browser.
 *
 * Auth rule:
 *   Create sessions with AuthenticationAPI.apiSignup() — NOT UI signup/login.
 *   Use a FRESH API request context per user (createAuthAPI), same isolation idea.
 *   Then attach each storageState to its own browser context.
 */
import { test, expect } from '../../fixtures/test.fixtures.js';
import { HomePage } from '../../pages/HomePage.js';
import { HeaderComponent } from '../../pages/HeaderComponent.js';
import { ProductsPage } from '../../pages/ProductsPage.js';
import {
  createUserSession,
  createAuthenticatedContext,
  createAuthAPI,
} from '../../utils/session.js';

test.describe('Lesson example: browser, context, and parallel users', () => {
  test('one browser → two contexts → two users at the same time', async ({ browser }) => {
    // ------------------------------------------------------------
    // Step 1: Create TWO users via API — each with its OWN api request context
    // ------------------------------------------------------------
    const apiA = await createAuthAPI();
    const apiB = await createAuthAPI();

    const [signupA, signupB] = await Promise.all([
      apiA.authAPI.apiSignup({ firstName: 'Alice', name: 'Alice Parallel' }),
      apiB.authAPI.apiSignup({ firstName: 'Bob', name: 'Bob Parallel' }),
    ]);

    // ------------------------------------------------------------
    // Step 2: One browser, TWO isolated browser contexts (two sessions)
    // ------------------------------------------------------------
    const contextA = await createAuthenticatedContext(browser, signupA.storageState);
    const contextB = await createAuthenticatedContext(browser, signupB.storageState);

    // ------------------------------------------------------------
    // Step 3: One page (tab) per user
    // ------------------------------------------------------------
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    const headerA = new HeaderComponent(pageA);
    const headerB = new HeaderComponent(pageB);
    const homeA = new HomePage(pageA);
    const homeB = new HomePage(pageB);
    const productsA = new ProductsPage(pageA);
    const productsB = new ProductsPage(pageB);

    // ------------------------------------------------------------
    // Step 4: Both users act in PARALLEL — sessions stay separate
    // ------------------------------------------------------------
    await Promise.all([
      homeA.navigateTo(''),
      homeB.navigateTo(''),
    ]);

    await expect(headerA.loggedInAs(signupA.user.name)).toBeVisible();
    await expect(headerB.loggedInAs(signupB.user.name)).toBeVisible();

    // Prove isolation: each header shows a DIFFERENT name at the same time
    await expect(headerA.loggedInAs(signupB.user.name)).toHaveCount(0);
    await expect(headerB.loggedInAs(signupA.user.name)).toHaveCount(0);

    await Promise.all([
      productsA.navigateTo('products'),
      productsB.navigateTo('products'),
    ]);

    await productsA.verifyProductsPageLoaded();
    await productsB.verifyProductsPageLoaded();

    // ------------------------------------------------------------
    // Step 5: Cleanup accounts + close API + browser contexts
    // ------------------------------------------------------------
    await Promise.all([
      apiA.authAPI.deleteAccount(signupA.user.email, signupA.user.password),
      apiB.authAPI.deleteAccount(signupB.user.email, signupB.user.password),
    ]);

    await apiA.apiContext.dispose();
    await apiB.apiContext.dispose();
    await contextA.close();
    await contextB.close();
  });

  test('helper createUserSession wraps API signup + context + page', async ({ browser }) => {
    // Same idea as above, but one helper call per user (safe to run in parallel)
    const [userA, userB] = await Promise.all([
      createUserSession(browser, { name: 'Helper User A' }),
      createUserSession(browser, { name: 'Helper User B' }),
    ]);

    const headerA = new HeaderComponent(userA.page);
    const headerB = new HeaderComponent(userB.page);

    await Promise.all([
      userA.page.goto('/', { waitUntil: 'domcontentloaded' }),
      userB.page.goto('/', { waitUntil: 'domcontentloaded' }),
    ]);

    await expect(headerA.loggedInAs(userA.user.name)).toBeVisible();
    await expect(headerB.loggedInAs(userB.user.name)).toBeVisible();

    await userA.cleanup();
    await userB.cleanup();
  });
});
