import { TracingService } from './tracing.service';

// Mock OpenTelemetry
jest.mock('@opentelemetry/api', () => {
    const mockSpan = {
        isRecording: jest.fn().mockReturnValue(true),
        setStatus: jest.fn(),
        recordException: jest.fn(),
        end: jest.fn(),
    };

    return {
        trace: {
            getTracer: jest.fn().mockReturnValue({
                startSpan: jest.fn().mockReturnValue(mockSpan),
            }),
            setSpan: jest.fn().mockReturnValue({}),
        },
        context: {
            active: jest.fn().mockReturnValue({}),
            with: jest.fn().mockImplementation((_ctx: unknown, fn: () => unknown) => fn()),
        },
        SpanStatusCode: {
            OK: 1,
            ERROR: 2,
        },
    };
});

describe('TracingService (Shared)', () => {
    let service: TracingService;

    beforeEach(() => {
        const mockConfigService = {
            get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
                if (key === 'service.name') {
                    return 'test-service';
                }
                return defaultValue;
            }),
        };
        const mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };

        service = new TracingService(mockConfigService as never, mockLogger as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createSpan', () => {
        it('should execute the function within a span and return result', async () => {
            const result = await service.createSpan('test-span', async () => 'test-result');

            expect(result).toBe('test-result');
        });

        it('should execute and return complex data', async () => {
            const expected = { id: 1, data: [1, 2, 3] };

            const result = await service.createSpan('data-span', async () => expected);

            expect(result).toEqual(expected);
        });

        it('should propagate errors from the function', async () => {
            await expect(
                service.createSpan('error-span', async () => {
                    throw new Error('Span operation failed');
                })
            ).rejects.toThrow('Span operation failed');
        });

        it('should handle non-Error throws', async () => {
            await expect(
                service.createSpan('string-error-span', async () => {
                    throw 'string error';
                })
            ).rejects.toBe('string error');
        });
    });
});
