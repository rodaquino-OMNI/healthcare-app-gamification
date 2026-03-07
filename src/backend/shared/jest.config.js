module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    globals: { 'ts-jest': { diagnostics: false } },
    collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.module.ts', '!src/**/*.interface.ts', '!src/**/*.dto.ts'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@app/shared/(.*)$': '<rootDir>/src/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testTimeout: 10000,
};
