import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly productCards: Locator;
  private readonly addToCartButtons: Locator;
  private readonly viewProductButtons: Locator;
  private readonly searchResultsTitle: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly viewCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.productinfo');
    this.addToCartButtons = page.locator('.add-to-cart');
    this.viewProductButtons = page.locator('.choose a');
    this.searchResultsTitle = page.locator('.title.text-center');
    this.continueShoppingButton = page.locator('.btn-success');
    this.viewCartButton = page.locator('text=View Cart');
  }

  async addProductToCart(productIndex: number = 0) {
    await this.addToCartButtons.nth(productIndex).click();
    await this.continueShoppingButton.click();
  }

  async addProductToCartAndView(productIndex: number = 0) {
    await this.addToCartButtons.nth(productIndex).click();
    await this.viewCartButton.click();
  }

  async viewProductDetails(productIndex: number = 0) {
    await this.viewProductButtons.nth(productIndex).click();
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async verifyProductsPage() {
    await expect(this.page.locator('text=All Products')).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  async verifySearchResults(searchTerm: string) {
    await expect(this.searchResultsTitle).toContainText('Searched Products');
    const productCount = await this.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  }
}