import { BasePage } from './BasePage.js';

export class HeaderComponent extends BasePage {
  constructor(page) {
    super(page);
    this.homeLink = page.locator('#header').getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.testCasesLink = page.getByRole('link', { name: 'Test Cases' });
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
  }

  loggedInAs(name) {
    return this.page.getByText(new RegExp(`Logged in as ${name}`, 'i'));
  }

  loggedInIndicator() {
    return this.page.getByText(/Logged in as/i);
  }

  async goToHome() {
    await this.clickElement(this.homeLink);
  }

  async goToProducts() {
    await this.clickElement(this.productsLink);
  }

  async goToCart() {
    await this.clickElement(this.cartLink);
  }

  async goToSignupLogin() {
    await this.clickElement(this.signupLoginLink);
  }

  async goToContactUs() {
    await this.clickElement(this.contactUsLink);
  }

  async logout() {
    await this.clickElement(this.logoutLink);
  }

  async deleteAccount() {
    await this.clickElement(this.deleteAccountLink);
  }
}
