/* eslint-disable @typescript-eslint/no-explicit-any */
// filepath: /Users/rodrigo/Git Repositories/Super-APP gamification/healthcare-super-app--w-gamification--tgfzl7/src/backend/gamification-engine/src/database/database-error.handler.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logging/logger.service';

/**
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
  
  /**
   * Creates TypeORM options with better error handling
   * @returns TypeORM connection options
   */
  static createTypeOrmOptions(configService: ConfigService): TypeOrmModuleOptions {
    try {
      // First check for database URL which takes precedence
      const dbUrl = configService.get<string>('database.url');
      
      const baseOptions = {
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('database.synchronize', false),
        logging: configService.get<boolean>('database.logging', false),
        entities: configService.get<string[]>('database.entities'),
        migrations: configService.get<string[]>('database.migrations'),
        migrationsRun: configService.get<boolean>('database.migrationsRun', false),
        // Add connection pool settings for better performance and error handling
        pool: {
          max: configService.get<number>('database.maxConnections', 20),
          min: 1,
          idle: configService.get<number>('database.idleTimeoutMillis', 30000),
        },
        // Add retry options to handle transient connection errors
        retryAttempts: configService.get<number>('database.retryAttempts', 5),
        retryDelay: configService.get<number>('database.retryDelay', 1000),
      };
      
      if (dbUrl) {
        return {
          type: 'postgres' as const,
          url: dbUrl,
          ssl: configService.get<boolean>('database.ssl', false),
          ...baseOptions,
        };
      }
      
      return {
        type: configService.get<string>('database.type', 'postgres') as any,
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.username', 'postgres'),
        password: configService.get<string>('database.password', 'postgres'),
        database: configService.get<string>('database.database', 'gamification'),
        ssl: configService.get<boolean>('database.ssl', false),
        ...baseOptions,
      };
    } catch (error) {
      console.error('Failed to create TypeORM options', error);
      // Return minimal configuration to allow app to start
      return {
        type: 'postgres' as const,
        host: 'localhost',
        port: 5432,
        synchronize: false,
        autoLoadEntities: true,
        retryAttempts: 0, // Don't retry to avoid hanging
      };
    }
  }
}