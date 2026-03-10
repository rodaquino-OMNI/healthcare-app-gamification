/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { GameProfile } from './entities/game-profile.entity';

// Minimal stub for mapToDomainGameProfile — source uses it, mock must return shaped data
jest.mock('../utils/entity-mappers', () => ({
    mapToDomainGameProfile: jest.fn((raw: any) => raw as GameProfile),
}));

describe('ProfilesService', () => {
    let service: ProfilesService;
    let prismaService: PrismaService;

    const mockGameProfile: GameProfile = {
        id: 'profile-1',
        userId: 'user-1',
        level: 1,
        xp: 0,
        achievements: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockPrismaService = {
        gameProfile: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockLoggerService = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfilesService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        service = module.get<ProfilesService>(ProfilesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        it('should create and return a new game profile for a user', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);
            mockPrismaService.gameProfile.create.mockResolvedValue(mockGameProfile);

            const result = await service.create('user-1');

            expect(mockPrismaService.gameProfile.create).toHaveBeenCalledWith({
                data: { userId: 'user-1', level: 1, xp: 0 },
            });
            expect(result).toEqual(mockGameProfile);
        });

        it('should return existing profile without creating when profile already exists', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(mockGameProfile);

            const result = await service.create('user-1');

            expect(mockPrismaService.gameProfile.create).not.toHaveBeenCalled();
            expect(mockLoggerService.warn).toHaveBeenCalledWith(
                expect.stringContaining('already exists'),
                'ProfilesService'
            );
            expect(result).toEqual(mockGameProfile);
        });

        it('should re-throw error when prisma create fails', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);
            mockPrismaService.gameProfile.create.mockRejectedValue(new Error('DB error'));

            await expect(service.create('user-1')).rejects.toThrow('DB error');
            expect(mockLoggerService.error).toHaveBeenCalled();
        });
    });

    // ----------------------------------------------------------------
    // findById
    // ----------------------------------------------------------------
    describe('findById', () => {
        it('should return a game profile when found', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(mockGameProfile);

            const result = await service.findById('user-1');

            expect(mockPrismaService.gameProfile.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: 'user-1' } })
            );
            expect(result).toEqual(mockGameProfile);
        });

        it('should throw NotFoundException when profile is not found', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);

            await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
        });

        it('should re-throw non-NotFoundException errors from database', async () => {
            mockPrismaService.gameProfile.findUnique.mockRejectedValue(new Error('Connection lost'));

            await expect(service.findById('user-1')).rejects.toThrow('Connection lost');
        });

        it('should include achievements relation in the query', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(mockGameProfile);

            await service.findById('user-1');

            expect(mockPrismaService.gameProfile.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    include: expect.objectContaining({ achievements: expect.anything() }),
                })
            );
        });
    });

    // ----------------------------------------------------------------
    // update
    // ----------------------------------------------------------------
    describe('update', () => {
        it('should update and return the modified game profile', async () => {
            const updatedProfile = { ...mockGameProfile, xp: 150, level: 2 };
            mockPrismaService.gameProfile.findUnique.mockResolvedValueOnce(mockGameProfile); // findById call
            mockPrismaService.gameProfile.update.mockResolvedValue(updatedProfile);

            const result = await service.update('user-1', { xp: 150, level: 2 });

            expect(mockPrismaService.gameProfile.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { userId: 'user-1' },
                    data: { level: 2, xp: 150 },
                })
            );
            expect(result.xp).toBe(150);
        });

        it('should throw NotFoundException when profile does not exist', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);

            await expect(service.update('nonexistent', { xp: 100 })).rejects.toThrow(NotFoundException);
        });

        it('should only allow updating level and xp fields', async () => {
            const updatedProfile = { ...mockGameProfile, xp: 50 };
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(mockGameProfile);
            mockPrismaService.gameProfile.update.mockResolvedValue(updatedProfile);

            await service.update('user-1', { xp: 50, userId: 'other-user' } as any);

            expect(mockPrismaService.gameProfile.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.not.objectContaining({ userId: 'other-user' }),
                })
            );
        });

        it('should re-throw unexpected database errors', async () => {
            mockPrismaService.gameProfile.findUnique.mockResolvedValue(mockGameProfile);
            mockPrismaService.gameProfile.update.mockRejectedValue(new Error('Write failed'));

            await expect(service.update('user-1', { xp: 50 })).rejects.toThrow('Write failed');
        });
    });

    // ----------------------------------------------------------------
    // getAllProfiles
    // ----------------------------------------------------------------
    describe('getAllProfiles', () => {
        it('should return all game profiles', async () => {
            const profiles = [mockGameProfile, { ...mockGameProfile, id: 'profile-2', userId: 'user-2' }];
            mockPrismaService.gameProfile.findMany.mockResolvedValue(profiles);

            const result = await service.getAllProfiles();

            expect(mockPrismaService.gameProfile.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });

        it('should return an empty array when no profiles exist', async () => {
            mockPrismaService.gameProfile.findMany.mockResolvedValue([]);

            const result = await service.getAllProfiles();

            expect(result).toEqual([]);
        });

        it('should include achievements in the query', async () => {
            mockPrismaService.gameProfile.findMany.mockResolvedValue([mockGameProfile]);

            await service.getAllProfiles();

            expect(mockPrismaService.gameProfile.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    include: expect.objectContaining({ achievements: expect.anything() }),
                })
            );
        });

        it('should re-throw error when database query fails', async () => {
            mockPrismaService.gameProfile.findMany.mockRejectedValue(new Error('Query error'));

            await expect(service.getAllProfiles()).rejects.toThrow('Query error');
            expect(mockLoggerService.error).toHaveBeenCalled();
        });
    });
});
