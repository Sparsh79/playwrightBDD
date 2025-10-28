import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../../support/testContext';

// Common navigation steps
Given('I am on the {string} page', async function (this: CustomWorld, pageName: string) {
  await this.initializePage();
  const pageUrl = this.getPageUrl(pageName);
  await this.navigateToPage(pageUrl);
});

When('I navigate to the {string} page', async function (this: CustomWorld, pageName: string) {
  const pageUrl = this.getPageUrl(pageName);
  await this.navigateToPage(pageUrl);
});

When('I navigate to {string}', async function (this: CustomWorld, url: string) {
  await this.navigateToPage(url);
});

When('I refresh the page', async function (this: CustomWorld) {
  await this.reloadPage();
});

When('I go back', async function (this: CustomWorld) {
  await this.goBack();
});

When('I go forward', async function (this: CustomWorld) {
  await this.goForward();
});

// Common element interaction steps
When('I click on {string}', async function (this: CustomWorld, selector: string) {
  await this.clickElement(selector);
});

When('I click the {string} button', async function (this: CustomWorld, buttonName: string) {
  const selector = `[data-testid="${buttonName.toLowerCase()}-button"], button:has-text("${buttonName}")`;
  await this.clickElement(selector);
});

When(
  'I enter {string} in the {string} field',
  async function (this: CustomWorld, text: string, fieldName: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"], input[placeholder*="${fieldName}"]`;
    await this.fillInput(selector, text);
  }
);

When(
  'I enter {string} in {string}',
  async function (this: CustomWorld, text: string, selector: string) {
    await this.fillInput(selector, text);
  }
);

When('I clear the {string} field', async function (this: CustomWorld, fieldName: string) {
  const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
  await this.fillInput(selector, '');
});

When(
  'I select {string} from {string} dropdown',
  async function (this: CustomWorld, option: string, fieldName: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-select"], select[name="${fieldName}"]`;
    await this.selectOption(selector, option);
  }
);

When('I check the {string} checkbox', async function (this: CustomWorld, checkboxName: string) {
  const selector = `[data-testid="${checkboxName.toLowerCase()}-checkbox"], input[type="checkbox"][name="${checkboxName}"]`;
  await this.checkCheckbox(selector);
});

When('I uncheck the {string} checkbox', async function (this: CustomWorld, checkboxName: string) {
  const selector = `[data-testid="${checkboxName.toLowerCase()}-checkbox"], input[type="checkbox"][name="${checkboxName}"]`;
  await this.uncheckCheckbox(selector);
});

// Common verification steps
Then('I should see {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.locator(`text="${text}"`)).toBeVisible();
});

Then('I should see the text {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.locator(`text="${text}"`)).toBeVisible();
});

Then('I should not see {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.locator(`text="${text}"`)).not.toBeVisible();
});

Then('I should see {string} element', async function (this: CustomWorld, selector: string) {
  await expect(this.page.locator(selector)).toBeVisible();
});

Then('I should not see {string} element', async function (this: CustomWorld, selector: string) {
  await expect(this.page.locator(selector)).not.toBeVisible();
});

Then(
  'the {string} field should contain {string}',
  async function (this: CustomWorld, fieldName: string, expectedValue: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }
);

Then('the {string} field should be empty', async function (this: CustomWorld, fieldName: string) {
  const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
  await expect(this.page.locator(selector)).toHaveValue('');
});

Then(
  'the {string} button should be {string}',
  async function (this: CustomWorld, buttonName: string, state: string) {
    const selector = `[data-testid="${buttonName.toLowerCase()}-button"], button:has-text("${buttonName}")`;
    const locator = this.page.locator(selector);

    switch (state.toLowerCase()) {
      case 'enabled':
        await expect(locator).toBeEnabled();
        break;
      case 'disabled':
        await expect(locator).toBeDisabled();
        break;
      case 'visible':
        await expect(locator).toBeVisible();
        break;
      case 'hidden':
        await expect(locator).not.toBeVisible();
        break;
      default:
        throw new Error(
          `Unknown button state: ${state}. Valid states: enabled, disabled, visible, hidden`
        );
    }
  }
);

