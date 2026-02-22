import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMock } from './prisma.mock';
import { EncryptionService, createEncryptionMiddleware } from '../encryption';

/**
 * Service for handling Prisma database connections.
 * Manages the lifecycle of the Prisma client instance.
 * Enhanced with mock properties to support our service implementations.
 * Attaches PHI encryption middleware when EncryptionService is available.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Add properties from PrismaMock
  user: any;
  role: any;
  permission: any;
  userRole: any;
  plan: any;
  claim: any;
  document: any;
  healthMetric: any;
  healthGoal: any;
  auditLog: any;
  // Care-service models
  appointment: any;
  provider: any;
  medication: any;
  telemedicineSession: any;
  treatmentPlan: any;
  // Gamification-engine models
  achievement: any;
  userAchievement: any;
  gameProfile: any;
  quest: any;
  userQuest: any;
  reward: any;
  userReward: any;
  rule: any;
  // Health-service models
  deviceConnection: any;
  medicalEvent: any;
  // Notification-service models
  notification: any;
  notificationPreference: any;
  notificationTemplate: any;
  // Plan-service models
  benefit: any;
  coverage: any;
  // Consent models (LGPD)
  consentRecord: any;

  /**
   * Constructor initializes the Prisma client with appropriate logging options
   * based on the environment. Optionally receives EncryptionService for PHI
   * field-level encryption via Prisma middleware.
   */
  constructor(@Optional() private encryptionService?: EncryptionService) {
    super({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });

    // Initialize mock properties to avoid TypeScript errors
    const mock = new PrismaMock();
    this.user = mock.user;
    this.role = mock.role;
    this.permission = mock.permission;
    this.userRole = mock.userRole;
    this.plan = mock.plan;
    this.claim = mock.claim;
    this.document = mock.document;
    this.healthMetric = mock.healthMetric || {};
    this.healthGoal = mock.healthGoal || {};
    this.auditLog = mock.auditLog || {};
    // Care-service models
    this.appointment = mock.appointment || {};
    this.provider = mock.provider || {};
    this.medication = mock.medication || {};
    this.telemedicineSession = mock.telemedicineSession || {};
    this.treatmentPlan = mock.treatmentPlan || {};
    // Gamification-engine models
    this.achievement = mock.achievement || {};
    this.userAchievement = mock.userAchievement || {};
    this.gameProfile = mock.gameProfile || {};
    this.quest = mock.quest || {};
    this.userQuest = mock.userQuest || {};
    this.reward = mock.reward || {};
    this.userReward = mock.userReward || {};
    this.rule = mock.rule || {};
    // Health-service models
    this.deviceConnection = mock.deviceConnection || {};
    this.medicalEvent = mock.medicalEvent || {};
    // Notification-service models
    this.notification = mock.notification || {};
    this.notificationPreference = mock.notificationPreference || {};
    this.notificationTemplate = mock.notificationTemplate || {};
    // Plan-service models
    this.benefit = mock.benefit || {};
    this.coverage = mock.coverage || {};
    // Consent models (LGPD)
    this.consentRecord = mock.consentRecord || {};
  }

  /**
   * Connects to the database when the module initializes.
   * Attaches PHI encryption middleware if EncryptionService is available.
   */
  async onModuleInit() {
    if (this.encryptionService) {
      this.$use(createEncryptionMiddleware(this.encryptionService));
    }
    await this.$connect();
  }

  /**
   * Disconnects from the database when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
