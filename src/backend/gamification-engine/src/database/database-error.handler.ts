import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    onApplicationBootstrap(): void {
        try {
            // Check if database configuration is properly loaded
            const dbConfig = this.configService.get<{
                type: string;
                url?: string;
                host: string;
                port: number;
            }>('database');
            if (!dbConfig) {
                this.logger.warn(
                    'Database configuration not found. Check environment variables.',
                    'DatabaseErrorHandler'
                );
            } else {
                const location = dbConfig.url
                    ? 'using connection URL'
                    : `at ${dbConfig.host}:${dbConfig.port}`;
                this.logger.log(
                    `Database configuration validated. Connected to ${dbConfig.type} database ${location}`,
                    'DatabaseErrorHandler'
                );
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Error validating database configuration: ${msg}`,
                stack,
                'DatabaseErrorHandler'
            );
        }
    }
}
