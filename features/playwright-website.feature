@abc
Feature: Playwright Website Basic Testing
  As a framework demonstration
  I want to test basic functionality of Playwright website
  So that I can showcase the framework capabilities

  @smoke @demo
  Scenario: Playwright website homepage loads
    Given I am on the Playwright homepage
    # Dummy step, just to showcase how we can use common step-definitions
    When I navigate to the "settings" page
    Then the page title should contain "Playwright"
    And I should see the Playwright hero text

  @demo @navigation
  Scenario: Navigate to documentation
    Given I am on the Playwright homepage
    When I wait for 5 seconds