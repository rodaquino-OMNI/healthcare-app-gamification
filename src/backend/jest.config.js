module.exports = {
    coverageProvider: 'v8',
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.test.ts'],
    collectCoverageFrom: [
        '**/*.ts',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/*.d.ts',
        '!**/index.ts',
        '!**/*.module.ts',
        '!**/main.ts',
        '!**/test/**',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/../shared/src/$1',
        '^@auth/(.*)$': '<rootDir>/../auth-service/src/$1',
        '^@health/(.*)$': '<rootDir>/../health-service/src/$1',
        '^@care/(.*)$': '<rootDir>/../care-service/src/$1',
        '^@plan/(.*)$': '<rootDir>/../plan-service/src/$1',
        '^@gamification/(.*)$': '<rootDir>/../gamification-engine/src/$1',
        '^@notification/(.*)$': '<rootDir>/../notification-service/src/$1',
    },
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!@shared)/'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    verbose: true,
    testTimeout: 30000,
    maxWorkers: '50%',
    // Watch mode specific configuration
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    // This makes Jest use the selected test to run in watch mode
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', 'package-lock.json', 'yarn.lock'],
    // Configure to handle watch mode properly
    watchman: true,
    // Configure the watch mode output
    watchOptions: {
        mode: 'watch',
    },
    // Add test results configuration
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: './test-results',
                outputName: 'junit.xml',
            },
        ],
    ],
    // Define the test environment clearly
    testEnvironmentOptions: {
        url: 'http://localhost',
    },
};
