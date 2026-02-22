/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { GameProfile } from './entities/game-profile.entity';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profilesService: ProfilesService;

  const mockGameProfile: GameProfile = {
    id: 'profile-1',
    userId: 'user-1',
    level: 3,
    xp: 250,
    achievements: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockProfilesService = {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        { provide: ProfilesService, useValue: mockProfilesService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------------------------------------------
  // getProfile
  // ----------------------------------------------------------------
  describe('getProfile', () => {
    it('should return the game profile for a given userId', async () => {
      mockProfilesService.findById.mockResolvedValue(mockGameProfile);

      const result = await controller.getProfile('user-1');

      expect(mockProfilesService.findById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockGameProfile);
    });

    it('should propagate NotFoundException when profile does not exist', async () => {
      mockProfilesService.findById.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.getProfile('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should propagate unexpected errors from the service', async () => {
      mockProfilesService.findById.mockRejectedValue(new Error('DB failure'));

      await expect(controller.getProfile('user-1')).rejects.toThrow('DB failure');
    });
  });

  // ----------------------------------------------------------------
  // createProfile
  // ----------------------------------------------------------------
  describe('createProfile', () => {
    it('should create and return a new game profile', async () => {
      mockProfilesService.create.mockResolvedValue(mockGameProfile);

      const result = await controller.createProfile({ userId: 'user-1' });

      expect(mockProfilesService.create).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockGameProfile);
    });

    it('should propagate errors from the service', async () => {
      mockProfilesService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createProfile({ userId: 'user-1' })).rejects.toThrow('Creation failed');
    });
  });

  // ----------------------------------------------------------------
  // updateProfile
  // ----------------------------------------------------------------
  describe('updateProfile', () => {
    it('should update and return the modified game profile', async () => {
      const updatedProfile = { ...mockGameProfile, xp: 300, level: 4 };
      mockProfilesService.update.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile('user-1', { xp: 300, level: 4 });

      expect(mockProfilesService.update).toHaveBeenCalledWith('user-1', { xp: 300, level: 4 });
      expect(result.xp).toBe(300);
    });

    it('should propagate NotFoundException when profile not found', async () => {
      mockProfilesService.update.mockRejectedValue(new NotFoundException('Not found'));

      await expect(
        controller.updateProfile('nonexistent', { xp: 100 })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
