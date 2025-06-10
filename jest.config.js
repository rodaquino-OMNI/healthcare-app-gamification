/**
 * Root Jest configuration for the monorepo
 * This configuration defines all projects in the monorepo and allows Jest to run tests in the entire workspace
 */
module.exports = {
  projects: [
    '<rootDir>/src/backend',
    '<rootDir>/src/backend/shared',
    '<rootDir>/src/backend/packages/shared',
    '<rootDir>/src/backend/packages/auth',
    '<rootDir>/src/backend/auth-service',
    '<rootDir>/src/backend/gamification-engine',
    '<rootDir>/src/backend/api-gateway',
    '<rootDir>/src/backend/notification-service',
    '<rootDir>/src/backend/health-service',
    '<rootDir>/src/backend/plan-service',
    '<rootDir>/src/backend/care-service'
  ],
  // Global settings for all projects
  verbose: true,
  testTimeout: 30000,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};