# Common Steps Guide

This guide provides comprehensive documentation for all reusable step definitions available in the framework. These common steps follow Gherkin best practices and can be used across all feature files.

## Table of Contents
- [Navigation Steps](#navigation-steps)
- [Element Interaction Steps](#element-interaction-steps)
- [Verification Steps](#verification-steps)
- [Wait Steps](#wait-steps)
- [Screenshot Steps](#screenshot-steps)
- [Scroll Steps](#scroll-steps)
- [Data Validation Steps](#data-validation-steps)
- [Debug Steps](#debug-steps)
- [Insurance Domain Steps](#insurance-domain-steps)

---

## Navigation Steps

### Page Navigation
```gherkin
Given I am on the "homepage" page
When I navigate to the "dashboard" page
When I navigate to "https://example.com"
When I refresh the page
When I go back
When I go forward
```

**Supported page names:**
- `home`, `login`, `dashboard`, `profile`, `settings`
- `quote`, `policy`, `claims`, `about`, `contact`
- Any URL starting with `http://` or `https://`

---

## Element Interaction Steps

### Clicking Elements
```gherkin
When I click on "[data-testid='submit-button']"
When I click the "Submit" button
```

### Text Input
```gherkin
When I enter "John Doe" in the "firstName" field
When I enter "test@example.com" in "[data-testid='email-input']"
When I clear the "firstName" field
```

### Dropdowns and Selection
```gherkin
When I select "California" from "state" dropdown
When I check the "terms" checkbox
When I uncheck the "newsletter" checkbox
```

**Field Selector Logic:**
The framework automatically tries multiple selector strategies:
- `[data-testid="{fieldName}-input"]`
- `input[name="{fieldName}"]`
- `input[placeholder*="{fieldName}"]`

---

## Verification Steps

### Text Verification
```gherkin
Then I should see "Welcome back!"
Then I should see the text "Login successful"
Then I should not see "Error occurred"
```

### Element Verification
```gherkin
Then I should see "[data-testid='success-message']" element
Then I should not see "[data-testid='error-message']" element
```

### Field Value Verification
```gherkin
Then the "firstName" field should contain "John"
Then the "email" field should be empty
```

### Button State Verification
```gherkin
Then the "Submit" button should be "enabled"
Then the "Delete" button should be "disabled"
Then the "Cancel" button should be "visible"
Then the "Hidden" button should be "hidden"
```

**Supported button states:** `enabled`, `disabled`, `visible`, `hidden`

### Page Verification
```gherkin
Then the page title should be "Dashboard - MyApp"
Then the page title should contain "Dashboard"
Then the URL should be "https://example.com/dashboard"
Then the URL should contain "dashboard"
```

---

## Wait Steps

### Time-based Waits
```gherkin
When I wait for 3 seconds
When I wait for 1500 milliseconds
```

### Element-based Waits
```gherkin
When I wait for "[data-testid='loading-spinner']" to be visible
When I wait for "[data-testid='loading-spinner']" to disappear
```

---

## Screenshot Steps

```gherkin
When I take a screenshot
When I take a screenshot named "login-success"
```

Screenshots are automatically saved to `reports/screenshots/` directory.

---

## Scroll Steps

```gherkin
When I scroll to "[data-testid='footer']"
When I scroll to the top of the page
When I scroll to the bottom of the page
```

---

## Data Validation Steps

### Email Validation
```gherkin
Then the "email" field should have a valid email
```

### Phone Number Validation
```gherkin
Then the "phone" field should have a valid phone number
```

**Supported formats:** `123-456-7890`, `1234567890`

### SSN Validation
```gherkin
Then the "ssn" field should have a valid SSN
```

**Supported formats:** `123-45-6789`, `123456789`

### Zip Code Validation
```gherkin
Then the "zipCode" field should have a valid zip code
```

**Supported formats:** `12345`, `12345-6789`

---

## Debug Steps

### Debug Utilities
```gherkin
When I debug pause for 5 seconds
When I log "Checkpoint reached"
```

**Note:** Debug pause only works when `DEBUG=true` environment variable is set.

---

## Insurance Domain Steps

### Test Data Generation
```gherkin
When I generate a random customer
When I generate a random vehicle
When I use invalid email data
When I use invalid phone data
```

**Generated data is stored in scenario context and can be accessed in subsequent steps.**

### Customer Data Fields
Generated customer includes:
- Personal info (name, email, phone, address)
- Demographics (age, gender, marital status)
- Financial info (income, credit score)

### Vehicle Data Fields
Generated vehicle includes:
- Basic info (year, make, model, VIN)
- Details (mileage, condition, usage)
- Safety features and modifications

---

## Best Practices

### 1. Selector Strategy
- **Preferred:** Use `data-testid` attributes
- **Fallback:** Use semantic selectors like `button:has-text("Submit")`
- **Avoid:** CSS classes or complex XPath expressions

### 2. Step Composition
```gherkin
# Good - Readable and maintainable
Given I am on the "login" page
When I enter "user@test.com" in the "email" field
And I enter "password123" in the "password" field
And I click the "Login" button
Then I should see "Welcome back!"

# Avoid - Too specific or hard to reuse
When I enter "user@test.com" in the email field located at position 2
```

### 3. Data Management
```gherkin
# Use generated data for dynamic tests
When I generate a random customer
And I enter the customer email in the "email" field
And I enter the customer phone in the "phone" field
```

### 4. Error Handling
- All steps include automatic retries and proper error messages
- Screenshots are automatically captured on failures
- Debug information is logged when `DEBUG=true`

---

## Extending Common Steps

### Adding New Steps
1. Add step definitions to `features/step-definitions/common-steps.ts`
2. Follow the existing naming conventions
3. Use the `CustomWorld` context for shared functionality
4. Include proper error handling and logging
5. Update this documentation

### Example New Step
```typescript
When('I hover over {string}', async function (this: CustomWorld, selector: string) {
  await this.page.locator(selector).hover();
});
```

---

## Troubleshooting

### Common Issues

**Step not found:**
- Check the exact step text matches the regex pattern
- Verify the step is imported in your feature file directory

**Element not found:**
- Use browser dev tools to verify selectors
- Check if element is in an iframe
- Ensure element is visible and not hidden

**Timeout errors:**
- Increase timeout in configuration
- Add explicit waits before interactions
- Check for loading states or animations

### Debug Mode
Enable debug mode by setting environment variable:
```bash
DEBUG=true npm test
```

This provides:
- Detailed step execution logs
- Browser screenshots on each step
- Network request logging
- Enhanced error messages