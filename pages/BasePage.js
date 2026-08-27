import { expect } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path = '') {
    if (path.startsWith('http')) {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
      return;
    }
    const normalizedPath = path ? `/${path.replace(/^\//, '')}` : '/';
    await this.page.goto(normalizedPath, { waitUntil: 'domcontentloaded' });
  }

  async waitForElement(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async clickElement(locator) {
    await locator.click();
  }

  async inputElement(locator, text) {
    await locator.fill(text);
  }

  async assertVisible(locator) {
    await expect(locator).toBeVisible();
  }

  async assertText(locator, text) {
    await expect(locator).toContainText(text);
  }

  async assertUrlContains(text) {
    await expect(this.page).toHaveURL(new RegExp(text));
  }
}
