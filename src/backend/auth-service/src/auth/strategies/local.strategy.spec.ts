jest.mock('passport-local', () => ({
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

import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
    let strategy: LocalStrategy;
    let mockAuthService: Record<string, jest.Mock>;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(() => {
        mockAuthService = { login: jest.fn() };
        mockLogger = { debug: jest.fn(), error: jest.fn(), log: jest.fn() };

        strategy = new LocalStrategy(mockAuthService as never, mockLogger as never);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return user when credentials are valid', async () => {
            const mockUser = { id: 'user-1', email: 'test@example.com' };
            mockAuthService.login.mockResolvedValue(mockUser);

            const result = await strategy.validate('test@example.com', 'password');

            expect(result).toEqual(mockUser);
            expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
        });

        it('should throw when credentials are invalid', async () => {
            mockAuthService.login.mockResolvedValue(null);

            await expect(strategy.validate('test@example.com', 'wrong')).rejects.toThrow();
        });

        it('should throw when authService.login throws', async () => {
            mockAuthService.login.mockRejectedValue(new Error('DB error'));

            await expect(strategy.validate('test@example.com', 'pass')).rejects.toThrow();
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
