import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartHeading = page.getByText('Shopping Cart');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.cartTable = page.locator('#cart_info_table');
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.removeProductButtons = page.locator('.cart_quantity_delete');
    this.subscriptionHeading = page.getByText('Subscription');
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscriptionSuccess = page.getByText('You have been successfully subscribed!');
  }

  async verifyCartPageLoaded() {
    await this.assertVisible(this.cartHeading);
    await this.assertUrlContains('/view_cart');
  }

  async verifyCartNotEmpty() {
    await this.assertVisible(this.cartTable);
  }

  async verifyCartEmpty() {
    await this.assertVisible(this.emptyCartMessage);
  }

  async proceedToCheckout() {
    await this.clickElement(this.proceedToCheckoutButton);
  }

  async removeProduct(index = 0) {
    await this.removeProductButtons.nth(index).click();
  }

  async getCartItemCount() {
    return this.cartRows.count();
  }

  async scrollToFooter() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async subscribe(email) {
    await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
    await this.inputElement(this.subscriptionEmailInput, email);
    await this.clickElement(this.subscribeButton);
  }
}
