import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should login with valid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goToLogin();
    await loginPage.login('test@example.com', 'password123');
    
    // Verify successful login
    await expect(page.locator('text=Logged in as')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goToLogin();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    // Verify error message
    await expect(page.locator('text=Your email or password is incorrect')).toBeVisible();
  });

  test('should redirect to signup page', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goToLogin();
    await loginPage.goToSignup();
    
    await expect(page.locator('text=New User Signup!')).toBeVisible();
  });
});