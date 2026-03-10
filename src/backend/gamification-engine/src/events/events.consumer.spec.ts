import { Test, TestingModule } from '@nestjs/testing';

import { EventsConsumer } from './events.consumer';

describe('EventsConsumer', () => {
    let consumer: EventsConsumer;
    let mockKafkaService: Record<string, jest.Mock>;
    let mockRulesService: Record<string, jest.Mock>;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(async () => {
        mockKafkaService = { subscribe: jest.fn().mockResolvedValue(undefined) };
        mockRulesService = { processEvent: jest.fn().mockResolvedValue({}) };
        mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsConsumer,
                { provide: 'KafkaService', useValue: mockKafkaService },
                { provide: 'RulesService', useValue: mockRulesService },
                { provide: 'LoggerService', useValue: mockLogger },
            ],
        })
            .overrideProvider(EventsConsumer)
            .useFactory({
                factory: () => {
                    const instance = new EventsConsumer(
                        mockKafkaService as never,
                        mockRulesService as never,
                        mockLogger as never,
                    );
                    return instance;
                },
            })
            .compile();

        consumer = module.get<EventsConsumer>(EventsConsumer);
    });

    it('should be defined', () => {
        expect(consumer).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should subscribe to all topics', async () => {
            await consumer.onModuleInit();

            expect(mockKafkaService.subscribe).toHaveBeenCalledTimes(4);
            expect(mockKafkaService.subscribe).toHaveBeenCalledWith(
                'health.events',
                'gamification-engine-group',
                expect.any(Function),
            );
        });

        it('should throw when kafka subscription fails', async () => {
            mockKafkaService.subscribe.mockRejectedValue(new Error('Kafka down'));

            await expect(consumer.onModuleInit()).rejects.toThrow('Kafka down');
        });
    });
});
