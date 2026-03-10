import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RateLimitMiddleware } from './rate-limit.middleware';

describe('RateLimitMiddleware', () => {
    let middleware: RateLimitMiddleware;
    let mockRedisService: Record<string, jest.Mock>;
    let mockConfigService: jest.Mocked<ConfigService>;

    beforeEach(() => {
        mockRedisService = {
            get: jest.fn(),
            set: jest.fn(),
            exists: jest.fn(),
            ttl: jest.fn(),
            getJourneyTTL: jest.fn().mockReturnValue(900),
        };
        mockConfigService = {
            get: jest.fn().mockReturnValue({
                max: 100,
                windowMs: 900000,
                standardHeaders: true,
                journeyLimits: { health: 200 },
                message: 'Too many requests',
            }),
        } as unknown as jest.Mocked<ConfigService>;

        middleware = new RateLimitMiddleware(mockRedisService as never, mockConfigService);
    });

    it('should be defined', () => {
        expect(middleware).toBeDefined();
    });

    describe('use', () => {
        const createReq = (overrides = {}) => ({
            headers: {},
            ip: '127.0.0.1',
            connection: { remoteAddress: '127.0.0.1' },
            path: '/api/health',
            body: {},
            ...overrides,
        });

        it('should allow requests under the limit', async () => {
            mockRedisService.exists.mockResolvedValue(true);
            mockRedisService.get.mockResolvedValue('5');
            mockRedisService.ttl.mockResolvedValue(600);
            const res = { setHeader: jest.fn() };
            const next = jest.fn();

            await middleware.use(createReq() as never, res as never, next);

            expect(next).toHaveBeenCalled();
        });

        it('should create a new key for first request', async () => {
            mockRedisService.exists.mockResolvedValue(false);
            const res = { setHeader: jest.fn() };
            const next = jest.fn();

            await middleware.use(createReq() as never, res as never, next);

            expect(mockRedisService.set).toHaveBeenCalledWith(
                expect.stringContaining('rateLimit:'),
                '1',
                expect.any(Number)
            );
            expect(next).toHaveBeenCalled();
        });

        it('should throw 429 when rate limit exceeded', async () => {
            mockRedisService.exists.mockResolvedValue(true);
            mockRedisService.get.mockResolvedValue('100');
            mockRedisService.ttl.mockResolvedValue(300);
            const res = { setHeader: jest.fn() };
            const next = jest.fn();

            const call = middleware.use(createReq() as never, res as never, next);
            await expect(call).rejects.toThrow(HttpException);
        });

        it('should skip rate limiting when config is missing', async () => {
            mockConfigService.get.mockReturnValue(undefined);
            const res = { setHeader: jest.fn() };
            const next = jest.fn();

            await middleware.use(createReq() as never, res as never, next);

            expect(next).toHaveBeenCalled();
        });

        it('should continue on unexpected errors', async () => {
            mockRedisService.exists.mockRejectedValue(new Error('Redis down'));
            const res = { setHeader: jest.fn() };
            const next = jest.fn();

            await middleware.use(createReq() as never, res as never, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
