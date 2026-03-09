/* eslint-disable */
import { describe, it, expect } from '@jest/globals';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const JwtAuthGuard = AuthGuard('jwt');
const RolesGuard = { canActivate: () => true };
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AchievementsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        // Create a testing module
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        })
            // Mock the guards to bypass authentication and authorization
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        // Initialize the application
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        // Close the application after all tests
        await app.close();
    });

    it('GET /achievements - Should return all achievements', () => {
        return request(app.getHttpServer())
            .get('/achievements')
            .expect(HttpStatus.OK)
            .expect((res: any) => {
                expect(Array.isArray(res.body)).toBe(true);
                // We expect there to be at least one achievement in the database
                expect(res.body.length).toBeGreaterThan(0);
            });
    });

    it('GET /achievements/:id - Should return a single achievement by ID', async () => {
        // First, get all achievements to find a valid ID
        const achievementsRes = await request(app.getHttpServer()).get('/achievements');

        // Skip the test if no achievements exist
        if (achievementsRes.body.length === 0) {
            console.warn('Skipping test: No achievements found in the database');
            return;
        }

        const firstAchievement = achievementsRes.body[0];

        return request(app.getHttpServer())
            .get(`/achievements/${firstAchievement.id}`)
            .expect(HttpStatus.OK)
            .expect((res: any) => {
                expect(typeof res.body).toBe('object');
                expect(res.body.id).toBe(firstAchievement.id);
            });
    });

    it('GET /achievements/:id - Should return 404 if achievement is not found', () => {
        // Using a non-existent achievement ID
        const nonExistentId = 'non-existent-id';

        return request(app.getHttpServer()).get(`/achievements/${nonExistentId}`).expect(HttpStatus.NOT_FOUND);
    });
});
