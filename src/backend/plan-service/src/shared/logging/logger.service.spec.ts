import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from './logger.service';

describe('LoggerService (Plan)', () => {
    let service: LoggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoggerService],
        }).compile();

        service = module.get<LoggerService>(LoggerService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('log', () => {
        it('should log an informational message', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.log('Test message', 'TestContext');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'));
        });

        it('should log without context', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.log('No context');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No context'));
        });
    });

    describe('error', () => {
        it('should log an error message', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            service.error('Error occurred', undefined, 'TestContext');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
        });

        it('should log stack trace when provided', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            service.error('Error occurred', 'stack trace here', 'TestContext');

            expect(consoleSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('warn', () => {
        it('should log a warning message', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            service.warn('Warning message', 'TestContext');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN]'));
        });
    });

    describe('debug', () => {
        it('should log a debug message', () => {
            const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

            service.debug('Debug message', 'TestContext');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG]'));
        });
    });

    describe('verbose', () => {
        it('should log a verbose message', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            service.verbose('Verbose message', 'TestContext');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[VERBOSE]'));
        });
    });
});
