/**
 * Jest configuration for the AUSTA SuperApp mobile application
 * This config enables comprehensive testing across all three user journeys
 */

module.exports = {
  // Use React Native preset for Jest
  preset: 'react-native',

  // Setup files to run after the test environment is set up
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect'
  ],

  // Transform files using babel-jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },

  // Don't transform modules in node_modules except for React Native related packages
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation|@austa/design-system)/)'
  ],

  // Module path aliases to match webpack and tsconfig path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // File extensions to consider when resolving modules
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Patterns to ignore when searching for test files
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/e2e/'
  ],

  // Test environment
  testEnvironment: 'node',

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/assets/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],

  // Coverage thresholds to enforce
  coverageThreshold: {
    // Global thresholds
    'global': {
      'statements': 75,
      'branches': 75,
      'functions': 75,
      'lines': 75
    },
    // Journey-specific thresholds with higher requirements for UI components
    './src/components/': {
      'statements': 85,
      'branches': 85,
      'functions': 85,
      'lines': 85
    },
    // Health journey coverage requirements
    './src/screens/health/': {
      'statements': 80,
      'branches': 80,
      'functions': 80,
      'lines': 80
    },
    // Care journey coverage requirements
    './src/screens/care/': {
      'statements': 80,
      'branches': 80,
      'functions': 80,
      'lines': 80
    },
    // Plan journey coverage requirements
    './src/screens/plan/': {
      'statements': 80,
      'branches': 80,
      'functions': 80,
      'lines': 80
    }
  }
};