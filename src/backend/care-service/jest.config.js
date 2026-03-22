module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.(t|j)s',
        '!src/main.ts',
        '!src/**/*.module.ts',
        '!src/**/*.interface.ts',
        '!src/**/*.entity.ts',
        '!src/**/*.dto.ts',
        '!src/**/*.d.ts',
        '!src/types/**/*',
    ],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@shared/(.*)$': '<rootDir>/../shared/src/$1',
        '^@app/shared/(.*)$': '<rootDir>/../shared/src/$1',
        '^@app/auth/(.*)$': '<rootDir>/../auth-service/src/$1',
        '^@app/care/(.*)$': '<rootDir>/src/$1',
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    testTimeout: 10000,
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
