/* eslint-disable */
/**
 * Type declarations for infrastructure modules
 */

declare module 'src/backend/shared/src/logging/logger.module' {
    import { DynamicModule } from '@nestjs/common';

    export interface LoggerModuleOptions {
        journey?: string;
        level?: string;
    }

    export class LoggerModule {
        static forRoot(options?: LoggerModuleOptions): DynamicModule;
    }
}

declare module 'src/backend/shared/src/logging/logger.service' {
    export class LoggerService {
        constructor(context?: string);
        setContext(context: string): void;
        debug(message: string, meta?: Record<string, unknown>): void;
        info(message: string, meta?: Record<string, unknown>): void;
        warn(message: string, meta?: Record<string, unknown>): void;
        error(message: string, trace?: string, meta?: Record<string, unknown>): void;
        fatal(message: string, trace?: string, meta?: Record<string, unknown>): void;
    }
}

declare module 'src/backend/shared/src/kafka/kafka.module' {
    // eslint-disable-next-line no-duplicate-imports
    import { DynamicModule } from '@nestjs/common';

    export interface KafkaModuleOptions {
        clientId: string;
        brokers: string[];
    }

    export class KafkaModule {
        static forRoot(options: KafkaModuleOptions): DynamicModule;
    }
}

declare module 'src/backend/shared/src/kafka/kafka.service' {
    export class KafkaService {
        constructor();
        emit(topic: string, message: unknown, key?: string): Promise<void>;
        subscribe(topic: string, groupId: string, callback: (message: unknown) => Promise<void>): Promise<void>;
        disconnect(): Promise<void>;
    }
}

declare module 'src/backend/shared/src/redis/redis.module' {
    // eslint-disable-next-line no-duplicate-imports
    import { DynamicModule } from '@nestjs/common';

    export interface RedisModuleOptions {
        host: string;
        port: number;
        password?: string;
        db?: number;
    }

    export class RedisModule {
        static forRoot(options: RedisModuleOptions): DynamicModule;
    }
}

declare module 'src/backend/shared/src/tracing/tracing.service' {
    export class TracingService {
        constructor();
        getActiveSpan(): unknown;
        createSpan(name: string, options?: unknown): unknown;
        startSpan(name: string, options?: unknown): unknown;
        endSpan(span: unknown): void;
    }
}
