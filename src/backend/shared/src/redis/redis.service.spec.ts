import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { LoggerService } from '../logging/logger.service';

// Mock ioredis
jest.mock('ioredis', () => {
    const mockRedis = {
        get: jest.fn().mockResolvedValue('value'),
        set: jest.fn().mockResolvedValue('OK'),
        setex: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        exists: jest.fn().mockResolvedValue(1),
        expire: jest.fn().mockResolvedValue(1),
        ttl: jest.fn().mockResolvedValue(300),
        hget: jest.fn().mockResolvedValue('field-value'),
        hset: jest.fn().mockResolvedValue(1),
        hmset: jest.fn().mockResolvedValue('OK'),
        hgetall: jest.fn().mockResolvedValue({ key1: 'val1' }),
        hdel: jest.fn().mockResolvedValue(1),
        zadd: jest.fn().mockResolvedValue(1),
        zrange: jest.fn().mockResolvedValue(['member1', 'member2']),
        publish: jest.fn().mockResolvedValue(1),
        subscribe: jest.fn().mockResolvedValue(undefined),
        unsubscribe: jest.fn().mockResolvedValue(undefined),
        ping: jest.fn().mockResolvedValue('PONG'),
        quit: jest.fn().mockResolvedValue('OK'),
        on: jest.fn(),
    };
    return jest.fn().mockImplementation(() => mockRedis);
});

describe('RedisService', () => {
    let service: RedisService;
    let configService: { get: jest.Mock };

    beforeEach(async () => {
        configService = {
            get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
                const config: Record<string, unknown> = {
                    'redis.host': 'localhost',
                    'redis.port': 6379,
                    'redis.password': '',
                    'redis.db': 0,
                    'redis.url': '',
                };
                return config[key] ?? defaultValue;
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RedisService,
                { provide: ConfigService, useValue: configService },
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

        service = module.get<RedisService>(RedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('get', () => {
        it('should retrieve a value by key', async () => {
            const result = await service.get('test-key');

            expect(result).toBe('value');
        });
    });

    describe('set', () => {
        it('should set a value without TTL', async () => {
            const result = await service.set('test-key', 'test-value');

            expect(result).toBe('OK');
        });

        it('should set a value with TTL', async () => {
            const result = await service.set('test-key', 'test-value', 300);

            expect(result).toBe('OK');
        });
    });

    describe('del', () => {
        it('should delete a single key', async () => {
            const result = await service.del('test-key');

            expect(result).toBe(1);
        });

        it('should delete multiple keys', async () => {
            const result = await service.del(['key1', 'key2']);

            expect(result).toBe(1);
        });
    });

    describe('exists', () => {
        it('should check if a key exists', async () => {
            const result = await service.exists('test-key');

            expect(result).toBe(1);
        });
    });

    describe('expire', () => {
        it('should set expiration on a key', async () => {
            const result = await service.expire('test-key', 300);

            expect(result).toBe(1);
        });
    });

    describe('ttl', () => {
        it('should return remaining TTL', async () => {
            const result = await service.ttl('test-key');

            expect(result).toBe(300);
        });
    });

    describe('hash operations', () => {
        it('should get a hash field value', async () => {
            const result = await service.hget('hash-key', 'field1');

            expect(result).toBe('field-value');
        });

        it('should set a hash field value', async () => {
            const result = await service.hset('hash-key', 'field1', 'value1');

            expect(result).toBe(1);
        });

        it('should set multiple hash fields', async () => {
            const result = await service.hmset('hash-key', { field1: 'val1', field2: 'val2' });

            expect(result).toBe('OK');
        });

        it('should get all hash fields', async () => {
            const result = await service.hgetall('hash-key');

            expect(result).toEqual({ key1: 'val1' });
        });

        it('should delete hash fields', async () => {
            const result = await service.hdel('hash-key', 'field1');

            expect(result).toBe(1);
        });
    });

    describe('sorted set operations', () => {
        it('should add member to sorted set', async () => {
            const result = await service.zadd('zset-key', 100, 'member1');

            expect(result).toBe(1);
        });

        it('should get range from sorted set', async () => {
            const result = await service.zrange('zset-key', 0, -1);

            expect(result).toEqual(['member1', 'member2']);
        });
    });

    describe('pub/sub', () => {
        it('should publish a message', async () => {
            const result = await service.publish('channel', 'message');

            expect(result).toBe(1);
        });
    });

    describe('getJourneyTTL', () => {
        it('should return 5 minutes for health journey', () => {
            expect(service.getJourneyTTL('health')).toBe(300);
        });

        it('should return 1 minute for care journey', () => {
            expect(service.getJourneyTTL('care')).toBe(60);
        });

        it('should return 15 minutes for plan journey', () => {
            expect(service.getJourneyTTL('plan')).toBe(900);
        });

        it('should return 2 minutes for game journey', () => {
            expect(service.getJourneyTTL('game')).toBe(120);
        });

        it('should return 5 minutes for unknown journey', () => {
            expect(service.getJourneyTTL('unknown')).toBe(300);
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect gracefully', async () => {
            await expect(service.onModuleDestroy()).resolves.toBeUndefined();
        });
    });
});
