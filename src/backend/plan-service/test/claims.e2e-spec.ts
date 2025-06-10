import { HttpStatus, INestApplication } from '@nestjs/common'; // 10.0.0
import { Test } from '@nestjs/testing'; // 10.0.0
import { describe, it, beforeEach, afterEach, expect } from '@jest/globals'; // 29.0.0
import * as request from 'supertest'; // 6.3.3
import { AppModule } from '@app/plan/app.module';
import { PrismaService } from '@app/shared/database/prisma.service';
import { CreateClaimDto } from '@app/plan/claims/dto/create-claim.dto';

/**
 * Defines the end-to-end tests for the claims module.
 * These tests verify the behavior of the claims API endpoints,
 * including creating, retrieving, updating, and deleting claims.
 */
describe('ClaimsModule (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  /**
   * Sets up the testing environment before each test suite.
   * Creates a testing module with the AppModule and initializes the NestJS application.
   */
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  /**
   * Cleans up the testing environment after each test suite.
   * Closes the NestJS application and disconnects the PrismaService.
   */
  afterEach(async () => {
    if (app) {
      await app.close();
    }
    await prismaService.$disconnect();
  });

  /**
   * Defines a test case for creating a new claim.
   * Verifies that the API endpoint returns a 201 Created status code
   * and that the response body contains the created claim data.
   */
  it('should create a new claim', async () => {
    const createClaimDto: CreateClaimDto = {
      planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Example UUID
      type: 'MEDICAL_VISIT',
      amount: 100.00,
    };

    const response = await request(app.getHttpServer())
      .post('/claims')
      .send(createClaimDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toBeDefined();
    expect(response.body.planId).toEqual(createClaimDto.planId);
    expect(response.body.type).toEqual(createClaimDto.type);
    expect(response.body.amount).toEqual(createClaimDto.amount);
  });

  /**
   * Defines a test case for retrieving all claims.
   * Verifies that the API endpoint returns a 200 OK status code
   * and that the response body contains an array of claims.
   */
  it('should retrieve all claims', async () => {
    const response = await request(app.getHttpServer())
      .get('/claims')
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  /**
   * Defines a test case for retrieving a single claim by its ID.
   * Verifies that the API endpoint returns a 200 OK status code
   * and that the response body contains the claim data.
   */
  it('should retrieve a single claim by ID', async () => {
    // First, create a claim to ensure there's data to retrieve
    const createClaimDto: CreateClaimDto = {
      planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Example UUID
      type: 'MEDICAL_VISIT',
      amount: 100.00,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/claims')
      .send(createClaimDto);

    const claimId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/claims/${claimId}`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.id).toEqual(claimId);
  });

  /**
   * Defines a test case for updating an existing claim.
   * Verifies that the API endpoint returns a 200 OK status code
   * and that the response body contains the updated claim data.
   */
  it('should update an existing claim', async () => {
    // First, create a claim to ensure there's data to update
    const createClaimDto: CreateClaimDto = {
      planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Example UUID
      type: 'MEDICAL_VISIT',
      amount: 100.00,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/claims')
      .send(createClaimDto);

    const claimId = createResponse.body.id;

    const updateClaimDto = {
      amount: 200.00,
    };

    const response = await request(app.getHttpServer())
      .put(`/claims/${claimId}`)
      .send(updateClaimDto)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.id).toEqual(claimId);
    expect(response.body.amount).toEqual(updateClaimDto.amount);
  });

  /**
   * Defines a test case for deleting a claim.
   * Verifies that the API endpoint returns a 204 No Content status code.
   */
  it('should delete a claim', async () => {
    // First, create a claim to ensure there's data to delete
    const createClaimDto: CreateClaimDto = {
      planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Example UUID
      type: 'MEDICAL_VISIT',
      amount: 100.00,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/claims')
      .send(createClaimDto);

    const claimId = createResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/claims/${claimId}`)
      .expect(HttpStatus.NO_CONTENT);

    // Verify that the claim is actually deleted
    await request(app.getHttpServer())
      .get(`/claims/${claimId}`)
      .expect(HttpStatus.OK) // Assuming 200 is returned even if not found
      .then(response => {
        expect(response.body).toBeNull(); // Adjust based on your actual implementation
      });
  });
});