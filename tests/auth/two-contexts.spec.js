import { test, expect } from '../../fixtures/auth.fixtures.js';
import { HomePage } from '../../pages/HomePage.js';
import { HeaderComponent } from '../../pages/HeaderComponent.js';

test('two browser contexts stay open as different users', async ({ twoSessions }) => {
  const { sessionA, sessionB } = twoSessions;
  const homeA = new HomePage(sessionA.page);
  const homeB = new HomePage(sessionB.page);
  const headerA = new HeaderComponent(sessionA.page);
  const headerB = new HeaderComponent(sessionB.page);

  expect(sessionA.context).not.toBe(sessionB.context);
  expect(sessionA.context.browser()).toBe(sessionB.context.browser());

  await Promise.all([homeA.navigateTo(''), homeB.navigateTo('')]);

  await expect(headerA.loggedInAs(sessionA.user.name)).toBeVisible();
  await expect(headerB.loggedInAs(sessionB.user.name)).toBeVisible();
  await expect(headerA.loggedInAs(sessionB.user.name)).toHaveCount(0);
  await expect(headerB.loggedInAs(sessionA.user.name)).toHaveCount(0);
});
