jest.mock('@app/shared/constants/error-codes.constants', () => ({
    AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
}));

jest.mock('@app/shared/constants/journey.constants', () => ({
    JOURNEY_IDS: { HEALTH: 'health', CARE: 'care', PLAN: 'plan' },
}));

jest.mock('@nestjs/config', () => ({
    registerAs: (_token: string, factory: () => unknown) => factory,
    ConfigType: undefined,
}));

import { configuration } from './configuration';

// The mock of registerAs returns the factory directly, so configuration IS the factory
const configFactory = configuration as unknown as () => ReturnType<typeof Object>;

describe('ApiGateway Configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return default values when no env vars set', () => {
        delete process.env.PORT;
        delete process.env.HOST;
        delete process.env.NODE_ENV;
        const config = configFactory() as Record<string, unknown>;
        expect(config).toHaveProperty('port', 4000);
        expect(config).toHaveProperty('host', '0.0.0.0');
    });

    it('should use PORT env var', () => {
        process.env.PORT = '8080';
        const config = configFactory() as Record<string, unknown>;
        expect(config).toHaveProperty('port', 8080);
    });

    it('should parse CORS_ORIGINS as comma-separated list', () => {
        process.env.CORS_ORIGINS = 'https://a.com,https://b.com';
        const config = configFactory() as Record<string, Record<string, unknown>>;
        expect(config.cors.origin).toEqual(['https://a.com', 'https://b.com']);
    });

    it('should use default CORS origins when env var not set', () => {
        delete process.env.CORS_ORIGINS;
        const config = configFactory() as Record<string, Record<string, unknown>>;
        expect(config.cors.origin).toHaveLength(2);
    });

    it('should parse rate limit numbers from env', () => {
        process.env.RATE_LIMIT_WINDOW_MS = '60000';
        process.env.RATE_LIMIT_MAX = '50';
        const config = configFactory() as Record<string, Record<string, unknown>>;
        expect(config.rateLimit.windowMs).toBe(60000);
        expect(config.rateLimit.max).toBe(50);
    });

    it('should set service URLs from env', () => {
        process.env.AUTH_SERVICE_URL = 'http://custom-auth:9000';
        const config = configFactory() as Record<string, Record<string, Record<string, unknown>>>;
        expect(config.services.auth.url).toBe('http://custom-auth:9000');
    });

    it('should set service timeouts from env', () => {
        process.env.AUTH_SERVICE_TIMEOUT = '10000';
        const config = configFactory() as Record<string, Record<string, Record<string, unknown>>>;
        expect(config.services.auth.timeout).toBe(10000);
    });

    it('should set graphql playground based on NODE_ENV', () => {
        process.env.NODE_ENV = 'production';
        delete process.env.GRAPHQL_PLAYGROUND;
        const config = configFactory() as Record<string, Record<string, unknown>>;
        expect(config.graphql.playground).toBe(false);
    });
});
