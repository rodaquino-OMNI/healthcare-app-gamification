import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import { GameProfile } from '../profiles/entities/game-profile.entity';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let profilesService: ProfilesService;
  let redisService: RedisService;
  let loggerService: LoggerService;

  const mockGameProfiles: GameProfile[] = [
    {
      id: '1',
      userId: 'user1',
      level: 5,
      xp: 450,
      achievements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user2',
      level: 3,
      xp: 275,
      achievements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'user3',
      level: 7,
      xp: 680,
      achievements: [{ id: '1', achievementId: '1', profileId: '3' } as any],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        {
          provide: ProfilesService,
          useValue: {
            getAllProfiles: jest.fn().mockResolvedValue(mockGameProfiles),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            getJourneyTTL: jest.fn().mockReturnValue(300),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key, defaultValue) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
    profilesService = module.get<ProfilesService>(ProfilesService);
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLeaderboard', () => {
    it('should return cached leaderboard if available', async () => {
      const cachedLeaderboard = [
        { rank: 1, userId: 'user3', level: 7, xp: 680, achievements: 1 },
        { rank: 2, userId: 'user1', level: 5, xp: 450, achievements: 0 },
        { rank: 3, userId: 'user2', level: 3, xp: 275, achievements: 0 },
      ];
      
      jest.spyOn(redisService, 'get').mockResolvedValue(JSON.stringify(cachedLeaderboard));
      
      const result = await service.getLeaderboard('health');
      
      expect(redisService.get).toHaveBeenCalledWith('leaderboard:health');
      expect(result).toEqual(cachedLeaderboard);
      expect(loggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('Retrieved leaderboard from cache'),
        'LeaderboardService'
      );
    });

    it('should calculate and cache leaderboard if not in cache', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      
      const expectedLeaderboard = [
        { rank: 1, userId: 'user3', level: 7, xp: 680, achievements: 1 },
        { rank: 2, userId: 'user1', level: 5, xp: 450, achievements: 0 },
        { rank: 3, userId: 'user2', level: 3, xp: 275, achievements: 0 },
      ];
      
      const result = await service.getLeaderboard('health');
      
      expect(profilesService.getAllProfiles).toHaveBeenCalled();
      expect(redisService.set).toHaveBeenCalledWith(
        'leaderboard:health',
        JSON.stringify(expectedLeaderboard),
        expect.any(Number)
      );
      expect(result).toEqual(expectedLeaderboard);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Test error');
      jest.spyOn(profilesService, 'getAllProfiles').mockRejectedValue(error);
      
      await expect(service.getLeaderboard('health')).rejects.toThrow(error);
      
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get leaderboard'),
        expect.any(String),
        'LeaderboardService'
      );
    });
  });

  describe('calculateLeaderboard', () => {
    it('should sort profiles by XP in descending order', async () => {
      // Access the private method using type assertion
      const calculateLeaderboard = (service as any).calculateLeaderboard.bind(service);
      
      const result = await calculateLeaderboard();
      
      expect(result).toEqual([
        mockGameProfiles[2], // user3 - 680 XP
        mockGameProfiles[0], // user1 - 450 XP
        mockGameProfiles[1], // user2 - 275 XP
      ]);
    });
  });
});