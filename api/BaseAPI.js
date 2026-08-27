export class BaseAPI {
  constructor(request) {
    this.request = request;
    this.baseUrl = process.env.BASE_URL || 'https://automationexercise.com';
  }

  async parseJson(response) {
    return response.json();
  }

  async assertOk(response) {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`API request failed: ${response.status()} - ${body}`);
    }
    return response;
  }
}
