import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { AuthenticationAPI } from '../api/AuthenticationAPI.js';
import { ProductsAPI } from '../api/ProductsAPI.js';
import { BrandsAPI } from '../api/BrandsAPI.js';

export const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  authAPI: async ({ request }, use) => {
    await use(new AuthenticationAPI(request));
  },
  productsAPI: async ({ request }, use) => {
    await use(new ProductsAPI(request));
  },
  brandsAPI: async ({ request }, use) => {
    await use(new BrandsAPI(request));
  },
});

export { expect };
