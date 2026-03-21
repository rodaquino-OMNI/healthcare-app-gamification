/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, max-len -- KafkaProducer delegates to KafkaService which uses dynamic message payloads */
import { Injectable } from '@nestjs/common';

import { KafkaService } from './kafka.service';

@Injectable()
export class KafkaProducer {
    constructor(private readonly kafkaService: KafkaService) {}

    /**
     * Send a message to a Kafka topic
     * @param topic The topic to send to
     * @param message The message to send
     * @param key Optional message key for partitioning
     * @param headers Optional message headers
     * @returns Promise that resolves when the message is sent
     */
    async send(
        topic: string,
        message: string | Record<string, unknown>,
        key?: string,
        headers?: Record<string, string>
    ): Promise<void> {
        return this.kafkaService.emit(topic, message, key, headers);
    }

    /**
     * Send multiple messages to a Kafka topic in batch
     * @param topic The topic to send to
     * @param messages Array of messages to send
     * @returns Promise that resolves when all messages are sent
     */
    async sendBatch(
        topic: string,
        messages: Array<{
            message: string | Record<string, unknown>;
            key?: string;
            headers?: Record<string, string>;
        }>
    ): Promise<void> {
        const promises = messages.map(({ message, key, headers }) =>
            this.kafkaService.emit(topic, message, key, headers)
        );

        await Promise.all(promises);
    }
}
