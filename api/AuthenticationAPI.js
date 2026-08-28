import { BaseAPI } from './BaseAPI.js';

export class AuthenticationAPI extends BaseAPI {
  async verifyLogin(email, password) {
    const response = await this.request.post(`${this.baseUrl}/api/verifyLogin`, {
      form: { email, password },
    });
    return { response, body: await this.parseJson(response) };
  }

  /**
   * Logs in via the UI login endpoint and returns Playwright storage state.
   * Use this to reuse authenticated sessions across tests without UI login.
   */
  async apiLogin(email, password) {
    const loginPageResponse = await this.request.get(`${this.baseUrl}/login`);
    const html = await loginPageResponse.text();
    const csrfMatch = html.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
    const csrfToken = csrfMatch?.[1];

    if (!csrfToken) {
      throw new Error('CSRF token not found on login page');
    }

    const response = await this.request.post(`${this.baseUrl}/login`, {
      form: {
        email,
        password,
        csrfmiddlewaretoken: csrfToken,
      },
      headers: {
        Referer: `${this.baseUrl}/login`,
      },
    });

    const storageState = await this.request.storageState();
    return { response, storageState };
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
