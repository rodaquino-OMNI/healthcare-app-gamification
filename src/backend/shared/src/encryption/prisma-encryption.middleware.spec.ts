import { createEncryptionExtension } from './prisma-encryption.middleware';

describe('Prisma Encryption Extension', () => {
    let mockEncryptionService: Record<string, jest.Mock>;
    let extension: ReturnType<typeof createEncryptionExtension>;

    /** Helper: invokes a named $allModels query hook from the extension. */
    function callHook(
        action: string,
        model: string,
        args: Record<string, unknown>,
        queryResult: unknown
    ) {
        const hooks = extension.query.$allModels as Record<
            string,
            (ctx: {
                model: string;
                args: Record<string, unknown>;
                query: jest.Mock;
            }) => Promise<unknown>
        >;
        const query = jest.fn().mockResolvedValue(queryResult);
        return { promise: hooks[action]({ model, args, query }), query };
    }

    beforeEach(() => {
        mockEncryptionService = {
            encrypt: jest.fn((value: string) => `ENC:${value}`),
            decrypt: jest.fn((value: string) => value.replace('ENC:', '')),
            isEncrypted: jest.fn((value: string) => value.startsWith('ENC:')),
        };
        extension = createEncryptionExtension(mockEncryptionService as never);
    });

    it('should create an extension object with query.$allModels hooks', () => {
        expect(extension).toBeDefined();
        expect(extension.query).toBeDefined();
        expect(extension.query.$allModels).toBeDefined();
        expect(typeof extension.query.$allModels.create).toBe('function');
        expect(typeof extension.query.$allModels.findMany).toBe('function');
    });

    describe('write operations', () => {
        it('should encrypt PHI fields on create', async () => {
            const { promise } = callHook(
                'create',
                'HealthMetric',
                { data: { value: '72', notes: 'normal' } },
                { id: '1', value: 'ENC:72', notes: 'ENC:normal' }
            );

            await promise;

            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('72');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('normal');
        });

        it('should encrypt PHI fields on update', async () => {
            const { promise } = callHook(
                'update',
                'User',
                { data: { email: 'test@example.com' } },
                { id: '1' }
            );

            await promise;

            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('test@example.com');
        });

        it('should skip encryption for already encrypted values', async () => {
            mockEncryptionService.isEncrypted.mockReturnValue(true);

            const { promise } = callHook(
                'create',
                'User',
                { data: { email: 'ENC:test@example.com' } },
                {}
            );

            await promise;

            expect(mockEncryptionService.encrypt).not.toHaveBeenCalled();
        });
    });

    describe('read operations', () => {
        it('should decrypt PHI fields on findMany', async () => {
            const { promise } = callHook('findMany', 'HealthMetric', {}, [
                { id: '1', value: 'ENC:72', notes: 'ENC:normal' },
            ]);

            await promise;

            expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('ENC:72');
            expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('ENC:normal');
        });

        it('should handle null results gracefully', async () => {
            const { promise } = callHook('findUnique', 'HealthMetric', {}, null);

            const result = await promise;

            expect(result).toBeNull();
        });
    });

    describe('non-PHI models', () => {
        it('should pass through for non-PHI models', async () => {
            const { promise } = callHook(
                'create',
                'SomeOtherModel',
                { data: { name: 'test' } },
                { id: '1' }
            );

            const result = await promise;

            expect(result).toEqual({ id: '1' });
            expect(mockEncryptionService.encrypt).not.toHaveBeenCalled();
        });
    });

    describe('upsert operations', () => {
        it('should encrypt both create and update data on upsert', async () => {
            const { promise } = callHook(
                'upsert',
                'User',
                {
                    create: { email: 'new@test.com' },
                    update: { email: 'updated@test.com' },
                },
                { id: '1' }
            );

            await promise;

            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('new@test.com');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('updated@test.com');
        });
    });

    describe('createMany operations', () => {
        it('should encrypt PHI fields for each item in batch', async () => {
            const { promise, query } = callHook(
                'createMany',
                'User',
                {
                    data: [
                        { email: 'a@test.com', cpf: '111' },
                        { email: 'b@test.com', cpf: '222' },
                    ],
                },
                { count: 2 }
            );

            const result = await promise;

            expect(result).toEqual({ count: 2 });
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('a@test.com');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('b@test.com');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('111');
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('222');
            expect(query).toHaveBeenCalled();
        });
    });
});
