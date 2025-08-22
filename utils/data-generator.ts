import { faker } from '@faker-js/faker';
import { Page, expect, Locator } from '@playwright/test';
import config from './config';

export class TestDataGenerator {
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      company: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number()
    };
  }

  static generateProduct() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      category: faker.commerce.department()
    };
  }
}

export class ApiHelpers {
  static async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return {
      status: response.status,
      data: await response.json(),
      headers: response.headers
    };
  }
}

export class WaitHelpers {
  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForVisible(locator: Locator, timeout: number = config.execution.expectTimeout) {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for element to contain specific text
   */
  static async waitForText(locator: Locator, text: string, timeout: number = config.execution.expectTimeout) {
    await expect(locator).toContainText(text, { timeout });
  }

  /**
   * Wait for page to load completely
   */
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be clickable
   */
  static async waitForClickable(locator: Locator, timeout: number = config.execution.expectTimeout) {
    await expect(locator).toBeEnabled({ timeout });
    await expect(locator).toBeVisible({ timeout });
  }
}

export class ActionHelpers {
  /**
   * Safe click with wait
   */
  static async safeClick(locator: Locator, timeout: number = config.execution.expectTimeout) {
    await WaitHelpers.waitForClickable(locator, timeout);
    await locator.click();
  }

  /**
   * Type text with clear
   */
  static async typeText(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Select dropdown option
   */
  static async selectOption(locator: Locator, option: string) {
    await locator.selectOption({ label: option });
  }

  /**
   * Upload file
   */
  static async uploadFile(locator: Locator, filePath: string) {
    await locator.setInputFiles(filePath);
  }
}

export class AssertionHelpers {
  /**
   * Assert element contains text (case insensitive)
   */
  static async assertTextContains(locator: Locator, text: string) {
    const actualText = await locator.textContent();
    expect(actualText?.toLowerCase()).toContain(text.toLowerCase());
  }

  /**
   * Assert URL contains path
   */
  static async assertUrlContains(page: Page, path: string) {
    expect(page.url()).toContain(path);
  }

  /**
   * Assert element count
   */
  static async assertElementCount(locator: Locator, expectedCount: number) {
    await expect(locator).toHaveCount(expectedCount);
  }
}

export class DebugHelpers {
  /**
   * Take screenshot with custom name
   */
  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: `${config.paths.screenshots}/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Log element information
   */
  static async logElementInfo(locator: Locator, elementName: string) {
    const isVisible = await locator.isVisible();
    const isEnabled = await locator.isEnabled();
    const text = await locator.textContent();
    
    console.log(`${elementName}:`, {
      visible: isVisible,
      enabled: isEnabled,
      text: text?.trim()
    });
  }

  /**
   * Log page information
   */
  static async logPageInfo(page: Page) {
    console.log('Page Info:', {
      url: page.url(),
      title: await page.title(),
      timestamp: new Date().toISOString()
    });
  }
}

// Export all helpers as default
export default {
  TestDataGenerator,
  ApiHelpers,
  WaitHelpers,
  ActionHelpers,
  AssertionHelpers,
  DebugHelpers
};