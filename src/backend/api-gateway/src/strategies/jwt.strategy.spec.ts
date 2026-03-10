jest.mock('passport-jwt', () => ({
    ExtractJwt: {
        fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(() => 'mock-token'),
    },
    Strategy: class MockStrategy {
        constructor(_options: Record<string, unknown>) {}
    },
}));

jest.mock('@nestjs/passport', () => ({
    PassportStrategy: (Strategy: new (...args: unknown[]) => unknown) => {
        return class extends Strategy {
            constructor(...args: unknown[]) {
                super(...args);
            }
        };
    },
}));

import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy (API Gateway)', () => {
    let strategy: JwtStrategy;
    let configService: jest.Mocked<ConfigService>;

    beforeEach(() => {
        configService = {
            get: jest.fn().mockReturnValue('test-secret-key'),
        } as unknown as jest.Mocked<ConfigService>;

        strategy = new JwtStrategy(configService);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return user object from payload', async () => {
            const payload = { sub: 'user-1', email: 'test@example.com', roles: ['user'] };

            const result = await strategy.validate(payload);

            expect(result).toEqual({
                userId: 'user-1',
                email: 'test@example.com',
                roles: ['user'],
            });
        });
    });
});
