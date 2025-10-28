import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../../support/testContext';
import { PlaywrightHomePage } from '../../pages/PlaywrightHomePage';

// Initialize page objects
let homePage: PlaywrightHomePage;

// homePage = new PlaywrightHomePage();
// Navigation steps
Given('I am on the Playwright homepage', async function (this: CustomWorld) {
  await this.initializePage();
  homePage = new PlaywrightHomePage(this.page);
  await homePage.navigateToHomePage();
});


// Verification steps
Then('I should see the Playwright hero text', async function (this: CustomWorld) {
  if (!homePage) {
    homePage = new PlaywrightHomePage(this.page);
  }
  // Just check if there's any text about Playwright on the page
  const playwrightText = this.page.locator('text=Playwright').first();
  await expect(playwrightText).toBeVisible();
});