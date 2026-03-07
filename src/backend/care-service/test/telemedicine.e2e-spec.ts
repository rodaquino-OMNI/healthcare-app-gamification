/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtAuthGuard } from '@app/shared/auth/guards/jwt-auth.guard';
import { PrismaService } from '@app/shared/database/prisma.service';
import { AppExceptionFilter } from '@app/shared/exceptions/exceptions.filter';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { CreateSessionDto } from '@app/care/telemedicine/dto/create-session.dto';
import { TelemedicineController } from '@app/care/telemedicine/telemedicine.controller';
import { TelemedicineService } from '@app/care/telemedicine/telemedicine.service';

describe('Telemedicine E2E Tests', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    // Mock user for authentication
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
    };

    beforeAll(async () => {
        // Create a testing module
        const moduleRef = await Test.createTestingModule({
            controllers: [TelemedicineController],
            providers: [TelemedicineService, PrismaService],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true }) // Default to authenticated
            .compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get<PrismaService>(PrismaService);

        // Apply global exception filter
        app.useGlobalFilters(new AppExceptionFilter());

        // Add user to request
        app.use((req, res, next) => {
            req.user = mockUser;
            next();
        });

        await app.init();

        // Seed the database with test data
        await seedDatabase();
    });

    afterAll(async () => {
        // Clean up database
        await cleanDatabase();

        // Close the application
        await app.close();
    });

    // Helper function to seed the database with necessary test data
    async function seedDatabase() {
        // Seed appointment
        await prismaService.appointment.create({
            data: {
                id: 'test-appointment-id',
                userId: mockUser.id,
                providerId: 'test-provider-id',
                dateTime: new Date(),
                status: 'SCHEDULED',
                type: 'TELEMEDICINE',
                reason: 'Test appointment',
            },
        });

        // Seed provider
        await prismaService.provider.create({
            data: {
                id: 'test-provider-id',
                name: 'Dr. Test Provider',
                specialtyId: 'test-specialty-id',
                active: true,
            },
        });

        // Seed specialty
        await prismaService.specialty.create({
            data: {
                id: 'test-specialty-id',
                name: 'Test Specialty',
            },
        });
    }

    // Helper function to clean the database after tests
    async function cleanDatabase() {
        await prismaService.telemedicineSession.deleteMany({});
        await prismaService.appointment.deleteMany({});
        await prismaService.provider.deleteMany({});
        await prismaService.specialty.deleteMany({});
    }

    describe('POST /telemedicine/session', () => {
        it('should create a telemedicine session', async () => {
            // Create valid DTO for session creation
            const createSessionDto: CreateSessionDto = {
                appointmentId: 'test-appointment-id',
                providerId: 'test-provider-id',
            };

            // Make the request
            const response = await request(app.getHttpServer())
                .post('/telemedicine/session')
                .send(createSessionDto)
                .expect(HttpStatus.CREATED);

            // Validate the response
            expect(response.body).toBeDefined();
            expect(response.body.id).toBeDefined();
            expect(response.body.appointmentId).toEqual((createSessionDto as any).appointmentId);
            expect(response.body.providerId).toEqual(createSessionDto.providerId);
            expect(response.body.status).toEqual('CREATED');
        });

        it('should return 401 if not authenticated', async () => {
            // Create a separate testing module for unauthenticated test
            const unauthModuleRef = await Test.createTestingModule({
                controllers: [TelemedicineController],
                providers: [TelemedicineService, PrismaService],
            })
                .overrideGuard(JwtAuthGuard)
                .useValue({ canActivate: () => false }) // Set to unauthenticated
                .compile();

            const unauthApp = unauthModuleRef.createNestApplication();
            unauthApp.useGlobalFilters(new AppExceptionFilter());
            await unauthApp.init();

            try {
                // Create valid DTO for session creation
                const createSessionDto: CreateSessionDto = {
                    appointmentId: 'test-appointment-id',
                    providerId: 'test-provider-id',
                };

                // Make the request to the unauthenticated app instance
                await request(unauthApp.getHttpServer())
                    .post('/telemedicine/session')
                    .send(createSessionDto)
                    .expect(HttpStatus.UNAUTHORIZED);
            } finally {
                // Close the unauthenticated app instance
                await unauthApp.close();
            }
        });
    });
});
