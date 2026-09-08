import { BasePage } from './BasePage.js';

export class PaymentPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCardInput = page.getByTestId('name-on-card');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cvcInput = page.getByTestId('cvc');
    this.expiryMonthInput = page.getByTestId('expiry-month');
    this.expiryYearInput = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');
    this.orderPlacedHeading = page.getByTestId('order-placed');
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
    await this.clickElement(this.payButton);
  }

  async verifyOrderPlaced() {
    await this.assertVisible(this.orderPlacedHeading);
    await this.assertVisible(this.orderSuccessMessage);
  }
}
