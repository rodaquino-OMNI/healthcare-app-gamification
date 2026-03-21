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
        mockConfigService = {
            get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
                const config: Record<string, string> = {
                    'gamificationEngine.kafka.groupId': 'gamification-consumer-group',
                    'gamificationEngine.kafka.topics.healthEvents': 'health.events',
                    'gamificationEngine.kafka.topics.careEvents': 'care.events',
                    'gamificationEngine.kafka.topics.planEvents': 'plan.events',
                };
                return config[key] ?? defaultValue;
            }),
        };
        mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

        service = new KafkaConsumerService(
            mockEventsService as never,
            mockRulesService as never,
            mockProfilesService as never,
            mockKafkaService as never,
            mockConfigService as never,
            mockLogger as never
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should subscribe to kafka topics', async () => {
            await service.onModuleInit();

            expect(mockKafkaService.subscribe).toHaveBeenCalledTimes(3);
        });

        it('should warn when no topics configured', async () => {
            mockConfigService.get.mockReturnValue(undefined);

            await service.onModuleInit();

            expect(mockLogger.warn).toHaveBeenCalled();
            expect(mockKafkaService.subscribe).not.toHaveBeenCalled();
        });

        it('should not throw when kafka setup fails', async () => {
            mockKafkaService.subscribe.mockRejectedValue(new Error('Connection refused'));

            await expect(service.onModuleInit()).resolves.not.toThrow();
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
