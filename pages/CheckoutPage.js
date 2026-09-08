import { BasePage } from './BasePage.js';
import { dismissGoogleVignette } from '../utils/helpers.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.addressDetailsHeading = page.getByRole('heading', { name: 'Address Details' });
    this.reviewOrderHeading = page.getByRole('heading', { name: 'Review Your Order' });
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.commentInput = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    this.checkoutLoginModal = page.locator('#checkoutModal');
  }

  async verifyCheckoutPageLoaded() {
    await this.assertUrlContains('/checkout');
    await this.assertVisible(this.addressDetailsHeading);
    await this.assertVisible(this.reviewOrderHeading);
    await this.assertVisible(this.deliveryAddress);
    await this.assertVisible(this.billingAddress);
  }

  async placeOrder(comment = '') {
    if (comment) {
      await this.inputElement(this.commentInput, comment);
    }
    await dismissGoogleVignette(this.page);
    await this.placeOrderButton.click({ force: true });
    await dismissGoogleVignette(this.page);
    await this.page.waitForURL(/\/payment/);
  }
}
