import type { Config } from '@jest/types'; // v29.0.0

// Jest configuration for the AUSTA SuperApp web application
const config: Config.InitialOptions = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Use jsdom as the test environment to simulate browser environment
  testEnvironment: 'jsdom',
  
  // Setup files to run after the environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Module name mappings for import aliasing
  moduleNameMapper: {
    // Map imports starting with @/ to files in the src directory
    '^@/(.*)$': '<rootDir>/src/$1',
    // Map imports starting with @shared/ to files in the shared directory
    '^@shared/(.*)$': '<rootDir>/../shared/src/$1',
    // Mock static assets like images and stylesheets
    '^.+\\.(svg|css|less|sass|scss|png|jpg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Transform files with ts-jest
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  
  // Collect coverage information
  collectCoverage: true,
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**/*.{ts,tsx}',
    '!src/test/**/*.{ts,tsx}',
    '!src/types/**/*.{ts,tsx}',
    '!src/i18n/**/*.{ts,tsx}',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Module resolution paths
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  
  // Root directory
  rootDir: '../',
  
  // Test file patterns
  testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  
  // Patterns to ignore when transforming
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  
  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Results processor for integration with SonarQube
  testResultsProcessor: 'jest-sonar-reporter',
};

export default config;