Then(
  'the page title should be {string}',
  async function (this: CustomWorld, expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
);

Then(
  'the page title should contain {string}',
  async function (this: CustomWorld, partialTitle: string) {
    await expect(this.page).toHaveTitle(new RegExp(partialTitle, 'i'));
  }
);

Then('the URL should be {string}', async function (this: CustomWorld, expectedUrl: string) {
  await expect(this.page).toHaveURL(expectedUrl);
});

Then('the URL should contain {string}', async function (this: CustomWorld, urlPart: string) {
  await expect(this.page).toHaveURL(new RegExp(urlPart));
});

// Wait steps
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  await this.waitForTimeout(seconds * 1000);
});

When('I wait for {int} milliseconds', async function (this: CustomWorld, milliseconds: number) {
  await this.waitForTimeout(milliseconds);
});

When('I wait for {string} to be visible', async function (this: CustomWorld, selector: string) {
  await this.waitForElement(selector);
});

When('I wait for {string} to disappear', async function (this: CustomWorld, selector: string) {
  await this.page.waitForSelector(selector, { state: 'detached' });
});

// Screenshot steps
When('I take a screenshot', async function (this: CustomWorld) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await this.takeScreenshot(`manual-${timestamp}`);
});

When('I take a screenshot named {string}', async function (this: CustomWorld, name: string) {
  await this.takeScreenshot(name);
});

// Scroll steps
When('I scroll to {string}', async function (this: CustomWorld, selector: string) {
  await this.page.locator(selector).scrollIntoViewIfNeeded();
});

When('I scroll to the top of the page', async function (this: CustomWorld) {
  await this.page.evaluate(() => window.scrollTo(0, 0));
});

When('I scroll to the bottom of the page', async function (this: CustomWorld) {
  await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

// Data validation steps
Then(
  'the {string} field should have a valid email',
  async function (this: CustomWorld, fieldName: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
    const value = await this.page.locator(selector).inputValue();
    const isValid = this.validateEmail(value);
    expect(isValid).toBe(true);
  }
);

Then(
  'the {string} field should have a valid phone number',
  async function (this: CustomWorld, fieldName: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
    const value = await this.page.locator(selector).inputValue();
    const isValid = this.validatePhone(value);
    expect(isValid).toBe(true);
  }
);

Then(
  'the {string} field should have a valid SSN',
  async function (this: CustomWorld, fieldName: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
    const value = await this.page.locator(selector).inputValue();
    const isValid = this.validateSSN(value);
    expect(isValid).toBe(true);
  }
);

Then(
  'the {string} field should have a valid zip code',
  async function (this: CustomWorld, fieldName: string) {
    const selector = `[data-testid="${fieldName.toLowerCase()}-input"], input[name="${fieldName}"]`;
    const value = await this.page.locator(selector).inputValue();
    const isValid = this.validateZipCode(value);
    expect(isValid).toBe(true);
  }
);

// Debug steps
When('I debug pause for {int} seconds', async function (this: CustomWorld, seconds: number) {
  if (this.isDebugMode()) {
    this.logMessage(`Debug pause for ${seconds} seconds`, 'debug');
    await this.waitForTimeout(seconds * 1000);
  }
});

When('I log {string}', async function (this: CustomWorld, message: string) {
  this.logMessage(message, 'info');
});

// Insurance domain specific steps
When('I generate a random customer', async function (this: CustomWorld) {
  const customer = this.generateInsuranceCustomer();
  this.setScenarioData('generatedCustomer', customer);
  this.logMessage(`Generated customer: ${customer.personalInfo.fullName}`, 'debug');
});

When('I generate a random vehicle', async function (this: CustomWorld) {
  const vehicle = this.generateVehicle();
  this.setScenarioData('generatedVehicle', vehicle);
  this.logMessage(`Generated vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}`, 'debug');
});

When('I use invalid email data', async function (this: CustomWorld) {
  const invalidEmail = this.getInvalidEmail();
  this.setScenarioData('invalidEmail', invalidEmail);
  this.logMessage(`Using invalid email: ${invalidEmail}`, 'debug');
});

When('I use invalid phone data', async function (this: CustomWorld) {
  const invalidPhone = this.getInvalidPhone();
  this.setScenarioData('invalidPhone', invalidPhone);
  this.logMessage(`Using invalid phone: ${invalidPhone}`, 'debug');
});
