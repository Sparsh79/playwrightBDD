import { Page, Locator } from 'playwright';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForElement(
    selector: string,
    options: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' } = {}
  ): Promise<void> {
    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout: 30000,
      ...options,
    });
  }

  async takeScreenshot(name: string, path: string = 'reports/screenshots'): Promise<void> {
    const timestamp = new Date().getTime();
    await this.page.screenshot({
      path: `${path}/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async getElementText(selector: string): Promise<string | null> {
    return await this.page.locator(selector).textContent();
  }

  async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
