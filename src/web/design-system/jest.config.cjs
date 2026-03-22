module.exports = {
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tokens/(.*)$': '<rootDir>/src/tokens/$1',
    '^@themes/(.*)$': '<rootDir>/src/themes/$1',
    '^@primitives/(.*)$': '<rootDir>/src/primitives/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@gamification/(.*)$': '<rootDir>/src/gamification/$1',
    '^@health/(.*)$': '<rootDir>/src/health/$1',
    '^@care/(.*)$': '<rootDir>/src/care/$1',
    '^@plan/(.*)$': '<rootDir>/src/plan/$1',
    '^@charts/(.*)$': '<rootDir>/src/charts/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
