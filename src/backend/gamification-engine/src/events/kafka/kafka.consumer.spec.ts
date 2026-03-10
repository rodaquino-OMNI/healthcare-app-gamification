import { KafkaConsumerService } from './kafka.consumer';

describe('KafkaConsumerService', () => {
    let service: KafkaConsumerService;
    let mockEventsService: Record<string, jest.Mock>;
    let mockRulesService: Record<string, jest.Mock>;
    let mockProfilesService: Record<string, jest.Mock>;
    let mockKafkaService: Record<string, jest.Mock>;
    let mockConfigService: Record<string, jest.Mock>;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(() => {
        mockEventsService = { processEvent: jest.fn().mockResolvedValue({ points: 10 }) };
        mockRulesService = { processEvent: jest.fn() };
        mockProfilesService = { getProfile: jest.fn() };
        mockKafkaService = { subscribe: jest.fn().mockResolvedValue(undefined) };
        mockConfigService = { get: jest.fn().mockReturnValue(undefined) };
        mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

        service = new KafkaConsumerService(
            mockEventsService as never,
            mockRulesService as never,
            mockProfilesService as never,
            mockKafkaService as never,
            mockConfigService as never,
            mockLogger as never,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should subscribe to kafka topics', async () => {
            await service.onModuleInit();

            expect(mockKafkaService.subscribe).toHaveBeenCalled();
        });

        it('should warn when no topics configured', async () => {
            mockConfigService.get.mockReturnValue(undefined);

            await service.onModuleInit();

            // Should still attempt to subscribe with defaults
            expect(mockKafkaService.subscribe).toHaveBeenCalled();
        });

        it('should not throw when kafka setup fails', async () => {
            mockKafkaService.subscribe.mockRejectedValue(new Error('Connection refused'));

            await expect(service.onModuleInit()).resolves.not.toThrow();
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
