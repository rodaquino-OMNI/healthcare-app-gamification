import { Test, TestingModule } from '@nestjs/testing'; // ^9.0.0
import { INestApplication, HttpStatus } from '@nestjs/common'; // ^9.0.0
import { describe, it, beforeEach, afterEach, expect } from '@jest/globals'; // 29.0.0+
import * as request from 'supertest'; // 6.3.3
import { SuperAgentTest } from 'supertest'; // 6.3.3
import { ConnectDeviceDto, DeviceType } from '../src/devices/dto/connect-device.dto';
import { DevicesService } from '../src/devices/devices.service';
import { DevicesController } from '../src/devices/devices.controller';
import { DeviceConnection } from '../src/devices/entities/device-connection.entity';
import { AppModule } from '../src/app.module';
import { Configuration } from '../src/config/configuration';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { JwtAuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/backend/auth-service/src/auth/decorators/current-user.decorator';

/**
 * End-to-end tests for the DevicesController, verifying the correct behavior
 * of device connection and retrieval endpoints. These tests ensure that the API
 * endpoints function as expected and that device data is properly managed.
 */
describe('DevicesController (e2e)', () => {
  let app: INestApplication;
  let devicesService: DevicesService;
  let prismaService: PrismaService;
  let agent: SuperAgentTest;

  const recordId = 'test-record-id';
  const connectDeviceDto: ConnectDeviceDto = {
    deviceId: 'test-device-id',
    deviceType: DeviceType.SMARTWATCH,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    devicesService = moduleFixture.get<DevicesService>(DevicesService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    app.useGlobalFilters(new AllExceptionsFilter(moduleFixture.get(Configuration)));
    await app.init();
    agent = request.agent(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('should connect a device', async () => {
    const response = await agent
      .post(`/records/${recordId}/devices`)
      .send(connectDeviceDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      id: expect.any(String),
      recordId: recordId,
      deviceType: connectDeviceDto.deviceType,
      deviceId: connectDeviceDto.deviceId,
      lastSync: null,
      status: 'connected',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should get devices', async () => {
    // First connect a device to ensure there's data to retrieve
    await agent
      .post(`/records/${recordId}/devices`)
      .send(connectDeviceDto)
      .expect(HttpStatus.CREATED);

    const response = await agent
      .get(`/records/${recordId}/devices`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recordId: recordId,
          deviceType: connectDeviceDto.deviceType,
          deviceId: connectDeviceDto.deviceId,
        }),
      ]),
    );
  });
});