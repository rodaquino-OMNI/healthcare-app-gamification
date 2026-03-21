import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

const mockClaimsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

const mockTracingService = {
    createSpan: jest.fn().mockImplementation((_name, fn) => fn()),
};

describe('ClaimsController', () => {
    let controller: ClaimsController;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClaimsController],
            providers: [
                { provide: ClaimsService, useValue: mockClaimsService },
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: TracingService, useValue: mockTracingService },
            ],
        }).compile();

        controller = module.get<ClaimsController>(ClaimsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create (POST /claims)', () => {
        it('should create and return a new claim', async () => {
            const userId = 'test-user-id';
            const createClaimDto = {
                planId: 'test-plan-id',
                type: 'medical_visit',
                amount: 150.5,
                userId,
            } as any;
            const createdClaim = {
                id: 'test-claim-id',
                userId,
                ...createClaimDto,
                status: 'submitted',
            };

            mockClaimsService.create.mockResolvedValue(createdClaim);

            const result = await controller.create(userId, createClaimDto);

            expect(result).toEqual(createdClaim);
            expect(mockClaimsService.create).toHaveBeenCalledWith(userId, createClaimDto);
        });

        it('should propagate service errors during claim creation', async () => {
            mockClaimsService.create.mockRejectedValue(new Error('Plan access denied'));

            await expect(
                controller.create('user-id', {
                    planId: 'plan-id',
                    type: 'visit',
                    amount: 100,
                } as any)
            ).rejects.toThrow('Plan access denied');
        });
    });

    describe('findAll (GET /claims)', () => {
        it('should return all claims for a user', async () => {
            const userId = 'test-user-id';
            const claimsResult = {
                data: [
                    { id: 'claim-1', userId, status: 'submitted' },
                    { id: 'claim-2', userId, status: 'approved' },
                ],
                total: 2,
                page: 1,
                limit: 10,
            };

            mockClaimsService.findAll.mockResolvedValue(claimsResult);

            const result = await controller.findAll(userId, {} as any, {} as any);

            expect(result).toEqual(claimsResult);
            expect(mockClaimsService.findAll).toHaveBeenCalledWith(userId, {}, {});
        });

        it('should pass filter and pagination to the service', async () => {
            const userId = 'test-user-id';
            const filter = { where: { status: 'submitted' } };
            const pagination = { page: 1, limit: 5 };

            mockClaimsService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, limit: 5 });

            await controller.findAll(userId, filter as any, pagination as any);

            expect(mockClaimsService.findAll).toHaveBeenCalledWith(userId, filter, pagination);
        });

        it('should propagate service errors', async () => {
            mockClaimsService.findAll.mockRejectedValue(new Error('Query error'));

            await expect(controller.findAll('user-id', {} as any, {} as any)).rejects.toThrow(
                'Query error'
            );
        });
    });

    describe('findOne (GET /claims/:id)', () => {
        it('should return the claim if it belongs to the user', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId, status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);

            const result = await controller.findOne(userId, 'test-claim-id');

            expect(result).toEqual(claim);
        });

        it('should throw NotFoundException when claim does not exist', async () => {
            mockClaimsService.findOne.mockResolvedValue(null);

            await expect(controller.findOne('user-id', 'non-existent-id')).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw ForbiddenException when claim belongs to another user', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId: 'other-user-id', status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);

            await expect(controller.findOne(userId, 'test-claim-id')).rejects.toBeInstanceOf(
                ForbiddenException
            );
        });

        it('should propagate service errors', async () => {
            mockClaimsService.findOne.mockRejectedValue(new Error('DB error'));

            await expect(controller.findOne('user-id', 'claim-id')).rejects.toThrow('DB error');
        });
    });

    describe('update (PUT /claims/:id)', () => {
        it('should update the claim if it belongs to the user', async () => {
            const userId = 'test-user-id';
            const existingClaim = { id: 'test-claim-id', userId, status: 'submitted' };
            const updateDto = { notes: 'Updated notes' } as any;
            const updatedClaim = { ...existingClaim, notes: 'Updated notes' };

            mockClaimsService.findOne.mockResolvedValue(existingClaim);
            mockClaimsService.update.mockResolvedValue(updatedClaim);

            const result = await controller.update(userId, 'test-claim-id', updateDto);

            expect(result).toEqual(updatedClaim);
            expect(mockClaimsService.update).toHaveBeenCalledWith('test-claim-id', updateDto);
        });

        it('should throw NotFoundException when claim does not exist for update', async () => {
            mockClaimsService.findOne.mockResolvedValue(null);

            await expect(
                controller.update('user-id', 'non-existent-id', {} as any)
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw ForbiddenException when updating another user claim', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId: 'other-user-id', status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);

            await expect(
                controller.update(userId, 'test-claim-id', {} as any)
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('should propagate service errors during update', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId, status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);
            mockClaimsService.update.mockRejectedValue(new Error('Update error'));

            await expect(controller.update(userId, 'test-claim-id', {} as any)).rejects.toThrow(
                'Update error'
            );
        });
    });

    describe('remove (DELETE /claims/:id)', () => {
        it('should delete the claim if it belongs to the user', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId, status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);
            mockClaimsService.remove.mockResolvedValue(true);

            await expect(controller.remove(userId, 'test-claim-id')).resolves.not.toThrow();
            expect(mockClaimsService.remove).toHaveBeenCalledWith('test-claim-id');
        });

        it('should throw NotFoundException when claim does not exist for removal', async () => {
            mockClaimsService.findOne.mockResolvedValue(null);

            await expect(controller.remove('user-id', 'non-existent-id')).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw ForbiddenException when removing another user claim', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId: 'other-user-id', status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);

            await expect(controller.remove(userId, 'test-claim-id')).rejects.toBeInstanceOf(
                ForbiddenException
            );
        });

        it('should propagate service errors during removal', async () => {
            const userId = 'test-user-id';
            const claim = { id: 'test-claim-id', userId, status: 'submitted' };

            mockClaimsService.findOne.mockResolvedValue(claim);
            mockClaimsService.remove.mockRejectedValue(new Error('Delete error'));

            await expect(controller.remove(userId, 'test-claim-id')).rejects.toThrow(
                'Delete error'
            );
        });
    });
});
