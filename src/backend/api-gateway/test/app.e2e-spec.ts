import { HttpStatus, INestApplication } from '@nestjs/common'; // @nestjs/common v10.0.0
import { Test } from '@nestjs/testing'; // @nestjs/testing v10.0.0
import * as request from 'supertest'; // supertest v6.3.4
import { AppModule } from '../src/app.module'; // internal
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals'; // @jest/globals v29.0.0

/**
 * API Gateway E2E Tests
 * 
 * This suite tests the API Gateway's core functionality, including:
 * - Proper routing of requests to the /graphql endpoint
 * - Authentication of protected endpoints
 * - Handling of valid GraphQL queries
 */
describe('API Gateway E2E Tests', () => {
  let app: INestApplication;

  /**
   * Sets up the testing environment before each test case.
   * This includes creating a testing module and initializing the NestJS application.
   */
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * Cleans up the testing environment after all test cases are executed.
   * This includes closing the NestJS application to release resources.
   */
  afterAll(async () => {
    await app.close();
  });

  /**
   * Test case: should return 200 OK for /graphql endpoint
   * 
   * Verifies that the /graphql endpoint is accessible and returns a 200 OK status code.
   * This ensures that the API Gateway is properly routing requests to the GraphQL handler.
   */
  it('should return 200 OK for /graphql endpoint', () => {
    return request(app.getHttpServer())
      .get('/graphql')
      .expect(HttpStatus.OK);
  });

  /**
   * Test case: should return a valid response for a simple GraphQL query
   * 
   * Verifies that the API Gateway can handle a simple GraphQL query and returns a valid response.
   * This ensures that the GraphQL handler is correctly configured and can process queries.
   */
  it('should return a valid response for a simple GraphQL query', () => {
    const query = `
      query {
        __typename
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.data).toBeDefined();
      });
  });

  /**
   * Test case: should return 401 Unauthorized for a protected endpoint without a valid token
   * 
   * Verifies that the API Gateway correctly protects endpoints that require authentication.
   * This ensures that only authorized users with a valid JWT token can access protected resources.
   */
  it('should return 401 Unauthorized for a protected endpoint without a valid token', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .expect(HttpStatus.UNAUTHORIZED);
  });
});