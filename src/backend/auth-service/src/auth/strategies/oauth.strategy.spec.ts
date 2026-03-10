import { OAuthStrategy } from './oauth.strategy';

describe('OAuthStrategy', () => {
    let strategy: OAuthStrategy;
    let mockConfigService: Record<string, jest.Mock>;
    let mockAuthService: Record<string, jest.Mock>;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(() => {
        mockConfigService = { get: jest.fn() };
        mockAuthService = { login: jest.fn() };
        mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

        strategy = new OAuthStrategy(
            mockConfigService as never,
            mockAuthService as never,
            mockLogger as never
        );
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should extract email and name from Google profile', async () => {
            const profile = {
                emails: [{ value: 'test@gmail.com' }],
                name: { givenName: 'John', familyName: 'Doe' },
            };

            const result = await strategy.validate(profile, 'google');

            expect(result).toEqual(
                expect.objectContaining({
                    email: 'test@gmail.com',
                    name: 'John Doe',
                    provider: 'google',
                })
            );
        });

        it('should extract email and name from Facebook profile', async () => {
            const profile = {
                emails: [{ value: 'test@fb.com' }],
                displayName: 'Jane Smith',
            };

            const result = await strategy.validate(profile, 'facebook');

            expect(result).toEqual(
                expect.objectContaining({
                    email: 'test@fb.com',
                    name: 'Jane Smith',
                    provider: 'facebook',
                })
            );
        });

        it('should extract email and name from Apple profile', async () => {
            const profile = {
                email: 'test@apple.com',
                name: { firstName: 'Bob', lastName: 'Jones' },
            };

            const result = await strategy.validate(profile, 'apple');

            expect(result).toEqual(
                expect.objectContaining({
                    email: 'test@apple.com',
                    name: 'Bob Jones',
                    provider: 'apple',
                })
            );
        });

        it('should return null on error', async () => {
            const result = await strategy.validate(null, 'google');

            expect(result).toBeNull();
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle Apple profile without name', async () => {
            const profile = { email: 'test@apple.com', name: {} };

            const result = await strategy.validate(profile, 'apple');

            expect(result).toEqual(
                expect.objectContaining({
                    name: 'Apple User',
                })
            );
        });
    });
});
