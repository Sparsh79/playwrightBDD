/**
 * Insurance Domain Test Data Examples
 *
 * This file provides example usage of the TestDataManager for insurance-specific testing.
 * It demonstrates how to generate realistic test data for various insurance scenarios.
 */

import testDataManager from '../utils/testDataManager';

export class InsuranceTestExamples {
  /**
   * Example 1: Generate a complete customer profile for auto insurance quote
   */
  static getAutoInsuranceCustomer() {
    const customer = testDataManager.generateInsuranceCustomer({
      personalInfo: {
        age: 35,
        maritalStatus: 'married',
        // Other fields will be auto-generated
      },
      employment: {
        employmentType: 'full-time',
        annualIncome: 75000,
      },
      financials: {
        creditScore: 720,
      },
    });

    const vehicle = testDataManager.generateVehicle({
      year: 2020,
      vehicleType: 'sedan',
      value: 25000,
    });

    return { customer, vehicle };
  }

  /**
   * Example 2: Generate homeowner insurance data
   */
  static getHomeInsuranceData() {
    const customer = testDataManager.generateInsuranceCustomer({
      personalInfo: {
        maritalStatus: 'married',
        age: 42,
      },
      employment: {
        employmentType: 'full-time',
        annualIncome: 95000,
      },
    });

    const property = testDataManager.generateProperty({
      type: 'house',
      details: {
        yearBuilt: 2015,
        squareFootage: 2500,
        propertyValue: 450000,
        bedrooms: 4,
        bathrooms: 3,
      },
      safety: {
        hasSecuritySystem: true,
        hasFireAlarm: true,
      },
    });

    return { customer, property };
  }

  /**
   * Example 3: Generate life insurance applicant data
   */
  static getLifeInsuranceApplicant() {
    const customer = testDataManager.generateInsuranceCustomer({
      personalInfo: {
        age: 40,
        maritalStatus: 'married',
      },
      employment: {
        employmentType: 'full-time',
        annualIncome: 85000,
      },
    });

    const healthInfo = testDataManager.generateHealthInfo({
      smoker: false,
      drinker: false,
      medicalConditions: [], // Healthy applicant
    });

    const policy = testDataManager.generatePolicy({
      policyType: 'life',
      coverageAmount: 500000,
    });

    return { customer, healthInfo, policy };
  }

  /**
   * Example 4: Generate high-risk customer profile
   */
  static getHighRiskCustomer() {
    return testDataManager.generateInsuranceCustomer({
      personalInfo: {
        age: 22, // Young driver
      },
      financials: {
        creditScore: 580, // Lower credit score
      },
    });
  }

  /**
   * Example 5: Generate senior customer for insurance
   */
  static getSeniorCustomer() {
    const customer = testDataManager.generateInsuranceCustomer({
      personalInfo: {
        age: 68,
        maritalStatus: 'married',
      },
      employment: {
        employmentType: 'retired',
      },
    });

    const healthInfo = testDataManager.generateHealthInfo({
      medications: ['Lisinopril', 'Metformin'],
      medicalConditions: ['Hypertension', 'Diabetes'],
    });

    return { customer, healthInfo };
  }

  /**
   * Example 6: Generate business insurance data
   */
  static getBusinessInsuranceData() {
    const businessOwner = testDataManager.generateInsuranceCustomer({
      employment: {
        employmentType: 'full-time',
        position: 'Business Owner',
        annualIncome: 120000,
      },
    });

    const property = testDataManager.generateProperty({
      type: 'house', // Using as business property
      details: {
        squareFootage: 3000,
        propertyValue: 300000,
      },
    });

    const policy = testDataManager.generatePolicy({
      policyType: 'business',
      coverageAmount: 1000000,
    });

    return { businessOwner, property, policy };
  }

  /**
   * Example 7: Generate multiple quotes comparison data
   */
  static getMultipleQuotesData() {
    const customer = testDataManager.generateInsuranceCustomer();

    const vehicles = [
      testDataManager.generateVehicle({ vehicleType: 'sedan', year: 2019 }),
      testDataManager.generateVehicle({ vehicleType: 'suv', year: 2021 }),
      testDataManager.generateVehicle({ vehicleType: 'truck', year: 2018 }),
    ];

    return { customer, vehicles };
  }

  /**
   * Example 8: Generate claim data
   */
  static getClaimData() {
    const customer = testDataManager.generateInsuranceCustomer();
    const vehicle = testDataManager.generateVehicle();
    const policy = testDataManager.generatePolicy({
      policyType: 'auto',
    });

    // Store related data for claim scenario
    testDataManager.storeData('claimCustomer', customer);
    testDataManager.storeData('claimVehicle', vehicle);
    testDataManager.storeData('claimPolicy', policy);

    return { customer, vehicle, policy };
  }

  /**
   * Example 9: Generate invalid data for negative testing
   */
  static getInvalidCustomerData() {
    return {
      email: testDataManager.generateInvalidEmail(),
      phone: testDataManager.generateInvalidPhone(),
      ssn: testDataManager.generateInvalidSSN(),
      zipCode: testDataManager.generateInvalidZipCode(),
    };
  }

  /**
   * Example 10: Generate renewal data
   */
  static getRenewalData() {
    const existingCustomer = testDataManager.generateInsuranceCustomer();

    // Simulate updates for renewal
    const updatedCustomer = {
      ...existingCustomer,
      address: {
        ...existingCustomer.address,
        // New address
        street: 'Updated Street Address',
        city: 'New City',
      },
      employment: {
        ...existingCustomer.employment,
        // Salary increase
        annualIncome: existingCustomer.employment.annualIncome + 10000,
      },
    };

    return { existingCustomer, updatedCustomer };
  }
}

/**
 * Usage Examples in Test Steps:
 *
 * // In step definitions:
 * When('I create an auto insurance quote', function() {
 *   const { customer, vehicle } = InsuranceTestExamples.getAutoInsuranceCustomer();
 *   this.testCustomer = customer;
 *   this.testVehicle = vehicle;
 * });
 *
 * When('I fill customer information', function() {
 *   const customer = this.testCustomer;
 *   await this.page.fill('[data-testid="firstName"]', customer.personalInfo.firstName);
 *   await this.page.fill('[data-testid="lastName"]', customer.personalInfo.lastName);
 *   // ... continue with other fields
 * });
 *
 * When('I test with invalid email', function() {
 *   const invalidData = InsuranceTestExamples.getInvalidCustomerData();
 *   await this.page.fill('[data-testid="email"]', invalidData.email);
 * });
 */

export default InsuranceTestExamples;
