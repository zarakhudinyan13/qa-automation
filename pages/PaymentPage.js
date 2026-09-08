import { BasePage } from './BasePage.js';
import { dismissGoogleVignette } from '../utils/helpers.js';

export class PaymentPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"], [name="name_on_card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"], [name="card_number"]');
    this.cvcInput = page.locator('[data-qa="cvc"], [name="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"], [name="expiry_month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"], [name="expiry_year"]');
    this.payButton = page.locator('[data-qa="pay-button"], #submit');
    this.orderPlacedHeading = page.locator('[data-qa="order-placed"]');
    this.orderSuccessMessage = page.getByText('Congratulations! Your order has been confirmed!');
  }

  async verifyPaymentPageLoaded() {
    await this.assertUrlContains('/payment');
    await this.assertVisible(this.heading);
  }

  async pay({ nameOnCard, cardNumber, cvc, expiryMonth, expiryYear }) {
    await this.inputElement(this.nameOnCardInput, nameOnCard);
    await this.inputElement(this.cardNumberInput, cardNumber);
    await this.inputElement(this.cvcInput, cvc);
    await this.inputElement(this.expiryMonthInput, expiryMonth);
    await this.inputElement(this.expiryYearInput, expiryYear);
    await dismissGoogleVignette(this.page);
    await this.payButton.click({ force: true });
    await dismissGoogleVignette(this.page);
    await this.page.waitForURL(/payment_done|\/payment/);
  }

  async verifyOrderPlaced() {
    await this.assertVisible(this.orderPlacedHeading);
    await this.assertVisible(this.orderSuccessMessage);
  }
}
