import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { PrismaService } from '@app/shared/database/prisma.service';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { describe, it, beforeEach, afterEach, expect } from '@jest/globals'; // 29.0.0+
import { INestApplication, HttpStatus } from '@nestjs/common'; // ^9.0.0
import { AuthGuard } from '@nestjs/passport';

const JwtAuthGuard = AuthGuard('jwt');
import { Test, TestingModule } from '@nestjs/testing'; // ^9.0.0
import request from 'supertest'; // 6.3.3
import { SuperAgentTest } from 'supertest'; // 6.3.3

import { AppModule } from '../src/app.module';
import { DevicesController } from '../src/devices/devices.controller';
import { DevicesService } from '../src/devices/devices.service';
import { ConnectDeviceDto, DeviceType } from '../src/devices/dto/connect-device.dto';
import { DeviceConnection } from '../src/devices/entities/device-connection.entity';

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
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleFixture.createNestApplication();
        devicesService = moduleFixture.get<DevicesService>(DevicesService);
        prismaService = moduleFixture.get<PrismaService>(PrismaService);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app.useGlobalFilters(new AllExceptionsFilter(moduleFixture.get('health' as any)));
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
        await agent.post(`/records/${recordId}/devices`).send(connectDeviceDto).expect(HttpStatus.CREATED);

        const response = await agent.get(`/records/${recordId}/devices`).expect(HttpStatus.OK);

        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    recordId: recordId,
                    deviceType: connectDeviceDto.deviceType,
                    deviceId: connectDeviceDto.deviceId,
                }),
            ])
        );
    });
});
