import { BasePage } from './BasePage.js';

export class ProductDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = page.locator('.product-information > h2');
    this.category = page.locator('.product-information p').filter({ hasText: 'Category:' });
    this.price = page.locator('.product-information span span').first();
    this.availability = page.locator('.product-information p').filter({ hasText: 'Availability:' });
    this.condition = page.locator('.product-information p').filter({ hasText: 'Condition:' });
    this.brand = page.locator('.product-information p').filter({ hasText: 'Brand:' });
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button.cart');
    this.writeReviewHeading = page.getByText('Write Your Review');
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextInput = page.locator('#review');
    this.submitReviewButton = page.locator('#button-review');
    this.reviewSuccessMessage = page.getByText('Thank you for your review.');
  }

  async setQuantity(qty) {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart() {
    await this.clickElement(this.addToCartButton);
  }

  async submitReview(name, email, review) {
    await this.inputElement(this.reviewNameInput, name);
    await this.inputElement(this.reviewEmailInput, email);
    await this.inputElement(this.reviewTextInput, review);
    await this.clickElement(this.submitReviewButton);
  }

  async verifyProductDetailsVisible() {
    await this.assertVisible(this.productName);
    await this.assertVisible(this.category);
    await this.assertVisible(this.price);
    await this.assertVisible(this.availability);
    await this.assertVisible(this.condition);
    await this.assertVisible(this.brand);
  }
}
