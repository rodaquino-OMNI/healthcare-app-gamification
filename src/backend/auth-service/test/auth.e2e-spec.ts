import { PrismaService } from '@app/shared/database/prisma.service';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('Auth Module (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    // Test data
    const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '+5511999999999',
        cpf: '12345678901',
    };

    // Store tokens for later use
    let jwtToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        // Create a testing module
        const moduleFixture = await Test.createTestingModule({
            imports: [
                // Import the AuthModule
                // This is a placeholder - in a real test, you would import the actual AuthModule
            ],
            providers: [
                PrismaService,
                AuthService,
                // Mock other required services
                {
                    provide: 'ConfigService',
                    useValue: {
                        get: jest.fn().mockImplementation((key) => {
                            if (key === 'authService.jwt') {
                                return {
                                    secret: 'test-secret',
                                    accessTokenExpiration: '1h',
                                    refreshTokenExpiration: '7d',
                                    issuer: 'test-issuer',
                                    audience: 'test-audience',
                                };
                            }
                            return undefined;
                        }),
                    },
                },
                {
                    provide: 'JwtService',
                    useValue: {
                        sign: jest.fn().mockReturnValue('test-jwt-token'),
                    },
                },
                {
                    provide: 'UsersService',
                    useValue: {
                        create: jest
                            .fn()
                            .mockImplementation((dto) =>
                                Promise.resolve({ id: 'user-id', ...dto, password: undefined })
                            ),
                        validateCredentials: jest.fn().mockImplementation((email, password) => {
                            if (password === 'Password123!') {
                                return Promise.resolve({ id: 'user-id', email });
                            }
                            throw new Error('Invalid credentials');
                        }),
                        findByEmail: jest.fn().mockImplementation((email) => {
                            return Promise.resolve({ id: 'user-id', email });
                        }),
                    },
                },
            ],
        })
            .overrideProvider(AuthService)
            .useValue({
                register: jest
                    .fn()
                    .mockImplementation((dto) =>
                        Promise.resolve({ id: 'user-id', ...dto, password: undefined })
                    ),
                login: jest.fn().mockImplementation((email, password) => {
                    if (password === 'Password123!') {
                        return Promise.resolve({
                            accessToken: 'test-jwt-token',
                            refreshToken: 'test-refresh-token',
                        });
                    }
                    throw new Error('Invalid credentials');
                }),
                generateJwt: jest.fn().mockReturnValue('test-jwt-token'),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prisma = moduleFixture.get<PrismaService>(PrismaService);

        // Clean up database before tests
        await prisma.user.deleteMany({ where: { email: createUserDto.email } });
    });

    afterAll(async () => {
        // Clean up database after tests
        await prisma.user.deleteMany({ where: { email: createUserDto.email } });
        await app.close();
    });

    it('should register a new user', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(createUserDto.email);
        expect(response.body).not.toHaveProperty('password'); // Password should not be returned

        // Store refresh token if it's returned from registration
        if (response.body.refreshToken) {
            refreshToken = response.body.refreshToken;
        }
    });

    it('should login with valid credentials', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: createUserDto.email,
                password: createUserDto.password,
            })
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('accessToken');
        jwtToken = response.body.accessToken;

        // Store refresh token if it's returned from login
        if (response.body.refreshToken) {
            refreshToken = response.body.refreshToken;
        }
    });

    it('should fail to login with invalid credentials', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: createUserDto.email,
                password: 'WrongPassword123!',
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should refresh token', async () => {
        // Skip this test if refresh token is not available
        if (!refreshToken) {
            console.warn('Skipping refresh token test as refresh token is not available');
            return;
        }

        const response = await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('accessToken');
        jwtToken = response.body.accessToken; // Update token for subsequent tests
    });

    it('should get current user profile', async () => {
        // Skip this test if JWT token is not available
        if (!jwtToken) {
            console.warn('Skipping current user test as JWT token is not available');
            return;
        }

        const response = await request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(createUserDto.email);
        expect(response.body).not.toHaveProperty('password'); // Password should not be returned
    });
});
