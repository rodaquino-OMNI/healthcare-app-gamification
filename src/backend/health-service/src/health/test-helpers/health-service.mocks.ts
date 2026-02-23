import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../health.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { ConfigService } from '@nestjs/config';

export interface HealthServiceTestContext {
  service: HealthService;
  prismaService: jest.Mocked<PrismaService>;
  redisService: jest.Mocked<RedisService>;
  kafkaService: jest.Mocked<KafkaService>;
  configService: jest.Mocked<ConfigService>;
}

export const mockPrismaService = {
  healthMetric: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
  },
  healthGoal: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

export const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  zadd: jest.fn(),
  zrange: jest.fn(),
  del: jest.fn(),
  expire: jest.fn(),
};

export const mockKafkaService = {
  emit: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn().mockReturnValue('test-value'),
};

export async function createHealthServiceTestModule(): Promise<HealthServiceTestContext> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      HealthService,
      {
        provide: PrismaService,
        useValue: mockPrismaService,
      },
      {
        provide: RedisService,
        useValue: mockRedisService,
      },
      {
        provide: KafkaService,
        useValue: mockKafkaService,
      },
      {
        provide: ConfigService,
        useValue: mockConfigService,
      },
    ],
  }).compile();

  return {
    service: module.get<HealthService>(HealthService),
    prismaService: module.get(PrismaService),
    redisService: module.get(RedisService),
    kafkaService: module.get(KafkaService),
    configService: module.get(ConfigService),
  };
}
