import { Test, TestingModule } from '@nestjs/testing'; // @nestjs/testing v10.0.0+
import { INestApplication, HttpStatus } from '@nestjs/common'; // @nestjs/common v10.0.0+
import * as request from 'supertest'; // supertest v6.3.3
import { SuperAgentTest } from 'supertest'; // supertest v6.3.3
import { HealthController } from '../src/health/health.controller'; // Import HealthController for testing
import { HealthService } from '../src/health/health.service'; // Import HealthService for mocking
import { HealthMetric } from '../src/health/entities/health-metric.entity'; // Import HealthMetric entity
import { CreateMetricDto } from '../src/health/dto/create-metric.dto'; // Import CreateMetricDto
import { DevicesService } from '../src/devices/devices.service'; // Import DevicesService
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter'; // Import AllExceptionsFilter
import { AUTH_INSUFFICIENT_PERMISSIONS } from 'src/backend/shared/src/constants/error-codes.constants'; // Import AUTH_INSUFFICIENT_PERMISSIONS
import { KafkaService } from 'src/backend/shared/src/kafka/kafka.service'; // Import KafkaService
import { PrismaService } from 'src/backend/shared/src/database/prisma.service'; // Import PrismaService
import { jest } from '@jest/globals'; // Import jest

/**
 * Comprehensive end-to-end tests for the Health Service, verifying the correct behavior
 * of its API endpoints, data persistence, and integration with other services.
 * It focuses on validating the core functionalities of the Health Journey, such as
 * creating, retrieving, and updating health metrics.
 *
 * Addresses requirement F-101: My Health Journey
 */
describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let healthService: HealthService;
  let prismaService: PrismaService;
  let kafkaService: KafkaService;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        DevicesService,
        PrismaService,
        KafkaService
      ],
    })
      .overrideProvider(HealthService)
      .useValue({
        createHealthMetric: jest.fn(),
        updateHealthMetric: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter(new Logger()));
    await app.init();
    healthService = moduleFixture.get<HealthService>(HealthService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    kafkaService = moduleFixture.get<KafkaService>(KafkaService);
    agent = request.agent(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/health/:recordId (POST)', () => {
    it('should return 201 when creating a valid health metric', async () => {
      const recordId = 'valid-record-id';
      const createMetricDto: CreateMetricDto = {
        type: 'HEART_RATE',
        value: 72,
        unit: 'bpm',
        timestamp: new Date(),
        source: 'MANUAL',
        notes: 'Resting heart rate',
      };

      (healthService.createHealthMetric as jest.Mock).mockResolvedValue({
        id: 'new-metric-id',
        ...createMetricDto,
        recordId,
      });

      const response = await agent
        .post(`/health/${recordId}`)
        .send(createMetricDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        id: 'new-metric-id',
        ...createMetricDto,
        recordId,
      });
      expect(healthService.createHealthMetric).toHaveBeenCalledWith(recordId, createMetricDto);
    });

    it('should return 400 when creating an invalid health metric', async () => {
      const recordId = 'valid-record-id';
      const createMetricDto = {
        type: 'INVALID_TYPE', // Invalid metric type
        value: 'not a number', // Invalid value
        unit: 123, // Invalid unit
        timestamp: 'not a date', // Invalid timestamp
        source: 'WRONG', // Invalid source
        notes: null,
      };

      await agent
        .post(`/health/${recordId}`)
        .send(createMetricDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/health/:id (PUT)', () => {
    it('should return 200 when updating a valid health metric', async () => {
      const metricId = 'valid-metric-id';
      const updateMetricDto = {
        value: 75,
        notes: 'Updated resting heart rate',
      };

      (healthService.updateHealthMetric as jest.Mock).mockResolvedValue({
        id: metricId,
        type: 'HEART_RATE',
        value: 75,
        unit: 'bpm',
        timestamp: new Date(),
        source: 'MANUAL',
        notes: 'Updated resting heart rate',
      });

      const response = await agent
        .put(`/health/${metricId}`)
        .send(updateMetricDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        id: metricId,
        type: 'HEART_RATE',
        value: 75,
        unit: 'bpm',
        timestamp: expect.any(String),
        source: 'MANUAL',
        notes: 'Updated resting heart rate',
      });
      expect(healthService.updateHealthMetric).toHaveBeenCalledWith(metricId, updateMetricDto);
    });

    it('should return 400 when updating an invalid health metric', async () => {
      const metricId = 'valid-metric-id';
      const updateMetricDto = {
        value: 'not a number',
        notes: 123,
      };

      await agent
        .put(`/health/${metricId}`)
        .send(updateMetricDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});