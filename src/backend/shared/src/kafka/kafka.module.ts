/* eslint-disable */
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { KafkaProducer } from './kafka.producer';
import { KafkaService } from './kafka.service';

export interface KafkaModuleOptions {
    /**
     * Kafka connection options
     */
    clientId: string;
    brokers: string[];

    /**
     * Optional SSL configuration
     */
    ssl?: boolean;
    sasl?: {
        mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
        username: string;
        password: string;
    };

    /**
     * Consumer group configuration
     */
    groupId?: string;

    /**
     * Default topic settings
     */
    defaultTopic?: string;

    /**
     * Auto-commit configuration
     */
    autoCommit?: boolean;
}

@Global()
@Module({})
export class KafkaModule {
    /**
     * Configure Kafka module
     */
    static forRoot(options: KafkaModuleOptions): DynamicModule {
        const optionsProvider = {
            provide: 'KAFKA_OPTIONS',
            useValue: options,
        };

        const kafkaProviders: Provider[] = [optionsProvider, KafkaService, KafkaProducer];

        return {
            global: true,
            module: KafkaModule,
            providers: kafkaProviders,
            exports: [KafkaService, KafkaProducer],
        };
    }

    /**
     * Register Kafka consumers
     */
    static forFeature(): DynamicModule {
        return {
            module: KafkaModule,
            providers: [],
            exports: [],
        };
    }
}
