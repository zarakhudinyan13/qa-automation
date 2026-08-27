import { BasePage } from './BasePage.js';

export class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByText('Searched Products');
    this.productCards = page.locator('.product-image-wrapper');
    this.addToCartModal = page.locator('.modal-content');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    this.addedToCartMessage = page.getByText('Your product has been added to cart.');
  }

  productById(productId) {
    return this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`).first();
  }

  viewProductLink(productId) {
    return this.page.getByRole('link', { name: 'View Product' }).nth(0);
  }

  async verifyProductsPageLoaded() {
    await this.assertVisible(this.pageHeading);
    await this.assertUrlContains('/products');
  }

  async searchProduct(keyword) {
    await this.inputElement(this.searchInput, keyword);
    await this.clickElement(this.searchButton);
  }

  async addProductToCart(productId) {
    const product = this.page.locator('.product-image-wrapper').filter({
      has: this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`),
    }).first();
    await product.hover();
    await this.clickElement(this.productById(productId));
  }

  async continueShopping() {
    await this.clickElement(this.continueShoppingButton);
  }

  async goToCartFromModal() {
    await this.clickElement(this.viewCartLink);
  }

  async openFirstProductDetails() {
    await this.clickElement(this.page.getByRole('link', { name: 'View Product' }).first());
  }

  getProductCount() {
    return this.productCards.count();
  }
}
