const path = require('path');

// Force single React copy — react-native-web bundles its own nested react
const reactDir = path.dirname(require.resolve('react/package.json'));
const reactDomDir = path.dirname(require.resolve('react-dom/package.json'));

module.exports = {
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^react$': reactDir,
    '^react/(.*)$': `${reactDir}/$1`,
    '^react-dom$': reactDomDir,
    '^react-dom/(.*)$': `${reactDomDir}/$1`,
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
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|react-native-svg|victory-native|@react-navigation|react-native-screens)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
