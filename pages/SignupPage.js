import { BasePage } from './BasePage.js';

export class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    this.accountInfoHeading = page.getByRole('heading', { name: /Enter Account Information/i });
    this.titleMr = page.getByRole('radio', { name: 'Mr.' });
    this.titleMrs = page.getByRole('radio', { name: 'Mrs.' });
    this.passwordInput = page.getByLabel('Password *');
    this.daysSelect = page.locator('select').nth(0);
    this.monthsSelect = page.locator('select').nth(1);
    this.yearsSelect = page.locator('select').nth(2);
    this.newsletterCheckbox = page.getByLabel('Sign up for our newsletter!');
    this.offersCheckbox = page.getByLabel('Receive special offers from our partners!');
    this.firstNameInput = page.getByLabel('First name *');
    this.lastNameInput = page.getByLabel('Last name *');
    this.companyInput = page.getByLabel('Company', { exact: true });
    this.address1Input = page.getByLabel(/Address \*/);
    this.address2Input = page.getByLabel('Address 2');
    this.countrySelect = page.getByLabel('Country *');
    this.stateInput = page.locator('input[name="state"]');
    this.cityInput = page.locator('input[name="city"]');
    this.zipcodeInput = page.locator('input[name="zipcode"]');
    this.mobileInput = page.locator('input[name="mobile_number"]');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.accountDeletedHeading = page.getByText('Account Deleted!');
  }

  async fillAccountInformation(user) {
    await this.accountInfoHeading.waitFor({ state: 'visible' });
    await this.titleMr.check();
    await this.inputElement(this.passwordInput, user.password);
    await this.daysSelect.selectOption(String(user.birthDay));
    await this.monthsSelect.selectOption(String(user.birthMonth));
    await this.yearsSelect.selectOption(String(user.birthYear));
    if (user.newsletter) await this.newsletterCheckbox.check();
    if (user.offers) await this.offersCheckbox.check();
    await this.inputElement(this.firstNameInput, user.firstName);
    await this.inputElement(this.lastNameInput, user.lastName);
    await this.inputElement(this.companyInput, user.company);
    await this.inputElement(this.address1Input, user.address1);
    await this.inputElement(this.address2Input, user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.inputElement(this.stateInput, user.state);
    await this.inputElement(this.cityInput, user.city);
    await this.inputElement(this.zipcodeInput, user.zipcode);
    await this.inputElement(this.mobileInput, user.mobile);
  }

  async createAccount() {
    await this.clickElement(this.createAccountButton);
  }

  async verifyAccountCreated() {
    await this.assertVisible(this.accountCreatedHeading);
  }

  async continueAfterSignup() {
    await this.clickElement(this.continueButton);
  }

  async verifyAccountDeleted() {
    await this.assertVisible(this.accountDeletedHeading);
  }
}
