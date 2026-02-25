/**
 * Jest configuration for the AUSTA SuperApp mobile application
 * This config enables comprehensive testing across all three user journeys
 */

module.exports = {
  // Do NOT use react-native preset — it loads Flow-annotated setupFiles
  // that fail with the custom esbuild transformer. Instead configure manually.
  // (The react-native preset's haste, transform, and setupFiles are replicated below.)

  // Haste settings from react-native preset
  haste: {
    defaultPlatform: 'ios',
    platforms: ['android', 'ios', 'native'],
  },

  // Setup files to run after the test environment is set up
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],

  // Transform files using a custom esbuild-based transformer.
  // This avoids the @babel/traverse version mismatch caused by the
  // @babel/traverse@7.23.2 override in the web workspace package.json
  // conflicting with newer @babel/ helpers (7.27+) used by the presets.
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': '<rootDir>/jest-esbuild-transform.js',
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

  // Test environment (jsdom needed for React Testing Library)
  testEnvironment: 'jest-environment-jsdom',

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