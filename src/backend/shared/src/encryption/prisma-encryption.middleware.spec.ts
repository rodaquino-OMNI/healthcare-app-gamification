import { createEncryptionMiddleware } from './prisma-encryption.middleware';

describe('Prisma Encryption Middleware', () => {
    let mockEncryptionService: Record<string, jest.Mock>;

    beforeEach(() => {
        mockEncryptionService = {
            encrypt: jest.fn((value: string) => `ENC:${value}`),
            decrypt: jest.fn((value: string) => value.replace('ENC:', '')),
            isEncrypted: jest.fn((value: string) => value.startsWith('ENC:')),
        };
    });

    it('should create middleware function', () => {
        const middleware = createEncryptionMiddleware(mockEncryptionService as never);
        expect(middleware).toBeDefined();
        expect(typeof middleware).toBe('function');
    });

    describe('write operations', () => {
        it('should encrypt PHI fields on create', async () => {
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest.fn().mockResolvedValue({ id: '1', value: 'ENC:72' });

            const params = {
                model: 'HealthMetric',
                action: 'create',
                args: { data: { value: '72', notes: 'normal' } },
            };

            await middleware(params as never, next);

            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('72');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('normal');
        });

        it('should encrypt PHI fields on update', async () => {
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest.fn().mockResolvedValue({ id: '1' });

            const params = {
                model: 'User',
                action: 'update',
                args: { data: { email: 'test@example.com' } },
            };

            await middleware(params as never, next);

            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('test@example.com');
        });

        it('should skip encryption for already encrypted values', async () => {
            mockEncryptionService.isEncrypted.mockReturnValue(true);
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest.fn().mockResolvedValue({});

            const params = {
                model: 'User',
                action: 'create',
                args: { data: { email: 'ENC:test@example.com' } },
            };

            await middleware(params as never, next);

            expect(mockEncryptionService.encrypt).not.toHaveBeenCalled();
        });
    });

    describe('read operations', () => {
        it('should decrypt PHI fields on findMany', async () => {
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest
                .fn()
                .mockResolvedValue([{ id: '1', value: 'ENC:72', notes: 'ENC:normal' }]);

            const params = {
                model: 'HealthMetric',
                action: 'findMany',
                args: {},
            };

            await middleware(params as never, next);

            expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('ENC:72');
            expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('ENC:normal');
        });

        it('should handle null results gracefully', async () => {
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest.fn().mockResolvedValue(null);

            const params = {
                model: 'HealthMetric',
                action: 'findUnique',
                args: {},
            };

            const result = await middleware(params as never, next);

            expect(result).toBeNull();
        });
    });

    describe('non-PHI models', () => {
        it('should pass through for non-PHI models', async () => {
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest.fn().mockResolvedValue({ id: '1' });

            const params = {
                model: 'SomeOtherModel',
                action: 'create',
                args: { data: { name: 'test' } },
            };

            const result = await middleware(params as never, next);

            expect(result).toEqual({ id: '1' });
            expect(mockEncryptionService.encrypt).not.toHaveBeenCalled();
        });
    });

    describe('upsert operations', () => {
        it('should encrypt both create and update data on upsert', async () => {
            const middleware = createEncryptionMiddleware(mockEncryptionService as never);
            const next = jest.fn().mockResolvedValue({ id: '1' });

            const params = {
                model: 'User',
                action: 'upsert',
                args: {
                    data: {},
                    create: { email: 'new@test.com' },
                    update: { email: 'updated@test.com' },
                },
            };

            await middleware(params as never, next);

            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('new@test.com');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('updated@test.com');
        });
    });
});
