import { HttpStatus, INestApplication } from '@nestjs/common'; // v10.0.0+
import { Test } from '@nestjs/testing'; // v10.0.0+
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'; // v29.0.0+
import * as request from 'supertest'; // v6.3.3
import { PrismaService } from '@app/shared/database/prisma.service';
import { AppModule } from '@app/plan/app.module';
import { AuthMiddleware } from 'src/backend/api-gateway/src/middleware/auth.middleware';
import { RolesGuard } from '@app/auth/auth/guards/roles.guard';

describe('Plans - E2E', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testUserId: string;
  let testPlanId: string;

  // Setup before all tests
  beforeAll(async () => {
    // Create testing module
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    // Create app instance
    app = moduleRef.createNestApplication();
    
    // Get PrismaService instance
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    
    // Mock AuthMiddleware to set user context
    app.use((req, res, next) => {
      req.user = {
        id: 'test-user-id',
        email: 'test@example.com',
        roles: ['user'],
      };
      next();
    });
    
    await app.init();
    
    // Seed test data
    await seedTestData();
  });
  
  // Cleanup after all tests
  afterAll(async () => {
    await clearTestData();
    await app.close();
  });
  
  // Helper function to seed test data
  async function seedTestData() {
    // Create test user
    const testUser = await prismaService.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    
    testUserId = testUser.id;
    
    // Create test plan
    const testPlan = await prismaService.plan.create({
      data: {
        userId: testUserId,
        planNumber: 'TEST-PLAN-123',
        type: 'HEALTH',
        validityStart: new Date('2023-01-01'),
        validityEnd: new Date('2023-12-31'),
        coverageDetails: {
          network: 'Premium',
          hospital: true,
          dental: true,
          vision: false,
          pharmacy: true,
        },
      },
    });
    
    testPlanId = testPlan.id;
  }
  
  // Helper function to clear test data
  async function clearTestData() {
    // Delete all benefits associated with test plans
    await prismaService.benefit.deleteMany({
      where: { plan: { userId: testUserId } },
    });
    
    // Delete all plans associated with test user
    await prismaService.plan.deleteMany({
      where: { userId: testUserId },
    });
    
    // Delete test user
    try {
      await prismaService.user.delete({
        where: { id: testUserId },
      });
    } catch (error) {
      console.log('User already deleted or not found');
    }
  }
  
  // Test cases
  describe('GET /plans', () => {
    it('should return a list of plans for the authenticated user', () => {
      return request(app.getHttpServer())
        .get('/plans')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('planNumber');
          expect(res.body[0]).toHaveProperty('type');
          expect(res.body[0]).toHaveProperty('validityStart');
          expect(res.body[0]).toHaveProperty('validityEnd');
          expect(res.body[0]).toHaveProperty('coverageDetails');
        });
    });
  });
  
  describe('GET /plans/:id', () => {
    it('should return a specific plan by ID', () => {
      return request(app.getHttpServer())
        .get(`/plans/${testPlanId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testPlanId);
          expect(res.body).toHaveProperty('planNumber', 'TEST-PLAN-123');
          expect(res.body).toHaveProperty('type', 'HEALTH');
          expect(res.body).toHaveProperty('coverageDetails');
          expect(res.body.coverageDetails).toHaveProperty('network', 'Premium');
        });
    });
    
    it('should return 404 for non-existent plan', () => {
      return request(app.getHttpServer())
        .get('/plans/non-existent-id')
        .expect(HttpStatus.NOT_FOUND);
    });
    
    it('should return 403 for accessing another user\'s plan', async () => {
      // Create another user and plan
      const anotherUser = await prismaService.user.create({
        data: {
          email: 'another@example.com',
          name: 'Another User',
        },
      });
      
      const anotherPlan = await prismaService.plan.create({
        data: {
          userId: anotherUser.id,
          planNumber: 'ANOTHER-PLAN-456',
          type: 'HEALTH',
          validityStart: new Date('2023-01-01'),
          validityEnd: new Date('2023-12-31'),
          coverageDetails: {},
        },
      });
      
      // Try to access another user's plan
      await request(app.getHttpServer())
        .get(`/plans/${anotherPlan.id}`)
        .expect(HttpStatus.FORBIDDEN);
      
      // Clean up
      await prismaService.plan.delete({
        where: { id: anotherPlan.id },
      });
      
      await prismaService.user.delete({
        where: { id: anotherUser.id },
      });
    });
  });
  
  describe('POST /plans', () => {
    it('should create a new plan', () => {
      const newPlan = {
        planNumber: 'NEW-PLAN-456',
        type: 'DENTAL',
        validityStart: '2023-06-01',
        validityEnd: '2024-05-31',
        coverageDetails: {
          network: 'Standard',
          preventive: true,
          basic: true,
          major: false,
          orthodontics: false,
        },
      };
      
      return request(app.getHttpServer())
        .post('/plans')
        .send(newPlan)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('planNumber', 'NEW-PLAN-456');
          expect(res.body).toHaveProperty('type', 'DENTAL');
          expect(res.body).toHaveProperty('userId', testUserId);
          expect(res.body.coverageDetails).toHaveProperty('network', 'Standard');
          
          // Clean up the created plan
          return prismaService.plan.delete({
            where: { id: res.body.id },
          });
        });
    });
    
    it('should return 400 for invalid plan data', () => {
      const invalidPlan = {
        // Missing required fields
        planNumber: 'INVALID-PLAN',
        // Missing type
        // Missing validity dates
      };
      
      return request(app.getHttpServer())
        .post('/plans')
        .send(invalidPlan)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
  
  describe('PUT /plans/:id', () => {
    it('should update an existing plan', () => {
      const updatedDetails = {
        planNumber: 'TEST-PLAN-123-UPDATED',
        coverageDetails: {
          network: 'VIP',
          hospital: true,
          dental: true,
          vision: true, // Changed from false to true
          pharmacy: true,
        },
      };
      
      return request(app.getHttpServer())
        .put(`/plans/${testPlanId}`)
        .send(updatedDetails)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testPlanId);
          expect(res.body).toHaveProperty('planNumber', 'TEST-PLAN-123-UPDATED');
          expect(res.body.coverageDetails).toHaveProperty('network', 'VIP');
          expect(res.body.coverageDetails).toHaveProperty('vision', true);
        });
    });
    
    it('should return 404 for updating non-existent plan', () => {
      return request(app.getHttpServer())
        .put('/plans/non-existent-id')
        .send({ planNumber: 'UPDATED' })
        .expect(HttpStatus.NOT_FOUND);
    });
    
    it('should return 403 for updating another user\'s plan', async () => {
      // Create another user and plan
      const anotherUser = await prismaService.user.create({
        data: {
          email: 'another-update@example.com',
          name: 'Another Update User',
        },
      });
      
      const anotherPlan = await prismaService.plan.create({
        data: {
          userId: anotherUser.id,
          planNumber: 'ANOTHER-PLAN-789',
          type: 'HEALTH',
          validityStart: new Date('2023-01-01'),
          validityEnd: new Date('2023-12-31'),
          coverageDetails: {},
        },
      });
      
      // Try to update another user's plan
      await request(app.getHttpServer())
        .put(`/plans/${anotherPlan.id}`)
        .send({ planNumber: 'HACKED' })
        .expect(HttpStatus.FORBIDDEN);
      
      // Clean up
      await prismaService.plan.delete({
        where: { id: anotherPlan.id },
      });
      
      await prismaService.user.delete({
        where: { id: anotherUser.id },
      });
    });
  });
  
  describe('DELETE /plans/:id', () => {
    it('should delete an existing plan', async () => {
      // Create a plan to delete
      const planToDelete = await prismaService.plan.create({
        data: {
          userId: testUserId,
          planNumber: 'DELETE-ME-PLAN',
          type: 'VISION',
          validityStart: new Date('2023-01-01'),
          validityEnd: new Date('2023-12-31'),
          coverageDetails: {},
        },
      });
      
      await request(app.getHttpServer())
        .delete(`/plans/${planToDelete.id}`)
        .expect(HttpStatus.OK);
      
      // Verify deletion
      const deletedPlan = await prismaService.plan.findUnique({
        where: { id: planToDelete.id },
      });
      
      expect(deletedPlan).toBeNull();
    });
    
    it('should return 404 for deleting non-existent plan', () => {
      return request(app.getHttpServer())
        .delete('/plans/non-existent-id')
        .expect(HttpStatus.NOT_FOUND);
    });
    
    it('should return 403 for deleting another user\'s plan', async () => {
      // Create another user and plan
      const anotherUser = await prismaService.user.create({
        data: {
          email: 'another-delete@example.com',
          name: 'Another Delete User',
        },
      });
      
      const anotherPlan = await prismaService.plan.create({
        data: {
          userId: anotherUser.id,
          planNumber: 'ANOTHER-PLAN-999',
          type: 'HEALTH',
          validityStart: new Date('2023-01-01'),
          validityEnd: new Date('2023-12-31'),
          coverageDetails: {},
        },
      });
      
      // Try to delete another user's plan
      await request(app.getHttpServer())
        .delete(`/plans/${anotherPlan.id}`)
        .expect(HttpStatus.FORBIDDEN);
      
      // Clean up
      await prismaService.plan.delete({
        where: { id: anotherPlan.id },
      });
      
      await prismaService.user.delete({
        where: { id: anotherUser.id },
      });
    });
  });
  
  describe('GET /plans/:id/coverage', () => {
    it('should return coverage details for a specific plan', () => {
      return request(app.getHttpServer())
        .get(`/plans/${testPlanId}/coverage`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('network', 'VIP'); // Updated value from previous test
          expect(res.body).toHaveProperty('hospital', true);
          expect(res.body).toHaveProperty('dental', true);
          expect(res.body).toHaveProperty('vision', true);
          expect(res.body).toHaveProperty('pharmacy', true);
        });
    });
    
    it('should return 404 for non-existent plan coverage', () => {
      return request(app.getHttpServer())
        .get('/plans/non-existent-id/coverage')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  
  describe('GET /plans/:id/benefits', () => {
    it('should return benefits for a specific plan', async () => {
      // First, create benefits for the test plan
      await prismaService.benefit.createMany({
        data: [
          {
            planId: testPlanId,
            type: 'WELLNESS',
            description: 'Annual wellness check-up',
            limitations: 'Once per year',
            usage: 0,
          },
          {
            planId: testPlanId,
            type: 'GYM',
            description: 'Gym membership discount',
            limitations: 'Up to $50 per month',
            usage: 2,
          },
        ],
      });
      
      return request(app.getHttpServer())
        .get(`/plans/${testPlanId}/benefits`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toHaveProperty('type');
          expect(res.body[0]).toHaveProperty('description');
          expect(res.body[0]).toHaveProperty('limitations');
          expect(res.body[0]).toHaveProperty('usage');
          
          // Clean up the created benefits
          return prismaService.benefit.deleteMany({
            where: { planId: testPlanId },
          });
        });
    });
    
    it('should return empty array for plan with no benefits', async () => {
      // Create a plan with no benefits
      const emptyPlan = await prismaService.plan.create({
        data: {
          userId: testUserId,
          planNumber: 'NO-BENEFITS-PLAN',
          type: 'BASIC',
          validityStart: new Date('2023-01-01'),
          validityEnd: new Date('2023-12-31'),
          coverageDetails: {},
        },
      });
      
      await request(app.getHttpServer())
        .get(`/plans/${emptyPlan.id}/benefits`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(0);
        });
      
      // Clean up
      await prismaService.plan.delete({
        where: { id: emptyPlan.id },
      });
    });
    
    it('should return 404 for non-existent plan benefits', () => {
      return request(app.getHttpServer())
        .get('/plans/non-existent-id/benefits')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  
  describe('POST /plans/:id/benefits', () => {
    it('should add a new benefit to a plan', () => {
      const newBenefit = {
        type: 'NUTRITION',
        description: 'Nutritionist consultation',
        limitations: '4 sessions per year',
      };
      
      return request(app.getHttpServer())
        .post(`/plans/${testPlanId}/benefits`)
        .send(newBenefit)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('planId', testPlanId);
          expect(res.body).toHaveProperty('type', 'NUTRITION');
          expect(res.body).toHaveProperty('description', 'Nutritionist consultation');
          expect(res.body).toHaveProperty('limitations', '4 sessions per year');
          expect(res.body).toHaveProperty('usage', 0);
          
          // Clean up the created benefit
          return prismaService.benefit.delete({
            where: { id: res.body.id },
          });
        });
    });
    
    it('should return 404 for adding benefit to non-existent plan', () => {
      const newBenefit = {
        type: 'NUTRITION',
        description: 'Nutritionist consultation',
        limitations: '4 sessions per year',
      };
      
      return request(app.getHttpServer())
        .post('/plans/non-existent-id/benefits')
        .send(newBenefit)
        .expect(HttpStatus.NOT_FOUND);
    });
    
    it('should return 403 for adding benefit to another user\'s plan', async () => {
      // Create another user and plan
      const anotherUser = await prismaService.user.create({
        data: {
          email: 'another-benefit@example.com',
          name: 'Another Benefit User',
        },
      });
      
      const anotherPlan = await prismaService.plan.create({
        data: {
          userId: anotherUser.id,
          planNumber: 'ANOTHER-PLAN-BENEFIT',
          type: 'HEALTH',
          validityStart: new Date('2023-01-01'),
          validityEnd: new Date('2023-12-31'),
          coverageDetails: {},
        },
      });
      
      const newBenefit = {
        type: 'NUTRITION',
        description: 'Nutritionist consultation',
        limitations: '4 sessions per year',
      };
      
      // Try to add benefit to another user's plan
      await request(app.getHttpServer())
        .post(`/plans/${anotherPlan.id}/benefits`)
        .send(newBenefit)
        .expect(HttpStatus.FORBIDDEN);
      
      // Clean up
      await prismaService.plan.delete({
        where: { id: anotherPlan.id },
      });
      
      await prismaService.user.delete({
        where: { id: anotherUser.id },
      });
    });
  });
});