import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
    let middleware: LoggingMiddleware;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(() => {
        mockLogger = {
            setContext: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        };
        middleware = new LoggingMiddleware(mockLogger as never);
    });

    it('should be defined', () => {
        expect(middleware).toBeDefined();
    });

    describe('use', () => {
        it('should log incoming requests', () => {
            const req = {
                method: 'GET',
                originalUrl: '/api/health',
                headers: {},
                body: {},
                get: jest.fn().mockReturnValue('test-agent'),
                ip: '127.0.0.1',
                connection: { remoteAddress: '127.0.0.1' },
            };
            const res = {
                setHeader: jest.fn(),
                statusCode: 200,
                getHeader: jest.fn().mockReturnValue('0'),
                end: jest.fn(),
            };
            const next = jest.fn();

            middleware.use(req as never, res as never, next);

            expect(next).toHaveBeenCalled();
            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.stringContaining('Request received GET /api/health')
            );
        });

        it('should add correlation ID to response headers', () => {
            const req = {
                method: 'GET',
                originalUrl: '/api/test',
                headers: { 'x-correlation-id': 'test-corr-id' },
                body: {},
                get: jest.fn().mockReturnValue(''),
                ip: '127.0.0.1',
                connection: { remoteAddress: '127.0.0.1' },
            };
            const res = {
                setHeader: jest.fn(),
                statusCode: 200,
                getHeader: jest.fn(),
                end: jest.fn(),
            };
            const next = jest.fn();

            middleware.use(req as never, res as never, next);

            expect(res.setHeader).toHaveBeenCalledWith('X-Correlation-Id', 'test-corr-id');
        });

        it('should call next even if logging fails', () => {
            const req = {
                method: 'GET',
                originalUrl: '/api/test',
                headers: {},
                body: null,
                get: jest.fn().mockImplementation(() => {
                    throw new Error('mock error');
                }),
                ip: '127.0.0.1',
                connection: { remoteAddress: '127.0.0.1' },
            };
            const res = {
                setHeader: jest.fn(),
                statusCode: 200,
                getHeader: jest.fn(),
                end: jest.fn(),
            };
            const next = jest.fn();

            middleware.use(req as never, res as never, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
