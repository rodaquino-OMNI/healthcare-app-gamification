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

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy (Auth Service)', () => {
    let strategy: JwtStrategy;
    let mockAuthService: Record<string, jest.Mock>;
    let mockUsersService: Record<string, jest.Mock>;
    let mockLogger: Record<string, jest.Mock>;
    let mockConfigService: Record<string, jest.Mock>;

    beforeEach(() => {
        mockConfigService = { get: jest.fn().mockReturnValue('test-jwt-secret-at-least-32-chars') };
        mockAuthService = { validateToken: jest.fn() };
        mockUsersService = { findById: jest.fn() };
        mockLogger = { debug: jest.fn(), warn: jest.fn(), log: jest.fn() };

        strategy = new JwtStrategy(
            mockConfigService as never,
            mockAuthService as never,
            mockUsersService as never,
            mockLogger as never
        );
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    it('should throw if JWT_SECRET is missing', () => {
        const noSecretConfig = { get: jest.fn().mockReturnValue(undefined) };

        expect(() => {
            new JwtStrategy(
                noSecretConfig as never,
                mockAuthService as never,
                mockUsersService as never,
                mockLogger as never
            );
        }).toThrow('JWT_SECRET environment variable is required');
    });

    describe('validate', () => {
        it('should return user when token is valid', async () => {
            const mockUser = { id: 'user-1', email: 'test@example.com' };
            mockAuthService.validateToken.mockResolvedValue(mockUser);

            const result = await strategy.validate({ sub: 'user-1', email: 'test@example.com' });

            expect(result).toEqual(mockUser);
        });

        it('should return null when token is invalid', async () => {
            mockAuthService.validateToken.mockResolvedValue(null);

            const result = await strategy.validate({ sub: 'bad-user' });

            expect(result).toBeNull();
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });
});
