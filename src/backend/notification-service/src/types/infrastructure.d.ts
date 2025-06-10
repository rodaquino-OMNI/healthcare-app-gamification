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
    debug(message: string, meta?: Record<string, any>): void;
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, trace?: string, meta?: Record<string, any>): void;
    fatal(message: string, trace?: string, meta?: Record<string, any>): void;
  }
}

declare module 'src/backend/shared/src/kafka/kafka.module' {
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
    emit(topic: string, message: any, key?: string): Promise<void>;
    subscribe(topic: string, groupId: string, callback: (message: any) => Promise<void>): Promise<void>;
    disconnect(): Promise<void>;
  }
}

declare module 'src/backend/shared/src/redis/redis.module' {
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
    getActiveSpan(): any;
    createSpan(name: string, options?: any): any;
    startSpan(name: string, options?: any): any;
    endSpan(span: any): void;
  }
}