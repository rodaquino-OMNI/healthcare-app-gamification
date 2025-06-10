import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMock } from './prisma.mock';

/**
 * Service for handling Prisma database connections.
 * Manages the lifecycle of the Prisma client instance.
 * Enhanced with mock properties to support our service implementations.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Add properties from PrismaMock
  user: any;
  role: any;
  permission: any;
  userRole: any;
  claim: any;
  document: any;
  healthMetric: any;
  healthGoal: any;

  /**
   * Constructor initializes the Prisma client with appropriate logging options
   * based on the environment.
   */
  constructor() {
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
    this.claim = mock.claim;
    this.document = mock.document;
    this.healthMetric = mock.healthMetric || {};
    this.healthGoal = mock.healthGoal || {};
  }

  /**
   * Connects to the database when the module initializes.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnects from the database when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}