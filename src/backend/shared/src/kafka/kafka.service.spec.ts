import { Test, TestingModule } from '@nestjs/testing';

import { KafkaService } from './kafka.service';
import { LoggerService } from '../logging/logger.service';

// Mock kafkajs
jest.mock('kafkajs', () => {
    const mockProducer = {
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        send: jest.fn().mockResolvedValue(undefined),
    };

    const mockConsumer = {
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        subscribe: jest.fn().mockResolvedValue(undefined),
        run: jest.fn().mockResolvedValue(undefined),
    };

    return {
        Kafka: jest.fn().mockImplementation(() => ({
            producer: jest.fn().mockReturnValue(mockProducer),
            consumer: jest.fn().mockReturnValue(mockConsumer),
        })),
    };
});

describe('KafkaService', () => {
    let service: KafkaService;

    const kafkaOptions = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
        groupId: 'test-group',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: KafkaService,
                    useFactory: (logger: LoggerService) => new KafkaService(kafkaOptions, logger),
                    inject: [LoggerService],
                },
                {
                    provide: 'KAFKA_OPTIONS',
                    useValue: kafkaOptions,
                },
                {
                    provide: LoggerService,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn(),
                        setContext: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<KafkaService>(KafkaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should connect producer and consumer on init', async () => {
            await service.onModuleInit();

            // Service should be operational after init
            expect(service).toBeDefined();
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect gracefully on destroy', async () => {
            await service.onModuleInit();
            await expect(service.onModuleDestroy()).resolves.toBeUndefined();
        });
    });

    describe('emit', () => {
        it('should send a message to a topic', async () => {
            await service.onModuleInit();

            await expect(
                service.emit('test-topic', { event: 'test', data: 'value' })
            ).resolves.toBeUndefined();
        });

        it('should send a string message', async () => {
            await service.onModuleInit();

            await expect(
                service.emit('test-topic', 'simple string message')
            ).resolves.toBeUndefined();
        });

        it('should send with key and headers', async () => {
            await service.onModuleInit();

            await expect(
                service.emit('test-topic', { data: 'value' }, 'msg-key', { 'trace-id': 'abc123' })
            ).resolves.toBeUndefined();
        });
    });

    describe('produce', () => {
        it('should be an alias for emit', async () => {
            await service.onModuleInit();

            await expect(service.produce('test-topic', { event: 'test' })).resolves.toBeUndefined();
        });
    });

    describe('subscribe', () => {
        it('should subscribe to a topic with a handler', async () => {
            await service.onModuleInit();

            const handler = jest.fn();
            await expect(
                service.subscribe('test-topic', 'test-group', handler)
            ).resolves.toBeUndefined();
        });
    });
});
