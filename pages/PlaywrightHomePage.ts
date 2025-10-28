import { BasePage } from './BasePage';
import { Page, Locator } from 'playwright';
import browserManager from '../utils/browserManager';

export class PlaywrightHomePage extends BasePage {
  public readonly docsLink: Locator;
  public readonly mainHeading: Locator;
  public readonly heroText: Locator;

  constructor(page?: Page) {
    const actualPage = page || browserManager.getPage();
    if (!actualPage) {
      throw new Error('Page is not initialized');
    }
    super(actualPage);

    // Page locators
    this.docsLink = this.page.locator('a:has-text("Docs")').first();
    this.mainHeading = this.page.locator('h1').first();
    this.heroText = this.page.getByText(/playwright/i).first();
  }

  async navigateToHomePage(): Promise<void> {
    await this.navigate('https://playwright.dev');
  }

  async clickDocsLink(): Promise<void> {
    await this.docsLink.click();
  }

  async isHeroTextVisible(): Promise<boolean> {
    return await this.heroText.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
