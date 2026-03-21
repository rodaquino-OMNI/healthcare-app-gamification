/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { PrismaService } from '@app/shared/database/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
    let service: PreferencesService;

    const mockPrismaService = {
        notificationPreference: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockPreference = {
        id: 1,
        userId: 'user-1',
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        inAppEnabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PreferencesService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<PreferencesService>(PreferencesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // findAll
    // -------------------------------------------------------------------------
    describe('findAll', () => {
        it('should return all notification preferences', async () => {
            mockPrismaService.notificationPreference.findMany.mockResolvedValue([mockPreference]);

            const result = await service.findAll();

            expect(mockPrismaService.notificationPreference.findMany).toHaveBeenCalled();
            expect(result).toEqual([mockPreference]);
        });

        it('should apply where filter from FilterDto', async () => {
            mockPrismaService.notificationPreference.findMany.mockResolvedValue([mockPreference]);
            const filter = { where: { userId: 'user-1' } } as any;

            await service.findAll(filter);

            expect(mockPrismaService.notificationPreference.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: 'user-1' } })
            );
        });

        it('should return an empty array when no preferences exist', async () => {
            mockPrismaService.notificationPreference.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });

        it('should handle undefined filter gracefully', async () => {
            mockPrismaService.notificationPreference.findMany.mockResolvedValue([mockPreference]);

            const result = await service.findAll(undefined);

            expect(result).toEqual([mockPreference]);
        });
    });

    // -------------------------------------------------------------------------
    // findOne
    // -------------------------------------------------------------------------
    describe('findOne', () => {
        it('should return a preference matching the where clause', async () => {
            mockPrismaService.notificationPreference.findFirst.mockResolvedValue(mockPreference);

            const result = await service.findOne({ userId: 'user-1' });

            expect(mockPrismaService.notificationPreference.findFirst).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
            });
            expect(result).toEqual(mockPreference);
        });

        it('should return null when no preference is found', async () => {
            mockPrismaService.notificationPreference.findFirst.mockResolvedValue(null);

            const result = await service.findOne({ userId: 'nonexistent-user' });

            expect(result).toBeNull();
        });

        it('should accept any where clause shape', async () => {
            mockPrismaService.notificationPreference.findFirst.mockResolvedValue(mockPreference);

            await service.findOne({ userId: 'user-1', pushEnabled: true });

            expect(mockPrismaService.notificationPreference.findFirst).toHaveBeenCalledWith({
                where: { userId: 'user-1', pushEnabled: true },
            });
        });
    });

    // -------------------------------------------------------------------------
    // create
    // -------------------------------------------------------------------------
    describe('create', () => {
        it('should create and return a notification preference for a user', async () => {
            mockPrismaService.notificationPreference.create.mockResolvedValue(mockPreference);

            const result = await service.create('user-1');

            expect(mockPrismaService.notificationPreference.create).toHaveBeenCalledWith({
                data: { userId: 'user-1' },
            });
            expect(result).toEqual(mockPreference);
        });

        it('should propagate errors if prisma create fails', async () => {
            mockPrismaService.notificationPreference.create.mockRejectedValue(
                new Error('Unique constraint failed')
            );

            await expect(service.create('user-1')).rejects.toThrow();
        });

        it('should use the provided userId as-is in the created record', async () => {
            const specificUserId = 'test-id-abc';
            mockPrismaService.notificationPreference.create.mockResolvedValue({
                ...mockPreference,
                userId: specificUserId,
            });

            const result = await service.create(specificUserId);

            expect(result.userId).toBe(specificUserId);
        });
    });

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------
    describe('update', () => {
        it('should update and return the modified preference', async () => {
            const updatedPref = { ...mockPreference, pushEnabled: false };
            mockPrismaService.notificationPreference.update.mockResolvedValue(updatedPref);

            const result = await service.update('1', { pushEnabled: false });

            expect(mockPrismaService.notificationPreference.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { pushEnabled: false },
            });
            expect(result.pushEnabled).toBe(false);
        });

        it('should parse string ID to integer for the update query', async () => {
            mockPrismaService.notificationPreference.update.mockResolvedValue(mockPreference);

            await service.update('42', { emailEnabled: true });

            expect(mockPrismaService.notificationPreference.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 42 } })
            );
        });

        it('should propagate errors when update fails', async () => {
            mockPrismaService.notificationPreference.update.mockRejectedValue(
                new Error('Record not found')
            );

            await expect(service.update('999', { smsEnabled: true })).rejects.toThrow();
        });
    });
});
