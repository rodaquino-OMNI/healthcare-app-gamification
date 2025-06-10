/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../../shared/src/database/prisma.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userId: string;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    
    // Clean up the test database before each test
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    });
    
    await app.init();
  });

  afterAll(async () => {
    // Clean up after all tests
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    });
    
    await prismaService.$disconnect();
    await app.close();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!',
      phone: '123456789',
      cpf: '12345678901',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(createUserDto.name);
    expect(response.body.email).toBe(createUserDto.email);
    expect(response.body.password).toBeUndefined(); // Password should not be returned
    
    // Save the user ID for subsequent tests
    userId = response.body.id;
  });

  it('should return validation errors for invalid user data', async () => {
    const invalidUserDto = {
      name: 'Test User',
      email: 'invalid-email', // Invalid email format
      password: 'short', // Too short
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBeDefined();
    expect(response.body.(error as any).message).toBeDefined();
  });

  it('should get all users', async () => {
    // First create a user to ensure there's at least one
    const createUserDto: CreateUserDto = {
      name: 'Test User For Get All',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!',
      phone: '123456789',
      cpf: '12345678901',
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    // Then get all users - this requires admin privileges
    // Note: In a real app, you'd need to authenticate as admin first
    // For test purposes, you may need to mock authentication or use a test admin token
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    // First create a user to get its ID
    const createUserDto: CreateUserDto = {
      name: 'Test User For Get By ID',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!',
      phone: '123456789',
      cpf: '12345678901',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    const userIdToGet = createResponse.body.id;

    // Then get the user by ID
    const response = await request(app.getHttpServer())
      .get(`/users/${userIdToGet}`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(userIdToGet);
    expect(response.body.name).toBe(createUserDto.name);
    expect(response.body.email).toBe(createUserDto.email);
    expect(response.body.password).toBeUndefined(); // Password should not be returned
  });

  it('should return 404 for non-existent user ID', async () => {
    const nonExistentId = 'non-existent-id';
    
    await request(app.getHttpServer())
      .get(`/users/${nonExistentId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should update a user', async () => {
    // First create a user to update
    const createUserDto: CreateUserDto = {
      name: 'Test User For Update',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!',
      phone: '123456789',
      cpf: '12345678901',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    const userIdToUpdate = createResponse.body.id;

    // Then update the user
    const updateData = {
      name: 'Updated Test User',
      phone: '987654321',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch(`/users/${userIdToUpdate}`)
      .send(updateData)
      .expect(HttpStatus.OK);

    expect(updateResponse.body).toBeDefined();
    expect(updateResponse.body.id).toBe(userIdToUpdate);
    expect(updateResponse.body.name).toBe(updateData.name);
    expect(updateResponse.body.phone).toBe(updateData.phone);
    expect(updateResponse.body.email).toBe(createUserDto.email); // Email should remain unchanged
  });

  it('should delete a user', async () => {
    // First create a user to delete
    const createUserDto: CreateUserDto = {
      name: 'Test User For Delete',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!',
      phone: '123456789',
      cpf: '12345678901',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    const userIdToDelete = createResponse.body.id;

    // Then delete the user
    await request(app.getHttpServer())
      .delete(`/users/${userIdToDelete}`)
      .expect(HttpStatus.NO_CONTENT);

    // Verify the user is deleted
    await request(app.getHttpServer())
      .get(`/users/${userIdToDelete}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});