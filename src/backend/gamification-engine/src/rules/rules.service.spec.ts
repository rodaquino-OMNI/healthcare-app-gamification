/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RulesService, GamificationEvent } from './rules.service';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { ProfilesService } from '../profiles/profiles.service';
import { AchievementsService } from '../achievements/achievements.service';
import { GameProfile } from '../profiles/entities/game-profile.entity';

describe('RulesService', () => {
    let service: RulesService;
    let profilesService: ProfilesService;
    let achievementsService: AchievementsService;

    const mockGameProfile: GameProfile = {
        id: 'profile-1',
        userId: 'user-1',
        level: 2,
        xp: 150,
        achievements: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    const mockPrismaService = {
        rule: {
            findMany: jest.fn(),
        },
    };

    const mockLoggerService = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };

    const mockProfilesService = {
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };

    const mockAchievementsService = {
        unlockAchievement: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: any) => defaultValue ?? 60000),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RulesService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ProfilesService, useValue: mockProfilesService },
                { provide: AchievementsService, useValue: mockAchievementsService },
            ],
        }).compile();

        service = module.get<RulesService>(RulesService);

        // Manually trigger onModuleInit to load the built-in rules
        await service.onModuleInit();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ----------------------------------------------------------------
    // onModuleInit
    // ----------------------------------------------------------------
    describe('onModuleInit', () => {
        it('should load rules on initialization', async () => {
            // Verified by checking getAll() returns populated rules
            const rules = await service.getAll();
            expect(rules.length).toBeGreaterThan(0);
        });

        it('should log initialization success', async () => {
            expect(mockLoggerService.log).toHaveBeenCalledWith(expect.stringContaining('initialized'), 'RulesService');
        });
    });

    // ----------------------------------------------------------------
    // getAll
    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('should return the loaded rules array', async () => {
            const rules = await service.getAll();
            expect(Array.isArray(rules)).toBe(true);
        });

        it('should include enabled rules', async () => {
            const rules = await service.getAll();
            const enabledRules = rules.filter((r) => r.enabled);
            expect(enabledRules.length).toBeGreaterThan(0);
        });
    });

    // ----------------------------------------------------------------
    // processEvent — no applicable rules
    // ----------------------------------------------------------------
    describe('processEvent', () => {
        it('should log when no applicable rules are found for event type', async () => {
            const event: GamificationEvent = {
                type: 'UNKNOWN_EVENT_TYPE',
                userId: 'user-1',
                timestamp: new Date(),
                journey: 'health',
                data: {},
                metadata: {},
            };

            await service.processEvent(event);

            expect(mockLoggerService.log).toHaveBeenCalledWith(
                expect.stringContaining('No applicable rules'),
                'RulesService'
            );
        });

        it('should evaluate applicable rule when event matches', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);
            mockProfilesService.update.mockResolvedValue({ ...mockGameProfile, xp: 200 });
            mockAchievementsService.unlockAchievement.mockResolvedValue(undefined);

            const event: GamificationEvent = {
                type: 'STEPS_RECORDED',
                userId: 'user-1',
                timestamp: new Date(),
                journey: 'health',
                data: { steps: 12000 },
                metadata: {},
            };

            await service.processEvent(event);

            // ProfilesService should have been consulted to get user context
            expect(mockProfilesService.findById).toHaveBeenCalledWith('user-1');
        });

        it('should create profile when not found during event processing', async () => {
            const notFoundError: any = new Error('Not found');
            notFoundError.name = 'NotFoundException';

            mockProfilesService.findById.mockRejectedValue(notFoundError);
            mockProfilesService.create.mockResolvedValue(mockGameProfile);
            mockProfilesService.update.mockResolvedValue({ ...mockGameProfile, xp: 200 });
            mockAchievementsService.unlockAchievement.mockResolvedValue(undefined);

            const event: GamificationEvent = {
                type: 'STEPS_RECORDED',
                userId: 'user-1',
                timestamp: new Date(),
                journey: 'health',
                data: { steps: 12000 },
                metadata: {},
            };

            await service.processEvent(event);

            expect(mockProfilesService.create).toHaveBeenCalledWith('user-1');
        });

        it('should not throw when rule condition is not met', async () => {
            mockProfilesService.findById.mockResolvedValue(mockGameProfile);

            const event: GamificationEvent = {
                type: 'STEPS_RECORDED',
                userId: 'user-1',
                timestamp: new Date(),
                journey: 'health',
                data: { steps: 500 }, // below 10,000 threshold
                metadata: {},
            };

            await expect(service.processEvent(event)).resolves.not.toThrow();
        });
    });

    // ----------------------------------------------------------------
    // processRule
    // ----------------------------------------------------------------
    describe('processRule', () => {
        it('should evaluate rule and return satisfied result when condition is met', async () => {
            const rules = await service.getAll();
            const stepsRule = rules.find((r) => r.eventType === 'STEPS_RECORDED');
            expect(stepsRule).toBeDefined();

            const event = { type: 'STEPS_RECORDED', data: { steps: 15000 }, journey: 'health' };
            const result = await service.processRule(stepsRule!.id, event, mockGameProfile);

            expect(result.satisfied).toBe(true);
        });

        it('should return satisfied=false when rule condition is not met', async () => {
            const rules = await service.getAll();
            const stepsRule = rules.find((r) => r.eventType === 'STEPS_RECORDED');
            expect(stepsRule).toBeDefined();

            const event = { type: 'STEPS_RECORDED', data: { steps: 100 }, journey: 'health' };
            const result = await service.processRule(stepsRule!.id, event, mockGameProfile);

            expect(result.satisfied).toBe(false);
        });

        it('should return satisfied=false for non-existent rule ID', async () => {
            const event = { type: 'STEPS_RECORDED', data: {}, journey: 'health' };
            const result = await service.processRule('nonexistent-rule-id', event, mockGameProfile);

            expect(result.satisfied).toBe(false);
        });

        it('should return metadata with ruleId and ruleName when satisfied', async () => {
            const rules = await service.getAll();
            const appointmentRule = rules.find((r) => r.eventType === 'APPOINTMENT_BOOKED');
            expect(appointmentRule).toBeDefined();

            const event = { type: 'APPOINTMENT_BOOKED', data: {}, journey: 'care' };
            const result = await service.processRule(appointmentRule!.id, event, mockGameProfile);

            expect(result.satisfied).toBe(true);
            expect(result.metadata).toMatchObject({
                ruleId: appointmentRule!.id,
                ruleName: appointmentRule!.name,
            });
        });
    });
});
