import { Module, Global } from '@nestjs/common'; // v10.0+
import { ConfigModule } from '@nestjs/config'; // v10.0+
import { KafkaService } from './kafka.service';
import { LoggerModule } from '../logging/logger.module';
import { TracingModule } from '../tracing/tracing.module';

/**
 * Global module that provides Kafka integration for event streaming and asynchronous communication.
 * 
 * This module makes the KafkaService available for dependency injection across all journey services,
 * enabling event-driven architecture particularly for the gamification engine and notifications.
 * 
 * Key capabilities supported:
 * - Publishing events from all journey services to appropriate topics
 * - Consuming events for processing in the gamification engine
 * - Reliable message delivery with error handling and retries
 * - Distributed tracing of message flow for observability
 * - Journey-specific event processing and routing
 */
@Global()
@Module({
  imports: [ConfigModule, LoggerModule, TracingModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}