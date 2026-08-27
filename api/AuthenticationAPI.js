import { BaseAPI } from './BaseAPI.js';

export class AuthenticationAPI extends BaseAPI {
  async verifyLogin(email, password) {
    const response = await this.request.post(`${this.baseUrl}/api/verifyLogin`, {
      form: { email, password },
    });
    return { response, body: await this.parseJson(response) };
  }

  async uiLogin(email, password) {
    const response = await this.request.post(`${this.baseUrl}/login`, {
      form: { email, password },
    });
    const storageState = await this.request.storageState();
    return { response, cookies: storageState.cookies };
  }

  async createAccount(userData) {
    const response = await this.request.post(`${this.baseUrl}/api/createAccount`, {
      form: userData,
    });
    return { response, body: await this.parseJson(response) };
  }

  async deleteAccount(email, password) {
    const response = await this.request.delete(`${this.baseUrl}/api/deleteAccount`, {
      form: { email, password },
    });
    return { response, body: await this.parseJson(response) };
  }

  async getUserDetailByEmail(email) {
    const response = await this.request.get(`${this.baseUrl}/api/getUserDetailByEmail`, {
      params: { email },
    });
    return { response, body: await this.parseJson(response) };
  }
}
