import { DynamicModule, Global, Module } from '@nestjs/common';

import { LoggerService } from './logger.service';

export interface LoggerModuleOptions {
    /**
     * Journey identifier (health, care, plan)
     */
    journey?: string;

    /**
     * Logging level (debug, info, warn, error, fatal)
     */
    level?: string;

    /**
     * Enable request logging
     */
    enableRequestLogging?: boolean;
}

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {
    /**
     * Configure the logger module with options
     */
    static forRoot(options?: LoggerModuleOptions): DynamicModule {
        return {
            module: LoggerModule,
            providers: [
                {
                    provide: 'LOGGER_OPTIONS',
                    useValue: options || {},
                },
                LoggerService,
            ],
            exports: [LoggerService],
        };
    }
}
