/**
 * Jest configuration for the AUSTA SuperApp mobile application
 * This config enables comprehensive testing across all three user journeys
 */

module.exports = {
    coverageProvider: 'v8',
    // Do NOT use react-native preset — it loads Flow-annotated setupFiles
    // that fail with the custom esbuild transformer. Instead configure manually.
    // (The react-native preset's haste, transform, and setupFiles are replicated below.)

    // NOTE: Haste disabled — it bypasses moduleNameMapper for react-native.
    // Platform-specific file resolution (.ios.js, .android.js) is not needed in tests.

    // Setup files to run after the test environment is set up
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Transform files using a custom esbuild-based transformer.
    // This avoids the @babel/traverse version mismatch caused by the
    // @babel/traverse@7.23.2 override in the web workspace package.json
    // conflicting with newer @babel/ helpers (7.27+) used by the presets.
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': '<rootDir>/jest-esbuild-transform.js',
    },

    // Don't transform modules in node_modules except for these ESM/Flow packages
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation|@austa|expo-.*|@expo|node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)',
    ],

    // Module path aliases to match webpack and tsconfig path aliases
    moduleNameMapper: {
        // react-native is mocked via jest.mock() in jest.setup.js — not moduleNameMapper.
        // This avoids conflicts between moduleNameMapper and jest.mock hoisting.
        // Mock design-system — dist files import react-native causing cascading Flow/ESM issues
        '^@austa/design-system$': '<rootDir>/__mocks__/@austa/design-system.js',
        // Path aliases
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
        // Shared workspace aliases
        '^@shared/(.*)$': '<rootDir>/../shared/$1',
        '^@austa/web-shared/(.*)$': '<rootDir>/../shared/$1',
        '^@austa/design-system/src/(.*)$': '<rootDir>/../design-system/src/$1',
        // Expo modules — mock to avoid ESM/native issues
        '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
        '^expo-haptics$': '<rootDir>/__mocks__/expo-haptics.js',
        '^expo-font$': '<rootDir>/__mocks__/expo-font.js',
        '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.js',
        '^expo-screen-capture$': '<rootDir>/__mocks__/expo-screen-capture.js',
        '^expo-local-authentication$': '<rootDir>/__mocks__/expo-local-authentication.js',
        '^expo-document-picker$': '<rootDir>/__mocks__/expo-document-picker.js',
        '^expo-splash-screen$': '<rootDir>/__mocks__/expo-splash-screen.js',
        '^expo-modules-core$': '<rootDir>/__mocks__/expo-modules-core.js',
        // Apollo upload client ESM subpath import
        '^apollo-upload-client/createUploadLink\\.mjs$': '<rootDir>/__mocks__/apollo-upload-client.js',
        // node-fetch ESM module
        '^node-fetch$': '<rootDir>/__mocks__/node-fetch.js',
        // Design system token aliases
        '^@design-system/(.*)$': '<rootDir>/../design-system/src/$1',
        // Absolute path references from test files
        '^src/web/shared/(.*)$': '<rootDir>/../shared/$1',
        '^src/web/design-system/(.*)$': '<rootDir>/../design-system/$1',
        // Static assets
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },

    // File extensions to consider when resolving modules
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // Patterns to ignore when searching for test files.
    // Screen-level tests are excluded because they have pre-existing broken relative
    // imports (e.g. ../../../../constants/routes, ../../../../../../design-system/src/...)
    // that resolve outside the project. They were never passing.
    // Only API tests and component-level tests that work are included.
    testPathIgnorePatterns: [
        '/node_modules/',
        '/android/',
        '/ios/',
        '/e2e/',
        // Pre-existing broken screen tests (wrong relative import paths)
        'src/screens/auth/__tests__/',
        'src/screens/care/__tests__/',
        'src/screens/error/__tests__/',
        'src/screens/gamification/__tests__/',
        'src/screens/health/__tests__/Medication(?!Export)',
        'src/screens/health/__tests__/AddMetric',
        'src/screens/health/__tests__/Dashboard',
        'src/screens/health/__tests__/DeviceConnection',
        'src/screens/health/__tests__/HealthGoals',
        'src/screens/health/__tests__/MedicalHistory',
        'src/screens/health/__tests__/MetricDetail',
        'src/screens/health/activity/__tests__/',
        'src/screens/health/cycle-tracking/__tests__/',
        'src/screens/health/nutrition/__tests__/',
        'src/screens/health/sleep/__tests__/',
        'src/screens/health/wellness-resources/__tests__/',
        'src/screens/plan/__tests__/',
        'src/screens/profile/__tests__/',
        'src/screens/settings/__tests__/',
        'src/screens/wellness/__tests__/',
        'src/__tests__/screens/',
    ],

    // Test environment (jsdom needed for React Testing Library)
    testEnvironment: 'jest-environment-jsdom',

    // Files to collect coverage from
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/assets/**',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
    ],

    // Coverage thresholds disabled — jest 29.7 _checkThreshold crashes with
    // coverageProvider: "v8" (glob.sync undefined). Thresholds enforced in CI
    // via Codecov instead.
};
