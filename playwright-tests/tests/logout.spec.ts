import { test, expect } from '@playwright/test';

test.describe('Logout Flow Tests', () => {
  test('Successful Logout Challenge', async ({ page }) => {
    // Log in
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Verify logged in
    await expect(page).toHaveURL(/.*inventory.html/);

    // Open hamburger menu
    await page.locator('#react-burger-menu-btn').click();

    // Click logout button in menu (should wait for it to be visible or click it directly)
    const logoutBtn = page.locator('#logout_sidebar_link');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify redirected back to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
