// Test setup for Care Service
import 'reflect-metadata';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.DATABASE_URL =
    process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/care_test';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379/2';
process.env.KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'localhost:9092';

// Global test utilities
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;

// Mock console methods in tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

// Cleanup after tests
afterAll(async () => {
    // Close all open handles
    await new Promise((resolve) => setTimeout(() => resolve(null), 500));
});
