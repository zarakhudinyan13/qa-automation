import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { ContactPage } from '../pages/ContactPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';
import { AuthenticationAPI } from '../api/AuthenticationAPI.js';
import { ProductsAPI } from '../api/ProductsAPI.js';
import { BrandsAPI } from '../api/BrandsAPI.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
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
