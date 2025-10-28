import { faker } from '@faker-js/faker';

// Deep Partial utility type for nested objects
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep merge utility function
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        typeof target[key] === 'object' &&
        target[key] !== null
      ) {
        (result as any)[key] = deepMerge(target[key], source[key] as any);
      } else {
        (result as any)[key] = source[key];
      }
    }
  }

  return result;
}

export interface InsuranceCustomer {
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    age: number;
    ssn: string;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    gender: 'male' | 'female' | 'other';
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullAddress: string;
  };
  employment: {
    company: string;
    position: string;
    industry: string;
    annualIncome: number;
    employmentType: 'full-time' | 'part-time' | 'contractor' | 'unemployed' | 'retired';
    yearsAtJob: number;
  };
  financials: {
    creditScore: number;
    annualIncome: number;
    monthlyDebt: number;
    bankAccount: string;
    routingNumber: string;
  };
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  color: string;
  mileage: number;
  vehicleType: 'sedan' | 'suv' | 'truck' | 'motorcycle' | 'van' | 'coupe';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  value: number;
}

export interface PropertyInfo {
  type: 'house' | 'condo' | 'apartment' | 'townhouse' | 'mobile-home';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  details: {
    yearBuilt: number;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    propertyValue: number;
    mortgageBalance: number;
    constructionType: 'frame' | 'masonry' | 'steel' | 'concrete';
    roofType: 'shingle' | 'tile' | 'metal' | 'flat';
  };
  safety: {
    hasSecuritySystem: boolean;
    hasFireAlarm: boolean;
    hasSprinklers: boolean;
    gatedCommunity: boolean;
  };
}

export interface HealthInfo {
  height: string;
  weight: number;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  smoker: boolean;
  drinker: boolean;
  medications: string[];
  allergies: string[];
  medicalConditions: string[];
  lastPhysicalExam: Date;
  primaryDoctor: {
    name: string;
    phone: string;
    specialty: string;
  };
}

export interface PolicyInfo {
  policyNumber: string;
  policyType: 'auto' | 'home' | 'life' | 'health' | 'business';
  coverageAmount: number;
  deductible: number;
  premium: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  effectiveDate: Date;
  expirationDate: Date;
  paymentFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
}

