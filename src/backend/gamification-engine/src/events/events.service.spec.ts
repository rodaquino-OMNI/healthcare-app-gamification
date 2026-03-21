import { Test, TestingModule } from '@nestjs/testing';

import { ProcessEventDto } from './dto/process-event.dto';
import { EventsService } from './events.service';
import { KafkaService } from '../../../shared/src/kafka/kafka.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { AchievementsService } from '../achievements/achievements.service';
import { GameProfile } from '../profiles/entities/game-profile.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { QuestsService } from '../quests/quests.service';
import { RewardsService } from '../rewards/rewards.service';
import { RulesService } from '../rules/rules.service';

describe('EventsService', () => {
    let service: EventsService;
    let _profilesService: ProfilesService;
    let _rulesService: RulesService;

    const mockGameProfile: GameProfile = {
        id: 'profile-1',
        userId: 'user-1',
        level: 2,
        xp: 150,
        achievements: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockAchievementsService = {
        findAll: jest.fn(),
        unlockAchievement: jest.fn(),
    };

    const mockProfilesService = {
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };

    const mockRulesService = {
        processEvent: jest.fn(),
    };

    const mockKafkaService = {
        produce: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    };

    const mockRewardsService = {
        findAll: jest.fn(),
        grantReward: jest.fn(),
    };

    const mockQuestsService = {
        findAll: jest.fn(),
        startQuest: jest.fn(),
        completeQuest: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                { provide: AchievementsService, useValue: mockAchievementsService },
                { provide: ProfilesService, useValue: mockProfilesService },
                { provide: RulesService, useValue: mockRulesService },
                { provide: KafkaService, useValue: mockKafkaService },
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: RewardsService, useValue: mockRewardsService },
                { provide: QuestsService, useValue: mockQuestsService },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
        _profilesService = module.get<ProfilesService>(ProfilesService);
        _rulesService = module.get<RulesService>(RulesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // processEvent
    // ----------------------------------------------------------------
    describe('processEvent', () => {
        const validEventDto: ProcessEventDto = {
            type: 'STEPS_RECORDED',
            userId: 'user-1',
            journey: 'health',
            data: { steps: 12000 },
        };

        it('should process event successfully when profile exists', async () => {
            mockProfilesService.findById
                .mockResolvedValueOnce(mockGameProfile) // first call (find existing)
                .mockResolvedValueOnce(mockGameProfile); // second call (fetch updated)
            mockRulesService.processEvent.mockResolvedValue(undefined);

            const result = await service.processEvent(validEventDto);

            expect(mockProfilesService.findById).toHaveBeenCalledWith('user-1');
            expect(mockRulesService.processEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'STEPS_RECORDED',
                    userId: 'user-1',
                    journey: 'health',
                })
            );
            expect(result).toMatchObject({ success: true });
        });

        it('should create profile and continue when profile does not exist', async () => {
            mockProfilesService.findById
                .mockRejectedValueOnce(new Error('Not found')) // triggers profile creation
                .mockResolvedValueOnce(mockGameProfile); // fetch updated profile
            mockProfilesService.create.mockResolvedValue(mockGameProfile);
            mockRulesService.processEvent.mockResolvedValue(undefined);

            const result = await service.processEvent(validEventDto);

            expect(mockProfilesService.create).toHaveBeenCalledWith('user-1');
            expect(result.success).toBe(true);
        });

        it('should default journey to "all" when not provided', async () => {
            const eventWithoutJourney: ProcessEventDto = {
                type: 'GENERIC_EVENT',
                userId: 'user-1',
                data: {},
            };

            mockProfilesService.findById
                .mockResolvedValueOnce(mockGameProfile)
                .mockResolvedValueOnce(mockGameProfile);
            mockRulesService.processEvent.mockResolvedValue(undefined);

            await service.processEvent(eventWithoutJourney);

            expect(mockRulesService.processEvent).toHaveBeenCalledWith(
                expect.objectContaining({ journey: 'all' })
            );
        });

        it('should pass gamification event with a timestamp to rules service', async () => {
            mockProfilesService.findById
                .mockResolvedValueOnce(mockGameProfile)
                .mockResolvedValueOnce(mockGameProfile);
            mockRulesService.processEvent.mockResolvedValue(undefined);

            await service.processEvent(validEventDto);

            expect(mockRulesService.processEvent).toHaveBeenCalledWith(
                expect.objectContaining({ timestamp: expect.any(Date) })
            );
        });

        it('should return processed profile in response', async () => {
            const updatedProfile = { ...mockGameProfile, xp: 200 };
            mockProfilesService.findById
                .mockResolvedValueOnce(mockGameProfile)
                .mockResolvedValueOnce(updatedProfile);
            mockRulesService.processEvent.mockResolvedValue(undefined);

            const result = await service.processEvent(validEventDto);

            expect(result.profile).toEqual(updatedProfile);
        });

        it('should re-throw errors from rules processing', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockRulesService.processEvent.mockRejectedValue(new Error('Rules engine failure'));

            await expect(service.processEvent(validEventDto)).rejects.toThrow(
                'Rules engine failure'
            );
            expect(mockLoggerService.error).toHaveBeenCalled();
        });
    });
});
