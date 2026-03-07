declare module '@app/gamification/events/kafka/kafka.producer' {
    export class KafkaProducer {
        constructor();

        /**
         * Sends event to Kafka
         */
        send(topic: string, message: any, key?: string): Promise<any>;
    }
}
