import { test, expect } from '@playwright/test';

test.describe('Authenticated User Flows', () => {
  test('authenticated user sees logged in header', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Logged in as/i)).toBeVisible();
  });

  test('authenticated user can add product to cart and view cart', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });

    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();
    await page.locator('a.add-to-cart[data-product-id="1"]').first().click();
    await page.getByRole('link', { name: 'View Cart' }).click();

    await expect(page.getByText('Shopping Cart')).toBeVisible();
    await expect(page.locator('#cart_info_table')).toBeVisible();
  });

  test('authenticated user can navigate to products from home', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: 'Products' }).click();

    await expect(page).toHaveURL(/products/);
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
  });
});
