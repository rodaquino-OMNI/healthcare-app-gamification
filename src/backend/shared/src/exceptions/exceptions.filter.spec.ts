import { HttpException, HttpStatus } from '@nestjs/common';

import { AllExceptionsFilter } from './exceptions.filter';
import { AppException, ErrorType } from './exceptions.types';

// Mock Sentry
jest.mock('@sentry/node', () => ({
    captureException: jest.fn(),
}));

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;
    let mockLogger: Record<string, jest.Mock>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockHost: Record<string, unknown>;

    beforeEach(() => {
        mockLogger = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        };
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockHost = {
            switchToHttp: () => ({
                getResponse: () => ({ status: mockStatus }),
                getRequest: () => ({
                    method: 'GET',
                    url: '/test',
                    user: { id: 'user-1' },
                    headers: { 'x-journey-id': 'health' },
                }),
            }),
        };

        filter = new AllExceptionsFilter(mockLogger as never);
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });

    describe('catch', () => {
        it('should handle AppException', () => {
            const exception = new AppException('Test error', ErrorType.VALIDATION, 'TEST_001', {});

            filter.catch(exception, mockHost as never);

            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
            expect(mockJson).toHaveBeenCalled();
        });

        it('should handle HttpException', () => {
            const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

            filter.catch(exception, mockHost as never);

            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        });

        it('should handle unknown exceptions', () => {
            const exception = new Error('Unknown error');

            filter.catch(exception, mockHost as never);

            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should map ErrorType.BUSINESS to 422', () => {
            const exception = new AppException('Business error', ErrorType.BUSINESS, 'BIZ_001', {});

            filter.catch(exception, mockHost as never);

            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it('should map ErrorType.EXTERNAL to 502', () => {
            const exception = new AppException('External error', ErrorType.EXTERNAL, 'EXT_001', {});

            filter.catch(exception, mockHost as never);

            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
        });

        it('should map ErrorType.TECHNICAL to 500', () => {
            const exception = new AppException(
                'Technical error',
                ErrorType.TECHNICAL,
                'TECH_001',
                {}
            );

            filter.catch(exception, mockHost as never);

            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });
});
