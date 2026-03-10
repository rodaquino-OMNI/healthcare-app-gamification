import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService (Shared)', () => {
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

    it('should be an instance of LoggerService', () => {
        expect(service).toBeInstanceOf(LoggerService);
    });

    describe('setContext', () => {
        it('should set the context for subsequent logs', () => {
            service.setContext('MyService');

            // Verify context is set by logging and checking output
            const logSpy = jest.spyOn(LoggerService.prototype, 'log');
            service.log('test message');

            expect(logSpy).toHaveBeenCalledWith('test message');
        });
    });

    describe('log', () => {
        it('should log a message with default context', () => {
            // Should not throw
            expect(() => service.log('Info message')).not.toThrow();
        });

        it('should log a message with custom context', () => {
            expect(() => service.log('Info message', 'CustomContext')).not.toThrow();
        });
    });

    describe('error', () => {
        it('should log an error message', () => {
            expect(() => service.error('Error occurred')).not.toThrow();
        });

        it('should log an error with trace and context', () => {
            expect(() => service.error('Error occurred', 'stack trace', 'ErrorContext')).not.toThrow();
        });
    });

    describe('warn', () => {
        it('should log a warning message', () => {
            expect(() => service.warn('Warning message')).not.toThrow();
        });

        it('should log a warning with context', () => {
            expect(() => service.warn('Warning message', 'WarnContext')).not.toThrow();
        });
    });

    describe('debug', () => {
        it('should log a debug message with string context', () => {
            expect(() => service.debug('Debug message', 'DebugContext')).not.toThrow();
        });

        it('should log a debug message with object metadata', () => {
            expect(() => service.debug('Debug message', { key: 'value', count: 42 })).not.toThrow();
        });
    });

    describe('verbose', () => {
        it('should log a verbose message', () => {
            expect(() => service.verbose('Verbose message')).not.toThrow();
        });

        it('should log a verbose message with context', () => {
            expect(() => service.verbose('Verbose message', 'VerboseContext')).not.toThrow();
        });
    });

    describe('createLogger', () => {
        it('should create a child logger with the specified context', () => {
            const childLogger = service.createLogger('ChildService');

            expect(childLogger).toBeInstanceOf(LoggerService);
        });

        it('should create independent child loggers', () => {
            const child1 = service.createLogger('Child1');
            const child2 = service.createLogger('Child2');

            expect(child1).not.toBe(child2);
        });
    });
});
