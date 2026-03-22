import { ApiGatewayConfigValidation } from './validation.schema';

describe('ApiGatewayConfigValidation', () => {
    const validConfig = {
        env: 'development',
        server: {
            port: 4000,
            cors: {
                origin: ['https://app.austa.com.br'],
                credentials: true,
                methods: ['GET', 'POST'],
            },
        },
        authentication: {
            jwtSecret: 'a-secret-key-that-is-at-least-32-characters-long',
            tokenExpiration: '1h',
            refreshTokenExpiration: '7d',
        },
        rateLimiting: {
            windowMs: 900000,
            max: 100,
            journeyLimits: { health: 200, care: 150, plan: 100 },
            standardHeaders: true,
            legacyHeaders: false,
        },
        caching: {
            ttl: { health: '5m', care: '1m', plan: '15m' },
            maxItems: 1000,
            checkPeriod: 600,
        },
        services: {
            health: 'http://health-service:3002',
            care: 'http://care-service:3003',
            plan: 'http://plan-service:3004',
            game: 'http://gamification-engine:3005',
            auth: 'http://auth-service:3001',
        },
    };

    it('should accept a valid config', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate(validConfig);
        expect(error).toBeUndefined();
    });

    it('should reject invalid env value', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate({
            ...validConfig,
            env: 'invalid',
        });
        expect(error).toBeDefined();
    });

    it('should reject jwtSecret shorter than 32 chars', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate({
            ...validConfig,
            authentication: { ...validConfig.authentication, jwtSecret: 'short' },
        });
        expect(error).toBeDefined();
    });

    it('should reject invalid token expiration format', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate({
            ...validConfig,
            authentication: { ...validConfig.authentication, tokenExpiration: 'forever' },
        });
        expect(error).toBeDefined();
    });

    it('should reject invalid service URLs', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate({
            ...validConfig,
            services: { ...validConfig.services, auth: 'not-a-url' },
        });
        expect(error).toBeDefined();
    });

    it('should reject missing required fields', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate({});
        expect(error).toBeDefined();
    });

    it('should reject windowMs below 1000', () => {
        const { error } = ApiGatewayConfigValidation.schema.validate({
            ...validConfig,
            rateLimiting: { ...validConfig.rateLimiting, windowMs: 500 },
        });
        expect(error).toBeDefined();
    });
});
