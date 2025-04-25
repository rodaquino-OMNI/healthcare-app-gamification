import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * Global module that provides the LoggerService across the application.
 * This enables centralized logging with structured format and journey-specific context
 * throughout the AUSTA SuperApp backend services.
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}