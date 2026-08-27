import { test, expect } from '../../fixtures/test.fixtures.js';
import testData from '../../data/testData.js';
import { ensureUploadFixture } from '../../utils/helpers.js';

test.describe('Contact Us Form', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.navigateTo('contact_us');
  });

  test('contact page loads successfully', async ({ contactPage }) => {
    await contactPage.verifyContactPageLoaded();
  });

  test('user can submit contact form with file upload', async ({ contactPage, homePage }) => {
    const uploadFile = ensureUploadFixture();
    const form = testData.contactForm;

    await contactPage.fillForm(form);
    await contactPage.uploadFile(uploadFile);
    await contactPage.submitAndConfirm();

    await expect(contactPage.successMessage).toBeVisible();
    await contactPage.header.goToHome();
    await homePage.verifyHomePageLoaded();
  });

  test('contact form fields accept input', async ({ contactPage }) => {
    const form = testData.contactForm;

    await contactPage.fillForm(form);

    await expect(contactPage.nameInput).toHaveValue(form.name);
    await expect(contactPage.emailInput).toHaveValue(form.email);
    await expect(contactPage.subjectInput).toHaveValue(form.subject);
    await expect(contactPage.messageInput).toHaveValue(form.message);
  });
});
