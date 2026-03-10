import { Test, TestingModule } from '@nestjs/testing';
import { TracingService } from './tracing.service';

describe('TracingService (Plan)', () => {
    let service: TracingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TracingService],
        }).compile();

        service = module.get<TracingService>(TracingService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createSpan', () => {
        it('should execute callback and return result', async () => {
            const result = await service.createSpan('test-span', async () => 'test-result');

            expect(result).toBe('test-result');
        });

        it('should execute callback and return complex data', async () => {
            const expected = { id: 1, name: 'test' };

            const result = await service.createSpan('data-span', async () => expected);

            expect(result).toEqual(expected);
        });

        it('should propagate errors from callback', async () => {
            await expect(
                service.createSpan('error-span', async () => {
                    throw new Error('Span callback failed');
                })
            ).rejects.toThrow('Span callback failed');
        });

        it('should log span completion', async () => {
            const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

            await service.createSpan('logged-span', async () => 'ok');

            expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('logged-span'));
        });

        it('should log span error on failure', async () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(
                service.createSpan('fail-span', async () => {
                    throw new Error('fail');
                })
            ).rejects.toThrow();

            expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('fail-span'));
        });
    });

    describe('getActiveSpan', () => {
        it('should return null when no active span', () => {
            const result = service.getActiveSpan();

            expect(result).toBeNull();
        });
    });
});
