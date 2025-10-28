interface TestDataType {
  USERS: {
    VALID_EMAIL: string;
    VALID_PASSWORD: string;
    INVALID_EMAIL: string;
    INVALID_PASSWORD: string;
    LONG_PASSWORD: string;
  };
  FORMS: {
    EMPTY_STRING: string;
    SPECIAL_CHARACTERS: string;
    NUMBERS_ONLY: string;
    LETTERS_ONLY: string;
    MIXED_CONTENT: string;
  };
  TIMEOUTS: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    EXTRA_LONG: number;
  };
  ENVIRONMENT: {
    DEVELOPMENT: string;
    STAGING: string;
    PRODUCTION: string;
  };
  BROWSERS: {
    CHROMIUM: string;
    FIREFOX: string;
    WEBKIT: string;
    EDGE: string;
  };
}

export const TEST_DATA: TestDataType = {
  // User data for testing
  USERS: {
    VALID_EMAIL: 'test@example.com',
    VALID_PASSWORD: 'Test@1234',
    INVALID_EMAIL: 'invalid-email',
    INVALID_PASSWORD: 'short',
    LONG_PASSWORD: 'ThisIsAVeryLongPasswordThatExceedsTheMaximumLengthAllowed',
  },

  // Form data for testing
  FORMS: {
    EMPTY_STRING: '',
    SPECIAL_CHARACTERS: '!@#$%^&*()',
    NUMBERS_ONLY: '1234567890',
    LETTERS_ONLY: 'abcdefghij',
    MIXED_CONTENT: 'Test123!@#',
  },

  // Wait times
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    EXTRA_LONG: 60000,
  },

  // Test environment
  ENVIRONMENT: {
    DEVELOPMENT: 'dev',
    STAGING: 'staging',
    PRODUCTION: 'prod',
  },

  // Browser types
  BROWSERS: {
    CHROMIUM: 'chromium',
    FIREFOX: 'firefox',
    WEBKIT: 'webkit',
    EDGE: 'edge',
  },
} as const;
