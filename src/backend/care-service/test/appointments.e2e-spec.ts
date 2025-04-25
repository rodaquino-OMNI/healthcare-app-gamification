import { Test, TestingModule } from '@nestjs/testing'; // version ^9.0.0
import { INestApplication, HttpStatus } from '@nestjs/common'; // version ^9.0.0
import * as request from 'supertest'; // version 6.3.3
import { AppointmentsController } from '../src/appointments/appointments.controller';
import { AppointmentsService } from '../src/appointments/appointments.service';
import { CreateAppointmentDto } from '../src/appointments/dto/create-appointment.dto';
import { AUTH_INSUFFICIENT_PERMISSIONS } from 'src/backend/shared/src/constants/error-codes.constants';
import { SuperAgentTest } from 'supertest'; // version 6.3.3
import { beforeEach, describe, expect, it, afterAll } from '@jest/globals'; // version 29.0.0+

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            create: () => ({}),
            findAll: () => [],
            findOne: () => ({}),
            update: () => ({}),
            remove: () => ({}),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    agent = request.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('/appointments (POST) should return 201 if successful', () => {
    const createAppointmentDto: CreateAppointmentDto = {
      userId: 'valid-uuid',
      providerId: 'valid-uuid',
      dateTime: new Date(),
      type: 'in-person',
    };

    return agent
      .post('/appointments')
      .send(createAppointmentDto)
      .expect(HttpStatus.CREATED);
  });

  it('/appointments (POST) should return 403 if insufficient permissions', () => {
    const createAppointmentDto: CreateAppointmentDto = {
      userId: 'valid-uuid',
      providerId: 'valid-uuid',
      dateTime: new Date(),
      type: 'in-person',
    };

    return agent
      .post('/appointments')
      .send(createAppointmentDto)
      .expect(HttpStatus.FORBIDDEN)
      .expect((res) => {
        expect(res.body.error.code).toBe(AUTH_INSUFFICIENT_PERMISSIONS);
      });
  });

  it('/appointments (GET) should return 200 if successful', () => {
    return agent
      .get('/appointments')
      .expect(HttpStatus.OK);
  });

  it('/appointments/:id (GET) should return 200 if successful', () => {
    return agent
      .get('/appointments/valid-uuid')
      .expect(HttpStatus.OK);
  });

  it('/appointments/:id (PATCH) should return 200 if successful', () => {
    const updateAppointmentDto = {
      notes: 'Updated notes',
    };

    return agent
      .patch('/appointments/valid-uuid')
      .send(updateAppointmentDto)
      .expect(HttpStatus.OK);
  });

  it('/appointments/:id (DELETE) should return 204 if successful', () => {
    return agent
      .delete('/appointments/valid-uuid')
      .expect(HttpStatus.NO_CONTENT);
  });
});