import { faker } from '@faker-js/faker';

// Type definitions for generated data
export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: Date;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inStock: boolean;
  quantity: number;
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface CreditCard {
  number: string;
  cvv: string;
  expiryDate: string;
}

export interface Content {
  title: string;
  paragraph: string;
  sentences: string;
}

export class TestDataFactory {
  /**
   * Generate a random user
   */
  static generateUser(): User {
    return {
      email: faker.internet.email(),
      password: 'Test@1234',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number({ style: 'national' }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'USA',
      },
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    };
  }

  /**
   * Generate a random product
   */
  static generateProduct(): Product {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 100 }),
    };
  }

  /**
   * Generate a random company
   */
  static generateCompany(): Company {
    return {
      name: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
      },
    };
  }

  /**
   * Generate random credit card info
   */
  static generateCreditCard(): CreditCard {
    return {
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      expiryDate: faker.date.future().toISOString().slice(0, 7), // YYYY-MM
    };
  }

  /**
   * Generate random text content
   */
  static generateContent(): Content {
    return {
      title: faker.lorem.sentence(),
      paragraph: faker.lorem.paragraph(),
      sentences: faker.lorem.sentences(3),
    };
  }

  /**
   * Generate a unique email
   */
  static generateUniqueEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}@example.com`;
  }
}
