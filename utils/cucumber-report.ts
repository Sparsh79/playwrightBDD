import reporter from 'cucumber-html-reporter';
import { promises as fs } from 'fs';
import path from 'path';
import configManager from './configManager';

interface ReportOptions {
  theme: 'bootstrap' | 'hierarchy' | 'foundation' | 'simple';
  jsonFile: string;
  output: string;
  reportSuiteAsScenarios: boolean;
  scenarioTimestamp: boolean;
  launchReport: boolean;
  metadata: Record<string, string>;
}

export class CucumberReportGenerator {
  private static instance: CucumberReportGenerator;

  private constructor() {}

  static getInstance(): CucumberReportGenerator {
    if (!CucumberReportGenerator.instance) {
      CucumberReportGenerator.instance = new CucumberReportGenerator();
    }
    return CucumberReportGenerator.instance;
  }

  async generateReport(): Promise<void> {
    try {
      console.log('Generating enhanced Cucumber HTML report...');

      const reportConfig = configManager.getReportConfig();
      const browserConfig = configManager.getBrowserConfig();

      const options: ReportOptions = {
        theme: 'bootstrap',
        jsonFile: 'reports/cucumber/cucumber-report.json',
        output: 'reports/cucumber/cucumber-report-enhanced.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: false,
        metadata: {
          'App Version': '1.0.0',
          'Test Environment': configManager.getEnvironment(),
          Browser: browserConfig.browser,
          'Headless Mode': browserConfig.headless.toString(),
          Platform: process.platform,
          'Node Version': process.version,
          Parallel: configManager.getTestConfig().parallel.toString(),
          'Base URL': configManager.getTestConfig().baseURL,
          Executed: new Date().toLocaleString(),
          'Report Generated': new Date().toISOString(),
        },
      };

      // Check if JSON report file exists
      if (!(await this.fileExists(options.jsonFile))) {
        console.warn(`JSON report file not found: ${options.jsonFile}`);
        console.log('   Make sure tests have been executed and JSON reporter is configured.');
        return;
      }

      // Generate the enhanced report
      reporter.generate(options);

      console.log('Enhanced Cucumber HTML report generated successfully!');
      console.log(`Report location: ${options.output}`);

      // Generate summary statistics
      await this.generateSummaryReport(options.jsonFile);
    } catch (error) {
      console.error('Failed to generate Cucumber report:', error);
      throw error;
    }
  }

  private async generateSummaryReport(jsonFilePath: string): Promise<void> {
    try {
      const reportData = await fs.readFile(jsonFilePath, 'utf8');
      const report = JSON.parse(reportData);

      const summary = this.calculateSummary(report);

      console.log('\nTEST EXECUTION SUMMARY');
      console.log('==========================');
      console.log(`Features: ${summary.features.total}`);
      console.log(`Scenarios: ${summary.scenarios.total}`);
      console.log(`   Passed: ${summary.scenarios.passed}`);
      console.log(`   Failed: ${summary.scenarios.failed}`);
      console.log(`   Skipped: ${summary.scenarios.skipped}`);
      console.log(`Steps: ${summary.steps.total}`);
      console.log(`   Passed: ${summary.steps.passed}`);
      console.log(`   Failed: ${summary.steps.failed}`);
      console.log(`   Skipped: ${summary.steps.skipped}`);
      console.log(`Duration: ${summary.duration.formatted}`);
      console.log(`Success Rate: ${summary.successRate}%`);

      // Save summary to file
      const summaryPath = 'reports/cucumber/test-summary.json';
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      console.log(`Summary saved to: ${summaryPath}`);
    } catch (error) {
      console.warn('Could not generate summary report:', error);
    }
  }

  private calculateSummary(report: any[]): any {
    const summary = {
      features: { total: 0, passed: 0, failed: 0 },
      scenarios: { total: 0, passed: 0, failed: 0, skipped: 0 },
      steps: { total: 0, passed: 0, failed: 0, skipped: 0 },
      duration: { total: 0, formatted: '' },
      successRate: '0.00',
    };

    let totalDuration = 0;

    report.forEach((feature: any) => {
      summary.features.total++;
      let featureHasFailed = false;

      if (feature.elements) {
        feature.elements.forEach((scenario: any) => {
          if (scenario.type === 'scenario') {
            summary.scenarios.total++;
            let scenarioHasFailed = false;
            let scenarioHasSkipped = false;

            if (scenario.steps) {
              scenario.steps.forEach((step: any) => {
                summary.steps.total++;

                if (step.result) {
                  const status = step.result.status;

                  if (step.result.duration) {
                    totalDuration += step.result.duration;
                  }

                  switch (status) {
                    case 'passed':
                      summary.steps.passed++;
                      break;
                    case 'failed':
                      summary.steps.failed++;
                      scenarioHasFailed = true;
                      featureHasFailed = true;
                      break;
                    case 'skipped':
                      summary.steps.skipped++;
                      scenarioHasSkipped = true;
                      break;
                  }
                }
              });
            }

            // Determine scenario status
            if (scenarioHasFailed) {
              summary.scenarios.failed++;
            } else if (scenarioHasSkipped) {
              summary.scenarios.skipped++;
            } else {
              summary.scenarios.passed++;
            }
          }
        });
      }

      // Determine feature status
      if (featureHasFailed) {
        summary.features.failed++;
      } else {
        summary.features.passed++;
      }
    });

    // Calculate duration and success rate
    summary.duration.total = totalDuration;
    summary.duration.formatted = this.formatDuration(totalDuration);

    if (summary.scenarios.total > 0) {
      summary.successRate = ((summary.scenarios.passed / summary.scenarios.total) * 100).toFixed(2);
    }

    return summary;
  }

  private formatDuration(nanoseconds: number): string {
    const milliseconds = nanoseconds / 1000000;
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else if (seconds > 0) {
      return `${seconds}s ${Math.floor(milliseconds % 1000)}ms`;
    } else {
      return `${Math.floor(milliseconds)}ms`;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async openReport(): Promise<void> {
    const reportPath = 'reports/cucumber/cucumber-report-enhanced.html';

    if (await this.fileExists(reportPath)) {
      const { exec } = require('child_process');
      const command =
        process.platform === 'win32'
          ? 'start'
          : process.platform === 'darwin'
            ? 'open'
            : 'xdg-open';

      exec(`${command} ${reportPath}`, (error: any) => {
        if (error) {
          console.error('Could not open report automatically:', error);
          console.log(`Please open manually: ${path.resolve(reportPath)}`);
        } else {
          console.log('Report opened in default browser');
        }
      });
    } else {
      console.warn(`Report file not found: ${reportPath}`);
    }
  }
}

// CLI execution
if (require.main === module) {
  const reportGenerator = CucumberReportGenerator.getInstance();

  reportGenerator
    .generateReport()
    .then(() => {
      if (process.argv.includes('--open')) {
        return reportGenerator.openReport();
      }
      return Promise.resolve();
    })
    .catch(error => {
      console.error('Report generation failed:', error);
      process.exit(1);
    });
}

export default CucumberReportGenerator.getInstance();
