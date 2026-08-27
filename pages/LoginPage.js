import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginHeading = page.getByText('Login to your account');
    this.signupHeading = page.getByText('New User Signup!');
    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.errorMessage = page.getByText('Your email or password is incorrect!');
    this.existingEmailError = page.getByText('Email Address already exist!');
  }

  async login(email, password) {
    await this.inputElement(this.emailInput, email);
    await this.inputElement(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async startSignup(name, email) {
    await this.inputElement(this.signupNameInput, name);
    await this.inputElement(this.signupEmailInput, email);
    await this.clickElement(this.signupButton);
  }

  async assertLoginFormVisible() {
    await this.assertVisible(this.loginHeading);
  }

  async assertSignupFormVisible() {
    await this.assertVisible(this.signupHeading);
  }

  async assertLoginErrorVisible() {
    await this.assertVisible(this.errorMessage);
  }

  async assertExistingEmailErrorVisible() {
    await this.assertVisible(this.existingEmailError);
  }
}
