import { BaseAPI } from './BaseAPI.js';
import { generateUser, toApiUserPayload } from '../utils/dataGenerator.js';
import { API_CODES } from '../data/constants.js';

export class AuthenticationAPI extends BaseAPI {
  async _getCsrfToken(path = '/login') {
    const pageResponse = await this.request.get(`${this.baseUrl}${path}`);
    const html = await pageResponse.text();
    const csrfMatch = html.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
    const csrfToken = csrfMatch?.[1];

    if (!csrfToken) {
      throw new Error(`CSRF token not found on ${path}`);
    }

    return csrfToken;
  }

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
    const csrfToken = await this._getCsrfToken('/login');

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

  /**
   * Full reusable signup: creates account via API, logs in, returns user + storage state.
   * Pass overrides to generateUser() or a complete user object.
   */
  async apiSignup(userOverrides = {}) {
    const user = generateUser(userOverrides);
    const payload = toApiUserPayload(user);
    const { response: createResponse, body: createBody } = await this.createAccount(payload);

    if (createBody.responseCode !== API_CODES.created) {
      throw new Error(`Signup failed: ${createBody.message}`);
    }

    const { response: loginResponse, storageState } = await this.apiLogin(user.email, user.password);

    return {
      user,
      createResponse,
      createBody,
      loginResponse,
      storageState,
    };
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
