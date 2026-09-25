/**
 * Example: two browser contexts open at the same time.
 *
 *   browser  → one Chromium process
 *   context  → one user's cookies
 *   page     → one tab inside that context
 *
 * Two tabs in one context are still one user.
 * Two users means two contexts. openTwoSessions() does that with the
 * existing createUserSession helper: own API client, own cookie jar, own page.
 * close() deletes both accounts and closes both contexts.
 */
import { test, expect, openTwoSessions } from '../../fixtures/auth.fixtures.js';
import { HomePage } from '../../pages/HomePage.js';
import { HeaderComponent } from '../../pages/HeaderComponent.js';

test('example: one browser, two contexts, two users', async ({ browser }) => {
  const sessions = await openTwoSessions(
    browser,
    { name: 'Example User A' },
    { name: 'Example User B' },
  );

  try {
    const { sessionA, sessionB } = sessions;
    const homeA = new HomePage(sessionA.page);
    const homeB = new HomePage(sessionB.page);
    const headerA = new HeaderComponent(sessionA.page);
    const headerB = new HeaderComponent(sessionB.page);

    await Promise.all([
      homeA.navigateTo(''),
      homeB.navigateTo(''),
    ]);

    await expect(headerA.loggedInAs('Example User A')).toBeVisible();
    await expect(headerB.loggedInAs('Example User B')).toBeVisible();
    await expect(headerA.loggedInAs('Example User B')).toHaveCount(0);
    await expect(headerB.loggedInAs('Example User A')).toHaveCount(0);
  } finally {
    await sessions.close();
  }
});
