import { Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';

// Define types that match what we need from Winston
interface LoggerOptions {
    level?: string;
    format?: any;
    transports?: any[];
}

@Injectable()
export class LoggerService extends ConsoleLogger {
    // Change from private to protected to match ConsoleLogger parent class
    protected context: string = 'Application';

    constructor() {
        super();
        // Set default log level from environment or use 'info'
        this.setLogLevels(this.parseLogLevels(process.env.LOG_LEVEL || 'info'));
    }

    /**
     * Set the context for subsequent log messages
     */
    setContext(context: string): void {
        this.context = context;
    }

    /**
     * Log a message with info level
     * @param message - The message to log
     * @param context - Optional context override
     */
    log(message: string, context?: string): void {
        super.log(message, context || this.context);
    }

    /**
     * Log an error message
     * @param message - The error message
     * @param trace - Optional stack trace
     * @param context - Optional context override
     */
    error(message: string, trace?: string, context?: string): void {
        super.error(message, trace, context || this.context);
    }

    /**
     * Log a warning message
     * @param message - The warning message
     * @param context - Optional context override
     */
    warn(message: string, context?: string): void {
        super.warn(message, context || this.context);
    }

    /**
     * Log a debug message
     * @param message - The debug message
     * @param contextOrObject - Optional context override or metadata object
     */
    debug(message: string, contextOrObject?: string | object): void {
        if (contextOrObject && typeof contextOrObject === 'object') {
            // Convert object to string for logging
            const metadataStr = JSON.stringify(contextOrObject);
            super.debug(`${message} ${metadataStr}`, this.context);
        } else {
            super.debug(message, (contextOrObject as string) || this.context);
        }
    }

    /**
     * Log a verbose message
     * @param message - The verbose message
     * @param context - Optional context override
     */
    verbose(message: string, context?: string): void {
        super.verbose(message, context || this.context);
    }

    /**
     * Create a child logger with a specific context
     * @param context - The context for the child logger
     * @returns A new logger instance with the specified context
     */
    createLogger(context: string): LoggerService {
        const childLogger = new LoggerService();
        childLogger.setContext(context);
        return childLogger;
    }

    /**
     * Parse log level string to NestJS compatible log levels
     * Modified to return LogLevel[] instead of string[]
     */
    private parseLogLevels(level: string): LogLevel[] {
        switch (level.toLowerCase()) {
            case 'error':
                return ['error' as LogLevel];
            case 'warn':
                return ['error' as LogLevel, 'warn' as LogLevel];
            case 'info':
                return ['error' as LogLevel, 'warn' as LogLevel, 'log' as LogLevel];
            case 'debug':
                return ['error' as LogLevel, 'warn' as LogLevel, 'log' as LogLevel, 'debug' as LogLevel];
            case 'verbose':
                return [
                    'error' as LogLevel,
                    'warn' as LogLevel,
                    'log' as LogLevel,
                    'debug' as LogLevel,
                    'verbose' as LogLevel,
                ];
            default:
                return ['error' as LogLevel, 'warn' as LogLevel, 'log' as LogLevel];
        }
    }
}
