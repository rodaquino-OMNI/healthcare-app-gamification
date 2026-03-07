export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
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
        '^@app/shared/(.*)$': '<rootDir>/../shared/src/$1',
        '^@app/auth/(.*)$': '<rootDir>/../auth-service/src/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testTimeout: 10000,
};
