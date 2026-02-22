/* eslint-disable @typescript-eslint/no-explicit-any */
// filepath: /Users/rodrigo/Git Repositories/Super-APP gamification/healthcare-super-app--w-gamification--tgfzl7/src/backend/gamification-engine/src/database/database-error.handler.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logging/logger.service';

/**
 * DEAD CODE: This class is not imported anywhere in the codebase.
 * The TypeORM imports and createTypeOrmOptions method have been removed
 * as part of the TypeORM -> Prisma migration. The onApplicationBootstrap
 * hook remains for reference but this entire file can be safely deleted.
 *
 * Provider that handles database connection errors and provides graceful fallback behavior
 * to prevent the application from crashing during startup when database issues occur.
 */
@Injectable()
export class DatabaseErrorHandler implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {}

  /**
   * Lifecycle hook that runs when the application bootstraps.
   * Provides more detailed error handling for database connection issues.
   */
  async onApplicationBootstrap(): Promise<void> {
    try {
      // Check if database configuration is properly loaded
      const dbConfig = this.configService.get('database');
      if (!dbConfig) {
        this.logger.warn(
          'Database configuration not found. Please check your environment variables and configuration files.',
          'DatabaseErrorHandler'
        );
      } else {
        this.logger.log(
          `Database configuration validated. Connected to ${dbConfig.type} database ${
            dbConfig.url ? 'using connection URL' : `at ${dbConfig.host}:${dbConfig.port}`
          }`,
          'DatabaseErrorHandler'
        );
      }
    } catch (error) {
      this.logger.error(
        `Error validating database configuration: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
        error instanceof Error ? (error as any).stack : undefined,
        'DatabaseErrorHandler'
      );
    }
  }
}