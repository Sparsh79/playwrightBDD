import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface BrowserConfig {
  browser: 'chromium' | 'firefox' | 'webkit' | 'chrome';
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeout: number;
  slowMo: number;
  recordVideo: boolean;
  recordTrace: boolean;
}

export interface TestConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  parallel: number;
  tags: string;
}

export interface UserCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface ReportConfig {
  outputDir: string;
  formats: string[];
  includeScreenshots: boolean;
  includeVideos: boolean;
  includeTraces: boolean;
}

class ConfigManager {
  private static instance: ConfigManager;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getBrowserConfig(): BrowserConfig {
    return {
      browser: (process.env.BROWSER as any) || 'chromium',
      headless: process.env.HEADLESS !== 'false',
      viewport: {
        width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
        height: parseInt(process.env.VIEWPORT_HEIGHT || '1080'),
      },
      timeout: parseInt(process.env.TIMEOUT || '60000'),
      slowMo: parseInt(process.env.SLOW_MO || '0'),
      recordVideo: process.env.RECORD_VIDEO === 'true',
      recordTrace: process.env.RECORD_TRACE === 'true',
    };
  }

  getTestConfig(): TestConfig {
    return {
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      timeout: parseInt(process.env.TIMEOUT || '60000'),
      retries: parseInt(process.env.RETRIES || '0'),
      parallel: parseInt(process.env.PARALLEL || '1'),
      tags: process.env.TAGS || '',
    };
  }

  getUserCredentials(role: string = 'default'): UserCredentials {
    const users: Record<string, UserCredentials> = {
      default: {
        email: process.env.DEFAULT_USER_EMAIL || 'test@example.com',
        password: process.env.DEFAULT_USER_PASSWORD || 'password123',
        firstName: process.env.DEFAULT_USER_FIRST_NAME || 'Test',
        lastName: process.env.DEFAULT_USER_LAST_NAME || 'User',
      },
      admin: {
        email: process.env.ADMIN_USER_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_USER_PASSWORD || 'admin123',
        firstName: process.env.ADMIN_USER_FIRST_NAME || 'Admin',
        lastName: process.env.ADMIN_USER_LAST_NAME || 'User',
        role: 'administrator',
      },
      agent: {
        email: process.env.AGENT_USER_EMAIL || 'agent@example.com',
        password: process.env.AGENT_USER_PASSWORD || 'agent123',
        firstName: process.env.AGENT_USER_FIRST_NAME || 'Insurance',
        lastName: process.env.AGENT_USER_LAST_NAME || 'Agent',
        role: 'agent',
      },
    };

    return users[role] || users.default;
  }

  getReportConfig(): ReportConfig {
    return {
      outputDir: process.env.REPORTS_DIR || 'reports',
      formats: (process.env.REPORT_FORMATS || 'json,html').split(','),
      includeScreenshots: process.env.INCLUDE_SCREENSHOTS !== 'false',
      includeVideos: process.env.INCLUDE_VIDEOS === 'true',
      includeTraces: process.env.INCLUDE_TRACES === 'true',
    };
  }

  isDebugMode(): boolean {
    return process.env.DEBUG === 'true';
  }

  isCIMode(): boolean {
    return process.env.CI === 'true';
  }

  validateConfig(): void {
    const validBrowsers = ['chromium', 'firefox', 'webkit', 'chrome'];
    const browserConfig = this.getBrowserConfig();

    if (!validBrowsers.includes(browserConfig.browser)) {
      throw new Error(
        `Invalid browser: ${browserConfig.browser}. Valid options: ${validBrowsers.join(', ')}`
      );
    }

    const testConfig = this.getTestConfig();
    if (!testConfig.baseURL.startsWith('http')) {
      throw new Error(
        `Invalid BASE_URL: ${testConfig.baseURL}. Must start with http:// or https://`
      );
    }

    if (browserConfig.timeout < 1000) {
      console.warn('Warning: Timeout is less than 1 second, this might cause issues');
    }

    if (browserConfig.viewport.width < 320 || browserConfig.viewport.height < 240) {
      throw new Error('Viewport dimensions are too small. Minimum 320x240 required');
    }
  }

  getEnvironment(): string {
    return process.env.NODE_ENV || 'qa';
  }

  // Helper method to get any environment variable with fallback
  getEnvVar(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
  }

  // Helper method to get boolean environment variable
  getEnvBool(key: string, fallback: boolean = false): boolean {
    const value = process.env[key];
    if (value === undefined) return fallback;
    return value.toLowerCase() === 'true';
  }

  // Helper method to get number environment variable
  getEnvNumber(key: string, fallback: number = 0): number {
    const value = process.env[key];
    if (value === undefined) return fallback;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
}

export default ConfigManager.getInstance();
