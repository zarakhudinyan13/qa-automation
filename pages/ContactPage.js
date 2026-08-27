import { BasePage } from './BasePage.js';
import { HeaderComponent } from './HeaderComponent.js';

export class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageHeading = page.getByText('Get In Touch');
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.uploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = page.locator('#contact-page .alert-success');
  }

  async verifyContactPageLoaded() {
    await this.assertVisible(this.pageHeading);
    await this.assertUrlContains('/contact_us');
  }

  async fillForm({ name, email, subject, message }) {
    await this.inputElement(this.nameInput, name);
    await this.inputElement(this.emailInput, email);
    await this.inputElement(this.subjectInput, subject);
    await this.inputElement(this.messageInput, message);
  }

  async uploadFile(filePath) {
    await this.uploadInput.setInputFiles(filePath);
  }

  async submitForm() {
    await this.clickElement(this.submitButton);
  }

  async submitAndConfirm() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitForm();
  }
}
