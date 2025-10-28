# BDD Automation Framework with Cucumber.js and Playwright

![Framework](https://img.shields.io/badge/Framework-BDD%20Automation-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.56.1-green)
![Cucumber](https://img.shields.io/badge/Cucumber.js-12.2.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

A comprehensive, production-ready BDD automation framework combining the power of Cucumber.js and Playwright for modern web application testing.

## Key Features

- **BDD with Gherkin** - Natural language test scenarios
- **Cross-Browser Support** - Chromium, Firefox, WebKit, Chrome
- **One Browser Per Feature** - Optimized resource management
- **TypeScript First** - Full type safety and IntelliSense
- **Rich Reporting** - HTML, JSON, Screenshots, Videos, Traces
- **Dynamic Test Data** - Faker.js integration with domain-specific generators
- **Parallel Execution** - Fast test execution
- **Insurance Domain Ready** - Pre-built utilities for insurance testing
- **CI/CD Ready** - GitHub Actions, Jenkins, Azure DevOps compatible
- **Debug Mode** - Enhanced debugging capabilities

## Project Structure

```
playwright_proposal_framework/
├── features/                    # BDD Feature files and step definitions
│   ├── playwright-website.feature
│   └── step-definitions/
│       ├── common-steps.ts      # Reusable step definitions
│       └── playwright-website-steps.ts
├── support/                     # Framework support files
│   ├── hooks.ts                 # Cucumber lifecycle hooks
│   └── testContext.ts           # Test world and utilities
├── pages/                       # Page Object Model
│   ├── BasePage.ts
│   └── PlaywrightHomePage.ts
├── utils/                       # Framework utilities
│   ├── browserManager.ts        # Browser lifecycle management
│   ├── configManager.ts         # Configuration management
│   ├── testDataManager.ts       # Test data generation
│   └── cucumber-report.ts       # Enhanced reporting
├── data/                        # Test data and factories
├── docs/                        # Comprehensive documentation
│   ├── common-steps-guide.md
│   └── framework-documentation.md
├── reports/                     # Test execution reports
└── README.md                    # This file
```

## Installation & Setup

### Prerequisites
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd playwright_automation_framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify installation
npm run validate:config

# Run your first test
npm test
```

## 🎯 Usage

### Basic Test Execution

```bash
# Run all tests
npm test

# Run specific browser tests
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:chrome

# Run with browser visible (headed mode)
npm run test:headed

# Run in background (headless mode)
npm run test:headless
```

### Tag-Based Execution

```bash
# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run critical tests
npm run test:critical

# Run end-to-end tests
npm run test:e2e

# Run demo tests
npm run test:demo
```

### Parallel & Performance Testing

```bash
# Run tests in parallel (4 workers)
npm run test:parallel

# Run tests serially
npm run test:serial

# Debug mode with detailed logging
npm run test:debug
```

### Custom Tag Execution

```bash
# Run specific tags
npm run test:tag -- --tags "@smoke and @critical"
```

## Writing Tests

### Feature File Example
```gherkin
@smoke @demo
Feature: User Authentication
  As a user of the application
  I want to log into my account
  So that I can access my dashboard

  Background:
    Given I am on the "login" page

  Scenario: Successful login with valid credentials
    When I enter "user@test.com" in the "email" field
    And I enter "password123" in the "password" field
    And I click the "Login" button
    Then I should see "Welcome back!"
    And the URL should contain "dashboard"

  Scenario Outline: Login validation with invalid data
    When I enter "<email>" in the "email" field
    And I enter "<password>" in the "password" field
    And I click the "Login" button
    Then I should see "<error_message>"

    Examples:
      | email           | password    | error_message      |
      | invalid-email   | password123 | Invalid email      |
      | user@test.com   | wrong       | Invalid password   |
      | empty           | empty       | Fields required    |
```

### Step Definition Example
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../../support/testContext';

Given('I am logged in as {string}', async function (this: CustomWorld, userRole: string) {
  const userData = this.getUserData(userRole);
  await this.navigateToPage('/login');
  await this.fillInput('#email', userData.email);
  await this.fillInput('#password', userData.password);
  await this.clickElement('[data-testid="login-button"]');
  await this.waitForElement('[data-testid="dashboard"]');
});
```

### Page Object Example
```typescript
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private selectors = {
    emailField: '[data-testid="email-input"]',
    passwordField: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    errorMessage: '[data-testid="error-message"]'
  };

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.selectors.emailField, email);
    await this.fillInput(this.selectors.passwordField, password);
    await this.clickElement(this.selectors.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.selectors.errorMessage);
  }
}
```

## Configuration

### Environment Configuration
Create environment-specific config files:

```typescript
// utils/configManager.ts configuration
const environments = {
  test: {
    baseURL: 'https://test.example.com',
    timeout: 30000,
    retries: 1
  },
  staging: {
    baseURL: 'https://staging.example.com',
    timeout: 60000,
    retries: 2
  },
  production: {
    baseURL: 'https://example.com',
    timeout: 30000,
    retries: 0
  }
};
```

### Browser Configuration
```typescript
// playwright.config.ts
export default {
  testDir: './features',
  timeout: 60000,
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
};
```

### Environment Variables
```bash
# Test environment
ENVIRONMENT=test|staging|prod

# Browser settings
BROWSER=chromium|firefox|webkit
HEADLESS=true|false

# Execution settings
PARALLEL=4                    # Number of parallel workers
DEBUG=true                    # Enable debug mode
CI=true                       # CI mode detection
```

## Reporting

### Generated Reports
After test execution, reports are available in the `reports/` directory:

- **HTML Report**: `reports/cucumber/cucumber-report.html`
- **JSON Report**: `reports/cucumber/cucumber-report.json`
- **Screenshots**: `reports/screenshots/` (failure captures)
- **Videos**: `reports/videos/` (test execution recordings)
- **Traces**: `reports/traces/` (Playwright debugging traces)

### Report Commands
```bash
# Generate enhanced reports
npm run report:generate

# Open HTML report in browser
npm run report:open

# Clean old reports
npm run clean:reports
```

### Sample Report Output
```
TEST EXECUTION SUMMARY
========================
Total Scenarios: 15
Passed: 12
Failed: 2
Skipped: 1
Success Rate: 80.00%

2 test(s) failed - review required

Reports generated in: reports/
```

## Test Data Management

### Dynamic Data Generation
```typescript
// Generate test data
When('I generate a random customer', async function (this: CustomWorld) {
  const customer = this.generateInsuranceCustomer({
    personalInfo: { age: 35, state: 'CA' },
    financial: { income: 75000 }
  });
  this.setScenarioData('customer', customer);
});

// Use generated data
When('I enter the customer email', async function (this: CustomWorld) {
  const customer = this.getScenarioData('customer');
  await this.fillInput('#email', customer.personalInfo.email);
});
```

### Insurance Domain Data
Pre-built generators for insurance testing:
- **Customer Data**: Personal info, demographics, financial data
- **Vehicle Data**: Make, model, VIN, specifications
- **Property Data**: Addresses, valuations, characteristics
- **Policy Data**: Coverage types, limits, deductibles
- **Claims Data**: Incident details, damages, settlements

## Debugging

### Debug Mode
```bash
# Enable comprehensive debugging
DEBUG=true npm test

# Features enabled:
# - Detailed step logging
# - Screenshot on each step
# - Network request logging
# - Extended timeouts
# - Browser developer tools
```

### Interactive Debugging
```typescript
// Add to step definition for breakpoint
await this.page.pause();

// Manual screenshot
When('I take a screenshot named "checkpoint"', async function (this: CustomWorld) {
  await this.takeScreenshot('checkpoint');
});

// Debug logging
When('I log "Debug checkpoint reached"', async function (this: CustomWorld) {
  this.logMessage('Debug checkpoint reached', 'debug');
});
```

### Trace Analysis
```bash
# View Playwright traces
npx playwright show-trace reports/traces/trace-scenario-name.zip
```

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Common Steps Guide](docs/common-steps-guide.md)** - Complete guide to reusable step definitions
- **[Framework Documentation](docs/framework-documentation.md)** - Detailed technical documentation

### Quick Reference

#### Common Steps
```gherkin
# Navigation
Given I am on the "homepage" page
When I navigate to the "dashboard" page

# Interactions
When I click the "Submit" button
When I enter "text" in the "field" field
When I select "option" from "dropdown" dropdown

# Verifications
Then I should see "Expected text"
Then the "field" field should contain "value"
Then the page title should contain "Title"

# Waits
When I wait for 3 seconds
When I wait for "#element" to be visible
```

## Code Style Guidelines
- Use TypeScript for type safety
- Follow async/await patterns
- Use descriptive variable and function names
- Add comprehensive error handling
- Include appropriate logging

### Adding New Features
1. Create feature branch from main
2. Add comprehensive tests
3. Update documentation
4. Ensure all tests pass
5. Submit pull request

### Step Definition Guidelines
```typescript
// Good: Reusable and descriptive
When('I enter {string} in the {string} field', async function (text: string, field: string) {
  const selector = `[data-testid="${field}-input"]`;
  await this.fillInput(selector, text);
});

// Avoid: Too specific or hard to reuse
When('I enter email in the second input field on login page', async function () {
  // Too specific implementation
});
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:chromium` | Run tests in Chromium |
| `npm run test:firefox` | Run tests in Firefox |
| `npm run test:webkit` | Run tests in WebKit |
| `npm run test:chrome` | Run tests in Chrome |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:headless` | Run tests in background |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:regression` | Run regression tests |
| `npm run test:critical` | Run critical tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:parallel` | Run tests in parallel |
| `npm run test:debug` | Run tests in debug mode |
| `npm run typecheck` | Check TypeScript types |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run validate:config` | Validate framework configuration |
| `npm run report:generate` | Generate enhanced reports |
| `npm run report:open` | Open HTML reports |
| `npm run clean:reports` | Clean old reports |

## Troubleshooting

### Common Issues

#### Browser Installation Issues
```bash
# Reinstall Playwright browsers
npx playwright install --force

# Install system dependencies (Linux)
npx playwright install-deps
```

#### Test Failures
```bash
# Enable debug mode for detailed logs
DEBUG=true npm test

# Run single test for isolation
npm test -- --grep "specific test name"

# Check for selector issues
npm run test:headed  # Visual debugging
```

#### Configuration Issues
```bash
# Validate configuration
npm run validate:config

# Check environment variables
echo $ENVIRONMENT
echo $BROWSER
```

### Getting Help
- Check the [Framework Documentation](docs/framework-documentation.md)
- Review the [Common Steps Guide](docs/common-steps-guide.md)
- Enable debug mode for detailed logs
- Check test reports for failure details

---