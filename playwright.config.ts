import { defineConfig, devices } from 'playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration
 * 
 * This configuration supports multiple environments:
 * - QA (default): Testing environment
 * - UAT: User Acceptance Testing environment  
 * - PROD: Production environment
 */

const environment = process.env.NODE_ENV || 'qa';

const environments = {
  qa: {
    baseURL: process.env.QA_BASE_URL || 'https://playwright.dev',
    timeout: 30000,
  },
  uat: {
    baseURL: process.env.UAT_BASE_URL || 'https://playwright.dev',
    timeout: 45000,
  },
  prod: {
    baseURL: process.env.PROD_BASE_URL || 'https://playwright.dev',
    timeout: 60000,
  },
};

const currentEnv = environments[environment as keyof typeof environments] || environments.qa;

export default defineConfig({
  testDir: './tests',
  
  // Global test timeout
  timeout: currentEnv.timeout,
  
  // Test configuration
  expect: {
    timeout: 10000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/playwright/results.json' }],
    ['html', { open: 'never', outputFolder: 'reports/playwright' }],
  ],
  
  // Global setup and teardown
  globalSetup: undefined,
  globalTeardown: undefined,
  
  // Shared settings for all projects
  use: {
    baseURL: currentEnv.baseURL,
    
    // Browser context options
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video only on failures
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Navigation timeout
    navigationTimeout: 30000,
    
    // Action timeout
    actionTimeout: 10000,
  },

  // Project configuration for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Branded browsers
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Configure directories
  outputDir: 'reports/playwright/test-results',
  
  // Web server configuration (if needed for local development)
  webServer: process.env.START_LOCAL_SERVER ? {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  } : undefined,
});