/* eslint-disable */
/**
 * Declaration for the LoggerService class from shared module
 */
declare module '@app/shared/logging/logger.service' {
    export class LoggerService {
        constructor(context?: string);

        /**
         * Sets the context for the logger
         */
        setContext(context: string): void;

        /**
         * Logs a debug level message
         */
        debug(message: string, meta?: Record<string, unknown>): void;

        /**
         * Logs an info level message
         */
        info(message: string, meta?: Record<string, unknown>): void;

        /**
         * Logs a warning level message
         */
        warn(message: string, meta?: Record<string, unknown>): void;

        /**
         * Logs an error level message
         */
        error(message: string, trace?: string, meta?: Record<string, unknown>): void;

        /**
         * Logs a fatal level message
         */
        fatal(message: string, trace?: string, meta?: Record<string, unknown>): void;
    }
}
