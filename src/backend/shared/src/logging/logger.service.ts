import { Injectable, LoggerService as NestLoggerService, Logger } from '@nestjs/common';
import { TracingService } from '../tracing/tracing.service';

/**
 * Custom logger service for the AUSTA SuperApp.
 * Provides a centralized and consistent way to handle logging across all backend services.
 * Leverages NestJS's built-in Logger and integrates with the tracing service for enhanced observability.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;
  
  /**
   * Initializes the LoggerService.
   */
  constructor() {
    this.logger = new Logger('AustaLogger');
  }

  /**
   * Logs a message with the INFO level.
   * @param message The message to log
   * @param context Optional context for the log
   */
  log(message: string, context?: any): void {
    this.logger.log(message, context);
  }

  /**
   * Logs a message with the ERROR level.
   * @param message The message to log
   * @param trace Optional stack trace or error object
   * @param context Optional context for the log
   */
  error(message: string, trace?: any, context?: any): void {
    this.logger.error(message, trace, context);
  }

  /**
   * Logs a message with the WARN level.
   * @param message The message to log
   * @param context Optional context for the log
   */
  warn(message: string, context?: any): void {
    this.logger.warn(message, context);
  }

  /**
   * Logs a message with the DEBUG level.
   * @param message The message to log
   * @param context Optional context for the log
   */
  debug(message: string, context?: any): void {
    this.logger.debug(message, context);
  }

  /**
   * Logs a message with the VERBOSE level.
   * @param message The message to log
   * @param context Optional context for the log
   */
  verbose(message: string, context?: any): void {
    this.logger.verbose(message, context);
  }
}