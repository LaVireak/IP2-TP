import { test, expect } from '@playwright/test';

test.describe('Product Catalog & Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Add Product to Cart', async ({ page }) => {
    // Add backpack to cart
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addBtn.click();

    // Verify button text changes to Remove
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // Verify cart badge counts 1
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });

  test('Remove Product from Catalog Page', async ({ page }) => {
    // Add backpack first
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Remove from same page
    const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await removeBtn.click();

    // Verify cart badge disappears
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Remove Product from Cart Page', async ({ page }) => {
    // Add item and navigate to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    // Verify on cart page
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // Remove item
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Verify cart is empty
    await expect(page.locator('.inventory_item_name')).not.toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Sorting Challenge: Price Low to High', async ({ page }) => {
    // Select price (low to high) sorting option
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    // Extract all item prices
    const priceElements = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceElements.map((p) => parseFloat(p.replace('$', '')));

    // Verify they are sorted in ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });
});
