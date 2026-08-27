import { BaseAPI } from './BaseAPI.js';

export class ProductsAPI extends BaseAPI {
  async getAllProducts() {
    const response = await this.request.get(`${this.baseUrl}/api/productsList`);
    return { response, body: await this.parseJson(response) };
  }

  async postToProductsList() {
    const response = await this.request.post(`${this.baseUrl}/api/productsList`);
    return { response, body: await this.parseJson(response) };
  }

  async searchProduct(searchTerm) {
    const response = await this.request.post(`${this.baseUrl}/api/searchProduct`, {
      form: { search_product: searchTerm },
    });
    return { response, body: await this.parseJson(response) };
  }

  async searchProductWithoutParam() {
    const response = await this.request.post(`${this.baseUrl}/api/searchProduct`);
    return { response, body: await this.parseJson(response) };
  }
}
