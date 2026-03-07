/* eslint-disable */
/**
 * Declaration for the KafkaService class from shared module
 */
declare module '@app/shared/kafka/kafka.service' {
    export class KafkaService {
        constructor();

        /**
         * Sends an event to Kafka
         */
        emit(topic: string, message: unknown, key?: string): Promise<unknown>;

        /**
         * Subscribes to a Kafka topic
         */
        subscribe(topic: string, groupId: string, callback: (message: unknown) => Promise<void>): Promise<void>;
    }
}
