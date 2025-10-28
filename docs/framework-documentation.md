# Framework Architecture & Technical Documentation

## Table of Contents
- [Framework Overview](#framework-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Configuration Management](#configuration-management)
- [Browser Management](#browser-management)
- [Test Context & World](#test-context--world)
- [Hooks & Lifecycle](#hooks--lifecycle)
- [Reporting System](#reporting-system)
- [Data Management](#data-management)
- [Development Guidelines](#development-guidelines)
- [Advanced Features](#advanced-features)

---

## Framework Overview

This is a comprehensive BDD (Behavior-Driven Development) automation framework built with:
- **Cucumber.js** - For BDD test execution and Gherkin feature files
- **Playwright** - For cross-browser automation
- **TypeScript** - For type safety and modern JavaScript features
- **Custom Architecture** - Modular, scalable, and maintainable design

### Key Features
- Cross-browser support (Chromium, Firefox, WebKit)
- BDD with Gherkin syntax
- One browser per feature file lifecycle
- Comprehensive reporting (HTML, JSON, Screenshots)
- Dynamic test data generation
- Configuration-driven approach
- Rich debugging capabilities
- Insurance domain-specific utilities
- Parallel execution support

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                 Test Layer                  │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │  Features   │  │   Step Definitions  │   │
│  │ (.feature)  │  │      (.ts)          │   │
│  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│               Support Layer                 │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │    Hooks    │  │    Test Context     │   │
│  │ (Lifecycle) │  │   (World/State)     │   │
│  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│              Business Layer                 │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │    Pages    │  │       Utils         │   │
│  │ (Page Obj.) │  │   (Helpers/Mgrs)    │   │
│  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│             Infrastructure                  │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Browser   │  │    Configuration    │   │
│  │   Manager   │  │      Manager        │   │
│  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Project Structure

```
playwright_proposal_framework/
├── features/                          # BDD Features & Step Definitions
│   ├── playwright-website.feature     # Gherkin feature files
│   └── step-definitions/
│       ├── common-steps.ts            # Reusable step definitions
│       └── playwright-website-steps.ts # Feature-specific steps
├── support/                           # Test Framework Support
│   ├── hooks.ts                       # Cucumber lifecycle hooks
│   └── testContext.ts                 # World constructor & utilities
├── pages/                             # Page Object Model
│   ├── BasePage.ts                    # Base page with common functionality
│   └── PlaywrightHomePage.ts          # Page-specific implementations
├── utils/                             # Framework Utilities
│   ├── browserManager.ts             # Browser lifecycle management
│   ├── configManager.ts              # Configuration management
│   ├── testDataManager.ts            # Test data generation
│   ├── logger.ts                     # Logging utilities
│   ├── dateHelper.ts                 # Date/time utilities
│   ├── waitHelper.ts                 # Wait strategies
│   └── cucumber-report.ts            # Enhanced reporting
├── data/                              # Test Data
│   ├── testData.ts                   # Static test data
│   ├── testDataFactory.ts            # Data generation factories
│   └── insuranceExamples.ts          # Domain-specific examples
├── docs/                              # Documentation
│   ├── common-steps-guide.md         # Step definitions guide
│   └── framework-documentation.md    # This document
├── reports/                           # Test Execution Reports
│   ├── cucumber/                     # Cucumber reports
│   ├── screenshots/                  # Failure screenshots
│   ├── videos/                       # Test execution videos
│   └── traces/                       # Playwright traces
├── cucumber.config.js                # Cucumber configuration
├── playwright.config.ts              # Playwright configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies & scripts
```

---

## Core Components

### 1. Feature Files (`features/*.feature`)
Gherkin-based test scenarios following BDD principles:

```gherkin
@smoke @demo
Feature: Playwright Website Basic Testing
  As a framework demonstration
  I want to test basic functionality of Playwright website
  So that I can showcase the framework capabilities

  Scenario: Playwright website homepage loads
    Given I am on the Playwright homepage
    When I navigate to the "settings" page
    Then the page title should contain "Playwright"
    And I should see the Playwright hero text
```

### 2. Step Definitions (`features/step-definitions/*.ts`)
TypeScript implementations of Gherkin steps:

```typescript
Given('I am on the Playwright homepage', async function (this: CustomWorld) {
  await this.initializePage();
  await this.navigateToPage('https://playwright.dev');
});
```

### 3. Page Objects (`pages/*.ts`)
Encapsulation of page-specific functionality:

```typescript
export class PlaywrightHomePage extends BasePage {
  async getHeroText(): Promise<string> {
    return await this.getElementText('.hero-title');
  }
}
```

---

## Configuration Management

### ConfigManager (`utils/configManager.ts`)
Centralized configuration management supporting multiple environments:

```typescript
// Environment-based configuration
const config = {
  test: { baseURL: 'https://test.example.com' },
  staging: { baseURL: 'https://staging.example.com' },
  prod: { baseURL: 'https://example.com' }
};

// Usage
configManager.getTestConfig().baseURL;
configManager.getBrowserConfig().browser;
configManager.getUserCredentials('admin');
```

### Configuration Sources
1. **Environment Variables** - Runtime overrides
2. **JSON Config Files** - Environment-specific settings
3. **Default Values** - Fallback configuration

### Key Configuration Areas
- **Test Environment** (URLs, timeouts, retries)
- **Browser Settings** (type, headless mode, viewport)
- **User Credentials** (role-based test users)
- **Reporting** (output directories, formats)

---

## Browser Management

### BrowserManager (`utils/browserManager.ts`)
Sophisticated browser lifecycle management:

#### Key Features
- **One Browser Per Feature** - Optimized resource usage
- **Cross-Browser Support** - Chromium, Firefox, WebKit, Chrome
- **Context Isolation** - Clean state between features
- **Automatic Cleanup** - Prevents resource leaks

#### Lifecycle Flow
```typescript
// Feature Start
BeforeFeature → initializeBrowser() → createContext() → createPage()

// Scenario Execution
BeforeScenario → getPage() → runSteps() → AfterScenario

// Feature End
AfterFeature → cleanup() → closeContext() → closeBrowser()
```

#### Browser Configuration
```typescript
const browserConfig = {
  browser: 'chromium',
  headless: true,
  viewport: { width: 1920, height: 1080 },
  video: 'retain-on-failure',
  screenshot: 'only-on-failure'
};
```

---

## Test Context & World

### CustomWorld (`support/testContext.ts`)
Enhanced Cucumber World providing rich functionality:

#### Core Capabilities
- **Page Management** - Browser page lifecycle
- **Element Interactions** - Click, type, select operations
- **Navigation** - URL handling and page transitions
- **Assertions** - Playwright-based verifications
- **Data Storage** - Scenario and feature-level data
- **Utilities** - Screenshots, waits, validations

#### Example Usage
```typescript
export class CustomWorld extends World {
  async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
  }

  setScenarioData(key: string, value: any): void {
    this.scenarioData.set(key, value);
  }
}
```

---

## Hooks & Lifecycle

### Hook Strategy (`support/hooks.ts`)
Comprehensive test lifecycle management:

#### Global Hooks
- **BeforeAll** - Framework initialization, directory setup
- **AfterAll** - Final cleanup, test summary generation

#### Feature Hooks
- **BeforeFeature** - Browser initialization per feature
- **AfterFeature** - Browser cleanup per feature

#### Scenario Hooks
- **BeforeScenario** - Page setup, data initialization
- **AfterScenario** - Screenshot on failure, data cleanup

#### Tag-Based Hooks
```typescript
Before({ tags: '@smoke' }, async function (this: CustomWorld) {
  this.logMessage('Running SMOKE test - critical functionality', 'info');
});

After({ tags: '@critical' }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    console.log('CRITICAL: High priority test failed!');
  }
});
```

### Browser Lifecycle Optimization
```typescript
let currentFeatureUri: string | null = null;

Before(async function (scenario) {
  const featureUri = scenario.gherkinDocument?.uri;
  
  if (currentFeatureUri !== featureUri) {
    // New feature - initialize new browser
    if (currentFeatureUri && browserManager.isReady()) {
      await browserManager.cleanup(); // Cleanup previous
    }
    await browserManager.initializeBrowser(); // Initialize new
    currentFeatureUri = featureUri;
  }
});
```

---

## Reporting System

### Multi-Format Reporting
1. **Cucumber HTML** - Rich interactive reports
2. **Cucumber JSON** - Machine-readable results
3. **Screenshots** - Failure evidence
4. **Videos** - Test execution recordings
5. **Traces** - Playwright debugging traces

### Enhanced Reporting (`utils/cucumber-report.ts`)
Custom report generation with:
- Test execution summary
- Pass/fail statistics
- Performance metrics
- Failure analysis
- Environment information

### Report Structure
```
reports/
├── cucumber/
│   ├── cucumber-report.html        # Interactive HTML report
│   └── cucumber-report.json        # Raw test results
├── screenshots/
│   └── failed-scenario-*.png       # Failure screenshots
├── videos/
│   └── test-execution-*.webm       # Recorded test videos
└── traces/
    └── trace-*.zip                 # Playwright debug traces
```

---

## Data Management

### TestDataManager (`utils/testDataManager.ts`)
Comprehensive test data generation system:

#### Capabilities
- **Dynamic Generation** - Faker.js integration
- **Domain-Specific** - Insurance industry data
- **Validation** - Built-in data validation
- **Persistence** - Cross-scenario data storage

#### Insurance Domain Data
```typescript
// Customer Generation
const customer = testDataManager.generateInsuranceCustomer({
  personalInfo: { age: 35, state: 'CA' },
  financial: { income: 75000 }
});

// Vehicle Generation
const vehicle = testDataManager.generateVehicle({
  year: 2020,
  make: 'Toyota'
});

// Policy Generation
const policy = testDataManager.generatePolicy({
  type: 'auto',
  coverage: 'full'
});
```

#### Data Categories
- **Personal Information** - Names, addresses, demographics
- **Contact Information** - Emails, phones, validated formats
- **Financial Data** - Income, credit scores, payment info
- **Vehicle Information** - Make, model, VIN, specifications
- **Property Data** - Addresses, values, characteristics
- **Health Information** - Medical history, conditions
- **Policy Details** - Coverage types, limits, deductibles

---

## Development Guidelines

### 1. Code Organization
- **Separation of Concerns** - Clear layer boundaries
- **Single Responsibility** - One purpose per class/function
- **DRY Principle** - Reusable components and utilities
- **Type Safety** - Full TypeScript implementation

### 2. Naming Conventions
```typescript
// Classes: PascalCase
class BrowserManager { }

// Functions/Variables: camelCase
async function initializeBrowser() { }

// Constants: UPPER_SNAKE_CASE
const DEFAULT_TIMEOUT = 30000;

// Files: kebab-case
common-steps.ts
playwright-website.feature
```

### 3. Error Handling
```typescript
try {
  await this.page.locator(selector).click();
} catch (error) {
  this.logMessage(`Failed to click element: ${error}`, 'error');
  throw new Error(`Element interaction failed: ${selector}`);
}
```

### 4. Async/Await Pattern
```typescript
// Preferred
async function performAction(): Promise<void> {
  await this.waitForElement(selector);
  await this.clickElement(selector);
}

// Avoid
function performAction() {
  return this.waitForElement(selector)
    .then(() => this.clickElement(selector));
}
```

---

## Advanced Features

### 1. Parallel Execution
```bash
# Run tests in parallel
npm run test:parallel

# Configuration
"test:parallel": "cucumber-js --parallel 4 --config cucumber.config.js"
```

### 2. Tag-Based Execution
```bash
# Run specific test types
npm run test:smoke      # @smoke tests
npm run test:regression # @regression tests
npm run test:critical   # @critical tests
npm run test:e2e        # @e2e tests
```

### 3. Cross-Browser Testing
```bash
# Browser-specific execution
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:chrome
```

### 4. Debug Mode
```bash
# Enable debug features
DEBUG=true npm test

# Features enabled:
# - Detailed logging
# - Step-by-step screenshots
# - Network request logging
# - Extended timeouts
```

### 5. CI/CD Integration
Environment variables for automation:
```bash
CI=true                    # CI mode detection
HEADLESS=true             # Headless browser mode
BROWSER=chromium          # Browser selection
ENVIRONMENT=staging       # Test environment
PARALLEL=4                # Parallel execution
```

### 6. Custom Reporting
```typescript
// Custom report generation
npm run report:generate   # Generate enhanced reports
npm run report:open       # Open reports in browser
npm run clean:reports     # Clean old reports
```

---

## Troubleshooting

### Common Issues

#### 1. Browser Initialization Failures
```bash
# Symptoms: Browser fails to start
# Solutions:
- Check Playwright browser installation
- Verify system dependencies
- Review browser configuration
- Check for port conflicts
```

#### 2. Element Not Found Errors
```bash
# Symptoms: Selector timeouts
# Solutions:
- Verify element selectors in dev tools
- Check for dynamic content loading
- Add explicit waits
- Review page object implementations
```

#### 3. Step Definition Conflicts
```bash
# Symptoms: Ambiguous step matches
# Solutions:
- Review step definition patterns
- Make regex patterns more specific
- Check for duplicate definitions
- Use parameter types properly
```

### Debug Strategies

#### 1. Enable Debug Mode
```bash
DEBUG=true npm test
```

#### 2. Use Browser Debugging
```typescript
// Add to step definition
await this.page.pause(); // Interactive debugging
```

#### 3. Screenshot Analysis
```typescript
// Manual screenshots
When('I take a screenshot named "debug-point"')
```

#### 4. Trace Analysis
```bash
# Generate traces
npx playwright show-trace reports/traces/trace.zip
```

---

## Performance Optimization

### 1. Browser Lifecycle
- One browser per feature file
- Context reuse within features
- Proper cleanup to prevent memory leaks

### 2. Selector Optimization
- Prefer `data-testid` attributes
- Avoid complex CSS selectors
- Use visible text matching sparingly

### 3. Wait Strategies
- Explicit waits over fixed timeouts
- Smart element waiting
- Network idle detection

### 4. Parallel Execution
- Feature-level parallelization
- Resource-aware thread management
- Shared browser instances where possible

---

This framework provides a robust, scalable foundation for BDD automation testing with comprehensive features for modern web application testing.