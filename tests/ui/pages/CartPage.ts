import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartProducts: Locator;
  private readonly removeButtons: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly productQuantity: Locator;
  private readonly productPrice: Locator;
  private readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.cartProducts = page.locator('#cart_info_table tbody tr');
    this.removeButtons = page.locator('.cart_quantity_delete');
    this.proceedToCheckoutButton = page.locator('.check_out');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.productQuantity = page.locator('.cart_quantity button');
    this.productPrice = page.locator('.cart_price p');
    this.totalPrice = page.locator('.cart_total_price');
  }

  async removeProduct(productIndex: number = 0) {
    await this.removeButtons.nth(productIndex).click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartProducts.count();
  }

  async verifyCartPage() {
    await expect(this.page.locator('text=Shopping Cart')).toBeVisible();
  }

  async verifyProductInCart(productName: string) {
    await expect(this.page.locator(`text=${productName}`)).toBeVisible();
  }

  async verifyEmptyCart() {
    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(0);
  }

  async getTotalPrice(): Promise<string> {
    return await this.totalPrice.textContent() || '';
  }
}