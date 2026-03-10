import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

import { PlanResolvers } from './plan.resolvers';

describe('PlanResolvers', () => {
    let resolvers: PlanResolvers;
    let httpService: jest.Mocked<HttpService>;

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlanResolvers,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                        patch: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('http://plan-service:3004'),
                    },
                },
            ],
        }).compile();

        resolvers = module.get<PlanResolvers>(PlanResolvers);
        httpService = module.get(HttpService);
    });

    it('should be defined', () => {
        expect(resolvers).toBeDefined();
    });

    describe('getPlan', () => {
        it('should return a plan', async () => {
            const mockData = { id: 'plan-1', name: 'Gold' };
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getPlan(mockUser, 'plan-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getClaims', () => {
        it('should return claims for a plan', async () => {
            const mockData = [{ id: 'claim-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getClaims(mockUser, 'plan-1');

            expect(result).toEqual(mockData);
        });

        it('should filter by status', async () => {
            const mockData = [{ id: 'claim-1', status: 'pending' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getClaims(mockUser, 'plan-1', 'pending');

            expect(result).toEqual(mockData);
            expect(httpService.get).toHaveBeenCalledWith(
                expect.stringContaining('status=pending'),
            );
        });
    });

    describe('submitClaim', () => {
        it('should submit a claim', async () => {
            const mockData = { id: 'claim-new' };
            httpService.post.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.submitClaim(
                mockUser,
                'plan-1',
                'medical',
                'PROC-001',
                'Dr. Smith',
                '2024-01-01',
                150.00,
            );

            expect(result).toEqual(mockData);
            expect(httpService.post).toHaveBeenCalledWith(
                'http://plan-service:3004/claims',
                expect.objectContaining({
                    planId: 'plan-1',
                    userId: 'user-1',
                    amount: 150.00,
                }),
            );
        });
    });

    describe('updateClaim', () => {
        it('should update a claim', async () => {
            const mockData = { id: 'claim-1', updated: true };
            httpService.patch.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.updateClaim(mockUser, 'claim-1', { notes: 'updated' });

            expect(result).toEqual(mockData);
        });
    });

    describe('cancelClaim', () => {
        it('should cancel a claim', async () => {
            const mockData = { id: 'claim-1', status: 'CANCELLED' };
            httpService.patch.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.cancelClaim(mockUser, 'claim-1');

            expect(result).toEqual(mockData);
            expect(httpService.patch).toHaveBeenCalledWith(
                'http://plan-service:3004/claims/claim-1',
                expect.objectContaining({ status: 'CANCELLED' }),
            );
        });
    });
});
