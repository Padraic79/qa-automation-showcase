import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly loginLink: Locator;
  private readonly productsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.loginLink = page.locator('a[href="/login"]');
    this.productsLink = page.locator('a[href="/products"]');
  }

  async searchProduct(productName: string) {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async verifyHomePage() {
    await expect(this.page).toHaveTitle(/Automation Exercise/);
    await expect(this.searchBox).toBeVisible();
  }
}