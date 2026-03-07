import { DynamicModule, Global, Module } from '@nestjs/common';

import { RedisService } from './redis.service';

export interface RedisModuleOptions {
    /**
     * Redis connection URL
     */
    url?: string;

    /**
     * Redis host
     */
    host?: string;

    /**
     * Redis port
     */
    port?: number;

    /**
     * Redis password
     */
    password?: string;

    /**
     * Redis database index
     */
    db?: number;

    /**
     * Connection prefix
     */
    keyPrefix?: string;

    /**
     * Enable TLS
     */
    tls?: boolean;
}

@Global()
@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {
    /**
     * Configure the Redis module
     */
    static forRoot(options: RedisModuleOptions = {}): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: 'REDIS_OPTIONS',
                    useValue: options,
                },
                RedisService,
            ],
            exports: [RedisService],
        };
    }
}
