import { HttpStatus, INestApplication } from '@nestjs/common'; // v10.0.0+
import { Test } from '@nestjs/testing'; // v10.0.0+
import { describe, it, beforeEach, afterEach, expect } from '@jest/globals'; // v29.0.0+
import * as request from 'supertest'; // 6.3.3
import { EventsModule } from 'src/backend/gamification-engine/src/events/events.module';
import { EventsService } from 'src/backend/gamification-engine/src/events/events.service';
import { AchievementsModule } from 'src/backend/gamification-engine/src/achievements/achievements.module';
import { AchievementsService } from 'src/backend/gamification-engine/src/achievements/achievements.service';
import { ProfilesModule } from 'src/backend/gamification-engine/src/profiles/profiles.module';
import { ProfilesService } from 'src/backend/gamification-engine/src/profiles/profiles.service';
import gamificationEngine from 'src/backend/gamification-engine/src/config/configuration';
import { KafkaService } from 'src/backend/shared/src/kafka/kafka.service';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { AUTH_INVALID_CREDENTIALS } from 'src/backend/shared/src/constants/error-codes.constants';
import { RulesService } from 'src/backend/gamification-engine/src/rules/rules.service';
import { QuestsService } from 'src/backend/gamification-engine/src/quests/quests.service';
import { RewardsService } from 'src/backend/gamification-engine/src/rewards/rewards.service';

/**
 * End-to-end tests for the Events module.
 * These tests verify the event processing flow by sending events to the API and checking that the user's game profile is updated correctly.
 */
describe('EventsModule (e2e)', () => {
  let app: INestApplication;
  let eventsService: EventsService;
  let achievementsService: AchievementsService;
  let profilesService: ProfilesService;
  let kafkaService: KafkaService;
  let prismaService: PrismaService;
  let rulesService: RulesService;
  let questsService: QuestsService;
  let rewardsService: RewardsService;

  beforeEach(async () => {
    // Create a testing module with all necessary dependencies
    const moduleFixture = await Test.createTestingModule({
      imports: [EventsModule, AchievementsModule, ProfilesModule],
    })
    .overrideProvider(KafkaService)
    .useValue({
      produce: jest.fn(),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get instances of the services for assertions
    eventsService = moduleFixture.get<EventsService>(EventsService);
    achievementsService = moduleFixture.get<AchievementsService>(AchievementsService);
    profilesService = moduleFixture.get<ProfilesService>(ProfilesService);
    kafkaService = moduleFixture.get<KafkaService>(KafkaService);
    prismaService = new PrismaService();
    rulesService = new RulesService(null, achievementsService, profilesService, questsService, rewardsService, null, kafkaService);
  });

  afterEach(async () => {
    // Clean up resources after each test
    if (app) {
      await app.close();
    }
  });

  it('/events (POST) - should process a valid event and update the user profile', async () => {
    const userId = 'test-user-123';
    const eventData = {
      type: 'STEPS_RECORDED',
      userId: userId,
      data: { steps: 1000 },
      journey: 'health',
    };

    // Mock the profilesService to return a game profile
    jest.spyOn(profilesService, 'findById').mockImplementation(async () => ({
      id: 'profile-id',
      userId: userId,
      level: 1,
      xp: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      achievements: [],
      quests: [],
    }));

    // Mock the rulesService to return a rule
    jest.spyOn(rulesService, 'findAll').mockImplementation(async () => [
      {
        id: 'rule-1',
        event: 'STEPS_RECORDED',
        condition: 'event.data.steps >= 1000',
        actions: '[{"type": "AWARD_XP", "value": 50}]',
      },
    ]);

    // Mock the rulesService to evaluate the rule
    jest.spyOn(rulesService, 'evaluateRule').mockReturnValue(true);

    // Mock the profilesService to update the profile
    jest.spyOn(profilesService, 'update').mockImplementation(async () => ({
      id: 'profile-id',
      userId: userId,
      level: 1,
      xp: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      achievements: [],
      quests: [],
    }));

    // Mock the kafkaService to produce a message
    jest.spyOn(kafkaService, 'produce').mockImplementation(async () => {
      return;
    });

    // Send the event to the API
    const response = await request(app.getHttpServer())
      .post('/events')
      .send(eventData)
      .set('Authorization', `Bearer valid-token`);

    // Assert the response status code
    expect(response.status).toBe(HttpStatus.OK);

    // Assert the response body
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        points: 50,
        profile: expect.objectContaining({
          userId: userId,
          xp: 50,
        }),
      }),
    );
  });

  it('/events (POST) - should return 401 if no token is provided', async () => {
    const eventData = {
      type: 'STEPS_RECORDED',
      userId: 'test-user-123',
      data: { steps: 1000 },
      journey: 'health',
    };

    // Send the event to the API without a token
    const response = await request(app.getHttpServer())
      .post('/events')
      .send(eventData);

    // Assert the response status code
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});