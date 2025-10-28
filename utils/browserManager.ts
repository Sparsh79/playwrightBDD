import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import configManager, { BrowserConfig } from './configManager';

export class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: BrowserConfig;
  private isInitialized: boolean = false;

  private constructor() {
    this.config = configManager.getBrowserConfig();
  }

  static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  async initializeBrowser(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log(`Launching ${this.config.browser} browser`);

      const browserType = this.getBrowserType();
      this.browser = await browserType.launch({
        headless: this.config.headless,
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
        ],
        slowMo: this.config.slowMo,
      });

      await this.createContext();
      await this.createPage();

      this.isInitialized = true;
      console.log(`Browser initialized`);
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  private async createContext(): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const contextOptions: any = {
      viewport: this.config.viewport,
      ignoreHTTPSErrors: true,
      acceptDownloads: true,
      locale: configManager.getEnvVar('LOCALE', 'en-GB'),
      // timezoneId: configManager.getEnvVar('TIMEZONE', 'America/New_York')
    };

    // Add video recording if enabled
    if (this.config.recordVideo) {
      contextOptions.recordVideo = {
        dir: 'reports/videos/',
        size: this.config.viewport,
      };
    }

    this.context = await this.browser.newContext(contextOptions);

    // Start tracing if enabled
    if (this.config.recordTrace) {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
    }
  }

  private async createPage(): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not initialized');
    }

    this.page = await this.context.newPage();

    // Set timeouts
    this.page.setDefaultTimeout(this.config.timeout);
    this.page.setDefaultNavigationTimeout(this.config.timeout);

    // Add console and error listeners
    this.page.on('console', msg => {
      if (configManager.getEnvBool('DEBUG_CONSOLE')) {
        console.log(`🖥️ Browser Console [${msg.type()}]: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      console.error(`Page Error: ${error.message}`);
    });

    this.page.on('requestfailed', request => {
      if (configManager.isDebugMode()) {
        console.warn(`Request failed: ${request.url()} - ${request.failure()?.errorText}`);
      }
    });
  }

  private getBrowserType() {
    switch (this.config.browser.toLowerCase()) {
      case 'firefox':
        return firefox;
      case 'webkit':
      case 'safari':
        return webkit;
      case 'chrome':
      case 'chromium':
      default:
        return chromium;
    }
  }

  async navigateToPage(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializeBrowser() first.');
    }

    const testConfig = configManager.getTestConfig();
    const fullUrl = url.startsWith('http') ? url : `${testConfig.baseURL}${url}`;

    try {
      await this.page.goto(fullUrl, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout,
      });

      if (configManager.isDebugMode()) {
        console.log(`Navigated to: ${fullUrl}`);
      }
    } catch (error) {
      console.error(`Navigation failed to ${fullUrl}:`, error);
      throw error;
    }
  }

  async takeScreenshot(name: string, fullPage: boolean = true): Promise<string | null> {
    if (!this.page) {
      console.warn('Cannot take screenshot: Page not initialized');
      return null;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const path = `reports/screenshots/${name}-${timestamp}.png`;

      await this.page.screenshot({
        path,
        fullPage,
        type: 'png',
      });

      if (configManager.isDebugMode()) {
        console.log(`Screenshot saved: ${path}`);
      }

      return path;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return null;
    }
  }

  async reloadPage(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.goForward();
  }

  async cleanup(): Promise<void> {
    try {
      // Stop tracing if enabled
      if (this.config.recordTrace && this.context) {
        await this.context.tracing.stop({
          path: `reports/traces/trace-${Date.now()}.zip`,
        });
      }

      if (this.page) {
        await this.page.close();
        this.page = null;
      }

      if (this.context) {
        await this.context.close();
        this.context = null;
      }

      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }

      this.isInitialized = false;
      console.log('Browser cleanup completed');
    } catch (error) {
      console.error('Error during browser cleanup:', error);
    }
  }

  // Getters
  getPage(): Page | null {
    return this.page;
  }

  getContext(): BrowserContext | null {
    return this.context;
  }

  getBrowser(): Browser | null {
    return this.browser;
  }

  isReady(): boolean {
    return this.isInitialized && this.page !== null;
  }

  getBrowserInfo(): string {
    if (!this.browser) return 'Not initialized';
    return `${this.config.browser} (headless: ${this.config.headless})`;
  }
}

export default BrowserManager.getInstance();
