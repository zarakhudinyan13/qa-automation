import { BaseAPI } from './BaseAPI.js';

export class BrandsAPI extends BaseAPI {
  async getAllBrands() {
    const response = await this.request.get(`${this.baseUrl}/api/brandsList`);
    return { response, body: await this.parseJson(response) };
  }

  async putToBrandsList() {
    const response = await this.request.put(`${this.baseUrl}/api/brandsList`);
    return { response, body: await this.parseJson(response) };
  }
}