class TestDataManager {
  private static instance: TestDataManager;
  private generatedData: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  // Insurance Customer Data Generation
  generateInsuranceCustomer(overrides: DeepPartial<InsuranceCustomer> = {}): InsuranceCustomer {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const dateOfBirth = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();

    const customer: InsuranceCustomer = {
      personalInfo: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        dateOfBirth,
        age,
        ssn: this.generateSSN(),
        maritalStatus: faker.helpers.arrayElement(['single', 'married', 'divorced', 'widowed']),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
      },
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
        country: 'USA',
        fullAddress: '',
      },
      employment: {
        company: faker.company.name(),
        position: faker.person.jobTitle(),
        industry: faker.company.buzzNoun(),
        annualIncome: faker.number.int({ min: 25000, max: 200000 }),
        employmentType: faker.helpers.arrayElement([
          'full-time',
          'part-time',
          'contractor',
          'unemployed',
          'retired',
        ]),
        yearsAtJob: faker.number.int({ min: 0, max: 20 }),
      },
      financials: {
        creditScore: faker.number.int({ min: 300, max: 850 }),
        annualIncome: faker.number.int({ min: 25000, max: 200000 }),
        monthlyDebt: faker.number.int({ min: 0, max: 3000 }),
        bankAccount: faker.finance.accountNumber(10),
        routingNumber: faker.finance.routingNumber(),
      },
    };

    // Set full address
    customer.address.fullAddress = `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}`;

    return deepMerge(customer, overrides);
  }

  // Vehicle Data Generation
  generateVehicle(overrides: Partial<VehicleInfo> = {}): VehicleInfo {
    const makes = [
      'Toyota',
      'Honda',
      'Ford',
      'Chevrolet',
      'BMW',
      'Mercedes',
      'Audi',
      'Nissan',
      'Hyundai',
      'Subaru',
    ];
    const make = faker.helpers.arrayElement(makes);
    const year = faker.number.int({ min: 2010, max: new Date().getFullYear() });

    const vehicle: VehicleInfo = {
      make,
      model: faker.vehicle.model(),
      year,
      vin: faker.vehicle.vin(),
      licensePlate: this.generateLicensePlate(),
      color: faker.vehicle.color(),
      mileage: faker.number.int({ min: 0, max: 200000 }),
      vehicleType: faker.helpers.arrayElement([
        'sedan',
        'suv',
        'truck',
        'motorcycle',
        'van',
        'coupe',
      ]),
      fuelType: faker.helpers.arrayElement(['gasoline', 'diesel', 'electric', 'hybrid']),
      value: faker.number.int({ min: 5000, max: 80000 }),
    };

    return { ...vehicle, ...overrides };
  }

  // Property Data Generation
  generateProperty(overrides: DeepPartial<PropertyInfo> = {}): PropertyInfo {
    const yearBuilt = faker.number.int({ min: 1950, max: new Date().getFullYear() });
    const squareFootage = faker.number.int({ min: 800, max: 5000 });

    const property: PropertyInfo = {
      type: faker.helpers.arrayElement(['house', 'condo', 'apartment', 'townhouse', 'mobile-home']),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
      },
      details: {
        yearBuilt,
        squareFootage,
        bedrooms: faker.number.int({ min: 1, max: 6 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        propertyValue: faker.number.int({ min: 100000, max: 1000000 }),
        mortgageBalance: faker.number.int({ min: 0, max: 800000 }),
        constructionType: faker.helpers.arrayElement(['frame', 'masonry', 'steel', 'concrete']),
        roofType: faker.helpers.arrayElement(['shingle', 'tile', 'metal', 'flat']),
      },
      safety: {
        hasSecuritySystem: faker.datatype.boolean(),
        hasFireAlarm: faker.datatype.boolean(),
        hasSprinklers: faker.datatype.boolean(),
        gatedCommunity: faker.datatype.boolean(),
      },
    };

    return deepMerge(property, overrides);
  }

  // Health Data Generation
  generateHealthInfo(overrides: DeepPartial<HealthInfo> = {}): HealthInfo {
    const height = `${faker.number.int({ min: 4, max: 6 })}'${faker.number.int({ min: 0, max: 11 })}"`;

    const healthInfo: HealthInfo = {
      height,
      weight: faker.number.int({ min: 100, max: 300 }),
      bloodType: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      smoker: faker.datatype.boolean(),
      drinker: faker.datatype.boolean(),
      medications: this.generateMedications(),
      allergies: this.generateAllergies(),
      medicalConditions: this.generateMedicalConditions(),
      lastPhysicalExam: faker.date.recent({ days: 365 }),
      primaryDoctor: {
        name: `Dr. ${faker.person.fullName()}`,
        phone: faker.phone.number(),
        specialty: faker.helpers.arrayElement([
          'Family Medicine',
          'Internal Medicine',
          'Cardiology',
          'Pediatrics',
        ]),
      },
    };

    return deepMerge(healthInfo, overrides);
  }

  // Policy Data Generation
  generatePolicy(overrides: DeepPartial<PolicyInfo> = {}): PolicyInfo {
    const effectiveDate = faker.date.recent({ days: 30 });
    const expirationDate = new Date(effectiveDate);
    expirationDate.setFullYear(effectiveDate.getFullYear() + 1);

    const coverageAmount = faker.number.int({ min: 10000, max: 1000000 });
    const annualPremium = faker.number.int({ min: 500, max: 5000 });

    const policy: PolicyInfo = {
      policyNumber: this.generatePolicyNumber(),
      policyType: faker.helpers.arrayElement(['auto', 'home', 'life', 'health', 'business']),
      coverageAmount,
      deductible: faker.number.int({ min: 250, max: 2500 }),
      premium: {
        monthly: Math.round(annualPremium / 12),
        quarterly: Math.round(annualPremium / 4),
        annual: annualPremium,
      },
      effectiveDate,
      expirationDate,
      paymentFrequency: faker.helpers.arrayElement([
        'monthly',
        'quarterly',
        'semi-annual',
        'annual',
      ]),
    };

    return deepMerge(policy, overrides);
  }

  // Helper Methods
  private generateSSN(): string {
    return `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 1000, max: 9999 })}`;
  }

  private generateLicensePlate(): string {
    return `${faker.string.alpha({ length: 3, casing: 'upper' })}${faker.number.int({ min: 100, max: 999 })}`;
  }

  private generatePolicyNumber(): string {
    return `POL-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`;
  }

  private generateMedications(): string[] {
    const medications = [
      'Lisinopril',
      'Metformin',
      'Atorvastatin',
      'Omeprazole',
      'Amlodipine',
      'Metoprolol',
    ];
    return faker.helpers.arrayElements(medications, { min: 0, max: 3 });
  }

  private generateAllergies(): string[] {
    const allergies = [
      'Peanuts',
      'Shellfish',
      'Penicillin',
      'Latex',
      'Pollen',
      'Dust mites',
      'Pet dander',
    ];
    return faker.helpers.arrayElements(allergies, { min: 0, max: 2 });
  }

  private generateMedicalConditions(): string[] {
    const conditions = [
      'Hypertension',
      'Diabetes',
      'Asthma',
      'High cholesterol',
      'Arthritis',
      'Depression',
    ];
    return faker.helpers.arrayElements(conditions, { min: 0, max: 2 });
  }

  // Data Storage Methods
  storeData(key: string, data: any): void {
    this.generatedData.set(key, data);
  }

  retrieveData(key: string): any {
    return this.generatedData.get(key);
  }

  clearStoredData(): void {
    this.generatedData.clear();
  }

  // Generate Invalid Data for Negative Testing
  generateInvalidEmail(): string {
    return faker.helpers.arrayElement([
      'invalid-email',
      'test@',
      '@domain.com',
      'test@domain',
      'test..test@domain.com',
      '',
    ]);
  }

  generateInvalidPhone(): string {
    return faker.helpers.arrayElement([
      '123',
      'abc-def-ghij',
      '+++123456789',
      '1234567890123456',
      '',
    ]);
  }

  generateInvalidSSN(): string {
    return faker.helpers.arrayElement([
      '123-45-678',
      '000-00-0000',
      '123-00-0000',
      '123456789',
      '',
    ]);
  }

  generateInvalidZipCode(): string {
    return faker.helpers.arrayElement(['1234', '123456', 'ABCDE', '00000', '']);
  }
}

export default TestDataManager.getInstance();
