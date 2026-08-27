import { BasePage } from './BasePage.js';
import { HeaderComponent } from './HeaderComponent.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.heroText = page.getByRole('heading', { name: /Full-Fledged practice website/i }).first();
    this.mainHeading = page.getByRole('heading', { name: /AutomationExercise/i }).first();
    this.subscriptionHeading = page.getByText('Subscription');
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscriptionSuccess = page.getByText('You have been successfully subscribed!');
    this.scrollUpButton = page.locator('#scrollUp');
  }

  async verifyHomePageLoaded() {
    await this.assertVisible(this.mainHeading);
    await this.assertVisible(this.heroText);
  }

  async subscribe(email) {
    await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
    await this.inputElement(this.subscriptionEmailInput, email);
    await this.clickElement(this.subscribeButton);
  }

  async scrollToFooter() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async clickScrollUp() {
    await this.clickElement(this.scrollUpButton);
  }
}
