import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

/**
 * Custom logger service for the Plan Service
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  /**
   * Log an informational message
   * @param message The message to log
   * @param context Optional context (usually the calling class/method name)
   */
  log(message: string, context?: string): void {
    console.log(`[${this.getTimestamp()}] [INFO] ${this.formatContext(context)} ${message}`);
  }

  /**
   * Log an error message
   * @param message The error message to log
   * @param trace Optional stack trace
   * @param context Optional context (usually the calling class/method name)
   */
  error(message: string, trace?: string, context?: string): void {
    console.error(`[${this.getTimestamp()}] [ERROR] ${this.formatContext(context)} ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  /**
   * Log a warning message
   * @param message The warning message to log
   * @param context Optional context (usually the calling class/method name)
   */
  warn(message: string, context?: string): void {
    console.warn(`[${this.getTimestamp()}] [WARN] ${this.formatContext(context)} ${message}`);
  }

  /**
   * Log a debug message
   * @param message The debug message to log
   * @param context Optional context (usually the calling class/method name)
   */
  debug(message: string, context?: string): void {
    console.debug(`[${this.getTimestamp()}] [DEBUG] ${this.formatContext(context)} ${message}`);
  }

  /**
   * Log a verbose message
   * @param message The verbose message to log
   * @param context Optional context (usually the calling class/method name)
   */
  verbose(message: string, context?: string): void {
    console.log(`[${this.getTimestamp()}] [VERBOSE] ${this.formatContext(context)} ${message}`);
  }

  /**
   * Format the context with brackets
   * @param context The context string
   * @returns Formatted context string
   */
  private formatContext(context?: string): string {
    return context ? `[${context}]` : '';
  }

  /**
   * Get the current timestamp
   * @returns Current timestamp in ISO format
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }
}