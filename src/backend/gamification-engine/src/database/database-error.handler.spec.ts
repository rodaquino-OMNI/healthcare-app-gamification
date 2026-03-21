import { ConfigService } from '@nestjs/config';

import { DatabaseErrorHandler } from './database-error.handler';

describe('DatabaseErrorHandler', () => {
    let handler: DatabaseErrorHandler;
    let mockConfigService: jest.Mocked<ConfigService>;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(() => {
        mockConfigService = {
            get: jest.fn(),
        } as unknown as jest.Mocked<ConfigService>;
        mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

        handler = new DatabaseErrorHandler(mockConfigService, mockLogger as never);
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    describe('onApplicationBootstrap', () => {
        it('should log success when database config is present', () => {
            mockConfigService.get.mockReturnValue({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
            });

            handler.onApplicationBootstrap();

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.stringContaining('Database configuration validated'),
                'DatabaseErrorHandler'
            );
        });

        it('should log success when using connection URL', () => {
            mockConfigService.get.mockReturnValue({
                type: 'postgres',
                url: 'postgresql://localhost:5432/db',
                host: 'localhost',
                port: 5432,
            });

            handler.onApplicationBootstrap();

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.stringContaining('using connection URL'),
                'DatabaseErrorHandler'
            );
        });

        it('should warn when database config is missing', () => {
            mockConfigService.get.mockReturnValue(undefined);

            handler.onApplicationBootstrap();

            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Database configuration not found'),
                'DatabaseErrorHandler'
            );
        });

        it('should log error when configuration check throws', () => {
            mockConfigService.get.mockImplementation(() => {
                throw new Error('Config parse error');
            });

            handler.onApplicationBootstrap();

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
