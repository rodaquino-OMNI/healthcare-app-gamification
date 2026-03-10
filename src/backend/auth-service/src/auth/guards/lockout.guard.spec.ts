import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LockoutGuard } from './lockout.guard';

describe('LockoutGuard', () => {
    let guard: LockoutGuard;
    let mockRedisService: Record<string, jest.Mock>;
    let mockConfigService: jest.Mocked<ConfigService>;

    beforeEach(() => {
        mockRedisService = {
            get: jest.fn(),
        };
        mockConfigService = {
            get: jest.fn().mockReturnValue(5),
        } as unknown as jest.Mocked<ConfigService>;

        guard = new LockoutGuard(mockRedisService as never, mockConfigService);
    });

    const createMockContext = (email?: string): ExecutionContext => ({
        switchToHttp: () => ({
            getRequest: () => ({ body: email ? { email } : {} }),
        }),
    } as unknown as ExecutionContext);

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should allow access when no email is provided', async () => {
            const result = await guard.canActivate(createMockContext());

            expect(result).toBe(true);
        });

        it('should allow access when under lockout threshold', async () => {
            mockRedisService.get.mockResolvedValue('3');

            const result = await guard.canActivate(createMockContext('test@example.com'));

            expect(result).toBe(true);
        });

        it('should deny access when lockout threshold is reached', async () => {
            mockRedisService.get.mockResolvedValue('5');

            await expect(
                guard.canActivate(createMockContext('test@example.com')),
            ).rejects.toThrow('Account temporarily locked');
        });

        it('should deny access when over lockout threshold', async () => {
            mockRedisService.get.mockResolvedValue('10');

            await expect(
                guard.canActivate(createMockContext('test@example.com')),
            ).rejects.toThrow();
        });

        it('should allow access when no lockout data exists', async () => {
            mockRedisService.get.mockResolvedValue(null);

            const result = await guard.canActivate(createMockContext('test@example.com'));

            expect(result).toBe(true);
        });
    });
});
