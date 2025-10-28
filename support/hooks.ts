import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { promises as fs } from 'fs';
import browserManager from '../utils/browserManager';
import configManager from '../utils/configManager';
import { CustomWorld } from './testContext';

// Global setup - runs once before all features
BeforeAll(async function () {
  console.log('Starting BDD Test Execution...');
  console.log(`Environment: ${configManager.getEnvironment()}`);
  console.log(`Base URL: ${configManager.getTestConfig().baseURL}`);
  console.log(`Browser: ${configManager.getBrowserConfig().browser}`);

  // Validate configuration
  try {
    configManager.validateConfig();
    console.log('Configuration validation passed');
  } catch (error) {
    console.error('Configuration validation failed:', error);
    throw error;
  }

  // Create reports directories if they don't exist
  const reportDirs = [
    configManager.getReportConfig().outputDir,
    'reports/cucumber',
    'reports/screenshots',
    'reports/videos',
    'reports/traces',
  ];

  for (const dir of reportDirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error - continue
    }
  }

  console.log(' Report directories created');
});

// Feature-level setup - runs once per feature file
let currentFeatureUri: string | null = null;

Before(async function (scenario) {
  const featureUri = scenario.gherkinDocument?.uri || scenario.pickle.uri;
  
  // Check if this is a new feature file
  if (currentFeatureUri !== featureUri) {
    // Cleanup previous feature's browser if it exists
    if (currentFeatureUri && browserManager.isReady()) {
      console.log(' Cleaning up browser from previous feature...');
      await browserManager.cleanup();
    }
    
    // Initialize browser for new feature
    console.log(` Initializing browser for feature: ${featureUri}`);
    await browserManager.initializeBrowser();
    console.log(' Browser initialized and ready');
    currentFeatureUri = featureUri;
  }
});

// Scenario setup - runs before each scenario
Before(async function (this: CustomWorld, scenario) {
  console.log(`\n Starting scenario: "${scenario.pickle.name}"`);

  // Store scenario info for reporting
  this.setScenarioData('scenarioName', scenario.pickle.name);
  this.setScenarioData(
    'scenarioTags',
    scenario.pickle.tags.map(tag => tag.name)
  );
  this.setScenarioData('startTime', Date.now());

  // Initialize page for this scenario (reusing browser from feature)
  await this.initializePage();

  // Log scenario details
  const tags = scenario.pickle.tags.map(tag => tag.name).join(', ');
  if (tags) {
    console.log(`  Tags: ${tags}`);
  }

  if (configManager.isDebugMode()) {
    console.log(` Debug mode enabled for scenario`);
  }
});

// Tag-specific setup hooks
Before({ tags: '@smoke' }, async function (this: CustomWorld) {
  this.logMessage(' Running SMOKE test - verifying critical functionality', 'info');
});

Before({ tags: '@critical' }, async function (this: CustomWorld) {
  this.logMessage('  Running CRITICAL test - high priority functionality', 'info');
});

Before({ tags: '@regression' }, async function (this: CustomWorld) {
  this.logMessage(' Running REGRESSION test - ensuring existing functionality works', 'info');
});

Before({ tags: '@e2e' }, async function (this: CustomWorld) {
  this.logMessage(' Running END-TO-END test - complete user journey', 'info');
});

Before({ tags: '@auth' }, async function (this: CustomWorld) {
  this.logMessage(' Running AUTHENTICATION test', 'info');
});

Before({ tags: '@debug' }, async function (this: CustomWorld) {
  this.logMessage(' Running DEBUG test - detailed logging enabled', 'info');
  // Set additional debug flags
  process.env.DEBUG_CONSOLE = 'true';
});

