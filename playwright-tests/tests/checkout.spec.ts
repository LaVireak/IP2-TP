import { test, expect } from '@playwright/test';

test.describe('Checkout Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Successful Checkout Happy Path', async ({ page }) => {
    // Add item and navigate to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Fill checkout form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify step two overview
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // Click Finish
    await page.locator('[data-test="finish"]').click();

    // Verify complete page
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('Form Validation Errors Challenge', async ({ page }) => {
    // Go to checkout step one
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    const errorContainer = page.locator('[data-test="error"]');

    // Click continue with empty fields
    await page.locator('[data-test="continue"]').click();
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toContainText('Error: First Name is required');

    // Fill first name, leave other empty
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    await expect(errorContainer).toContainText('Error: Last Name is required');

    // Fill last name, leave zip empty
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    await expect(errorContainer).toContainText('Error: Postal Code is required');
  });

  test('Multiple Items Checkout', async ({ page }) => {
    // Add three different items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // Verify cart badge count is 3
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    await page.locator('.shopping_cart_link').click();

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify all 3 items are present in overview
    const items = page.locator('.inventory_item_name');
    await expect(items).toHaveCount(3);

    // Complete checkout
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
