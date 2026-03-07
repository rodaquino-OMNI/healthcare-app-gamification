/* eslint-disable */
declare module '@app/gamification/events/kafka/kafka.producer' {
    export class KafkaProducer {
        constructor();

        /**
         * Sends event to Kafka
         */
        send(topic: string, message: unknown, key?: string): Promise<unknown>;
    }
}