// Scenario cleanup - runs after each scenario
After(async function (this: CustomWorld, scenario) {
  const scenarioName = this.getScenarioData('scenarioName');
  const startTime = this.getScenarioData('startTime');
  const duration = Date.now() - startTime;

  console.log(`Scenario "${scenarioName}" completed in ${duration}ms`);

  // Handle scenario result
  const status = scenario.result?.status;

  if (status === Status.FAILED) {
    console.log(`Scenario FAILED: ${scenarioName}`);

    // Take screenshot on failure
    try {
      const screenshotName = `failed-${scenarioName.replace(/[^a-zA-Z0-9]/g, '-')}`;
      await this.attachScreenshot(screenshotName);
      console.log('Screenshot captured for failed scenario');
    } catch (error) {
      console.warn(`  Could not capture failure screenshot: ${error}`);
    }

    // Log failure details
    if (scenario.result?.message) {
      console.log(`Failure reason: ${scenario.result.message}`);
    }
  } else if (status === Status.PASSED) {
    console.log(` Scenario PASSED: ${scenarioName}`);
  } else if (status === Status.SKIPPED) {
    console.log(`Scenario SKIPPED: ${scenarioName}`);
  }

  // Clear scenario-specific data
  this.clearScenarioData();

  // Reset debug flags
  if (process.env.DEBUG_CONSOLE === 'true') {
    delete process.env.DEBUG_CONSOLE;
  }
});

// Tag-specific cleanup hooks
After({ tags: '@smoke' }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    console.log('CRITICAL: Smoke test failed - basic functionality is broken!');
  }
});

After({ tags: '@critical' }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    console.log('HIGH PRIORITY: Critical test failed - requires immediate attention!');
  }
});

After({ tags: '@e2e' }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    console.log(' END-TO-END test failed - user journey is broken');
  }
});

// Global cleanup - runs once after all features
AfterAll(async function () {
  console.log('\n BDD Test Execution Completed');
  
  // Final cleanup if browser is still running
  if (browserManager.isReady()) {
    console.log(' Final browser cleanup...');
    await browserManager.cleanup();
    console.log(' Final cleanup completed');
  }

  // Generate test summary from reports
  try {
    const reportPath = 'reports/cucumber/cucumber-report.json';
    const reportData = await fs.readFile(reportPath, 'utf8');
    const report = JSON.parse(reportData);

    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    let skippedScenarios = 0;

    report.forEach((feature: any) => {
      if (feature.elements) {
        feature.elements.forEach((scenario: any) => {
          if (scenario.type === 'scenario') {
            totalScenarios++;
            const hasFailedStep = scenario.steps?.some(
              (step: any) => step.result?.status === 'failed'
            );
            const hasSkippedStep = scenario.steps?.some(
              (step: any) => step.result?.status === 'skipped'
            );

            if (hasFailedStep) {
              failedScenarios++;
            } else if (hasSkippedStep) {
              skippedScenarios++;
            } else {
              passedScenarios++;
            }
          }
        });
      }
    });

    // Print test summary
    console.log('\nTEST EXECUTION SUMMARY');
    console.log('========================');
    console.log(`Total Scenarios: ${totalScenarios}`);
    console.log(` Passed: ${passedScenarios}`);
    console.log(`Failed: ${failedScenarios}`);
    console.log(`Skipped: ${skippedScenarios}`);

    if (totalScenarios > 0) {
      const successRate = ((passedScenarios / totalScenarios) * 100).toFixed(2);
      console.log(`Success Rate: ${successRate}%`);

      // Determine overall result
      if (failedScenarios === 0) {
        console.log('ALL TESTS PASSED!');
      } else if (failedScenarios > totalScenarios * 0.5) {
        console.log('CRITICAL: More than 50% of tests failed!');
      } else {
        console.log(`  ${failedScenarios} test(s) failed - review required`);
      }
    }

    console.log(`\n Reports generated in: ${configManager.getReportConfig().outputDir}`);
  } catch (error) {
    console.log('  Could not generate test summary from report file');
    if (configManager.isDebugMode()) {
      console.log(`Debug: ${error}`);
    }
  }

  console.log('\n Thank you for using the BDD Automation Framework!');
});
