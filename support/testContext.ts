import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Page } from 'playwright';
import browserManager from '../utils/browserManager';
import configManager from '../utils/configManager';
import testDataManager from '../utils/testDataManager';

export interface AttachmentData {
  data: string | Buffer;
  mediaType: string;
  fileName: string;
  timestamp: string;
}

export class CustomWorld extends World {
  public page!: Page;
  public scenarioData: Map<string, any> = new Map();
  public attachments: AttachmentData[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  // Browser management methods
  async initializePage(): Promise<Page> {
    if (!browserManager.isReady()) {
      await browserManager.initializeBrowser();
    }
    this.page = browserManager.getPage()!;
    return this.page;
  }

  // Navigation helpers
  async navigateToPage(url: string): Promise<void> {
    await browserManager.navigateToPage(url);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page ? this.page.url() : '';
  }

  async reloadPage(): Promise<void> {
    await browserManager.reloadPage();
  }

  async goBack(): Promise<void> {
    await browserManager.goBack();
  }

  async goForward(): Promise<void> {
    await browserManager.goForward();
  }

  // Element interaction helpers
  async waitForElement(selector: string, timeout?: number): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const actualTimeout = timeout || configManager.getTestConfig().timeout;
    await this.page.waitForSelector(selector, { timeout: actualTimeout });
  }

  async clickElement(selector: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.locator(selector).click();
  }

  async fillInput(selector: string, text: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.locator(selector).fill(text);
  }

  async getElementText(selector: string): Promise<string | null> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.locator(selector).textContent();
  }

  async isElementVisible(selector: string): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.locator(selector).isVisible();
  }

  async isElementEnabled(selector: string): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.locator(selector).isEnabled();
  }

  async selectOption(selector: string, option: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.locator(selector).selectOption(option);
  }

  async checkCheckbox(selector: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.locator(selector).check();
  }

  async uncheckCheckbox(selector: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.locator(selector).uncheck();
  }

  // Screenshot helpers
  async takeScreenshot(name: string, fullPage: boolean = true): Promise<string | null> {
    return await browserManager.takeScreenshot(name, fullPage);
  }

  // Test data helpers
  getUserData(role: string = 'default') {
    return configManager.getUserCredentials(role);
  }

  generateInsuranceCustomer(overrides: any = {}) {
    return testDataManager.generateInsuranceCustomer(overrides);
  }

  generateVehicle(overrides: any = {}) {
    return testDataManager.generateVehicle(overrides);
  }

  generateProperty(overrides: any = {}) {
    return testDataManager.generateProperty(overrides);
  }

  generateHealthInfo(overrides: any = {}) {
    return testDataManager.generateHealthInfo(overrides);
  }

  generatePolicy(overrides: any = {}) {
    return testDataManager.generatePolicy(overrides);
  }

  getInvalidEmail(): string {
    return testDataManager.generateInvalidEmail();
  }

  getInvalidPhone(): string {
    return testDataManager.generateInvalidPhone();
  }

  getInvalidSSN(): string {
    return testDataManager.generateInvalidSSN();
  }

  getInvalidZipCode(): string {
    return testDataManager.generateInvalidZipCode();
  }

  // Scenario data storage
  setScenarioData(key: string, value: any): void {
    this.scenarioData.set(key, value);
  }

  getScenarioData(key: string): any {
    return this.scenarioData.get(key);
  }

  clearScenarioData(): void {
    this.scenarioData.clear();
  }

  // Test data storage (persistent across scenarios in same feature)
  storeData(key: string, data: any): void {
    testDataManager.storeData(key, data);
  }

  retrieveData(key: string): any {
    return testDataManager.retrieveData(key);
  }

  // Attachment helpers for reporting
  addAttachment(data: string | Buffer, mediaType: string, fileName: string): void {
    const attachment: AttachmentData = {
      data,
      mediaType,
      fileName,
      timestamp: new Date().toISOString(),
    };

    this.attachments.push(attachment);

    // Attach to Cucumber report
    if (typeof this.attach === 'function') {
      if (typeof data === 'string') {
        this.attach(data, mediaType);
      } else {
        this.attach(data, mediaType);
      }
    }
  }

  async attachScreenshot(name: string = 'screenshot'): Promise<void> {
    const screenshotPath = await this.takeScreenshot(name);
    if (screenshotPath && this.page) {
      try {
        const fs = require('fs');
        const screenshot = fs.readFileSync(screenshotPath);
        this.addAttachment(screenshot, 'image/png', `${name}.png`);
      } catch (error) {
        this.logMessage(`Failed to attach screenshot: ${error}`, 'warn');
      }
    }
  }

  // Configuration helpers
  getBaseURL(): string {
    return configManager.getTestConfig().baseURL;
  }

  getTimeout(): number {
    return configManager.getTestConfig().timeout;
  }

  isDebugMode(): boolean {
    return configManager.isDebugMode();
  }

  isCIMode(): boolean {
    return configManager.isCIMode();
  }

  getBrowserInfo(): string {
    return browserManager.getBrowserInfo();
  }

  // Utility methods
  async waitForTimeout(ms: number): Promise<void> {
    if (this.page) {
      await this.page.waitForTimeout(ms);
    } else {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  logMessage(message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      case 'debug':
        if (this.isDebugMode()) {
          console.log(`${prefix} ${message}`);
        }
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  // Helper method to get page URL mapping
  getPageUrl(pageName: string): string {
    // If it's already a full URL, return as is
    if (pageName.startsWith('http://') || pageName.startsWith('https://')) {
      return pageName;
    }

    const pageUrls: Record<string, string> = {
      // TODO: to be updated according to the application.
      home: '/',
      login: '/login',
      dashboard: '/dashboard',
      profile: '/profile',
      settings: '/settings',
      quote: '/quote',
      policy: '/policy',
      claims: '/claims',
      about: '/about',
      contact: '/contact',
    };

    return pageUrls[pageName.toLowerCase()] || `/${pageName.toLowerCase()}`;
  }

  // Validation helpers
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;
    return phoneRegex.test(phone);
  }

  validateSSN(ssn: string): boolean {
    const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    return ssnRegex.test(ssn);
  }

  validateZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }
}

setWorldConstructor(CustomWorld);
