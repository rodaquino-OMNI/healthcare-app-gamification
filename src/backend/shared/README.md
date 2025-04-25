# @austa/shared

A comprehensive shared library for the AUSTA SuperApp ecosystem that provides standardized implementations of cross-cutting concerns, reusable modules, and utility functions used across all microservices.

## Overview

The `@austa/shared` module serves as the foundation for the journey-centered architecture of the AUSTA SuperApp. By centralizing common functionality, it ensures consistency, reduces code duplication, and simplifies maintenance across all services. This module implements best practices for healthcare applications while supporting the unique requirements of each journey.

## Key Components

### Logging Module (`@austa/shared/logging`)

Provides structured, journey-aware logging with correlation IDs and consistent formatting:

- Journey-specific context for all log entries
- Standardized log levels and formats
- Request correlation for tracing across services
- Integration with centralized log management

### Exceptions Module (`@austa/shared/exceptions`)

Standardized exception handling framework:

- Journey-specific error types and codes
- Consistent error response format
- Built-in validation error handling
- Automatic HTTP status code mapping

### Kafka Module (`@austa/shared/kafka`)

Facilitates event-driven communication between services:

- Producers and consumers with typed interfaces
- Journey-based topic organization
- Error handling and retry mechanisms
- Event schema validation

### Redis Module (`@austa/shared/redis`)

Provides caching and real-time data capabilities:

- Connection management and pooling
- Typed cache interfaces
- Distributed locking mechanisms
- Leaderboard and real-time data utilities

### Tracing Module (`@austa/shared/tracing`)

Implements distributed tracing:

- OpenTelemetry integration
- Cross-service request tracking
- Journey-specific span attributes
- Performance monitoring

### Database Module (`@austa/shared/database`)

Standardized database access via Prisma:

- Connection management
- Transaction support
- Journey-specific model access
- Database migration utilities

## Installation

```bash
# npm
npm install @austa/shared

# yarn
yarn add @austa/shared
```

## Usage

### Module Registration

Import and register shared modules in your NestJS application:

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from '@austa/shared/logging';
import { ExceptionsModule } from '@austa/shared/exceptions';
import { KafkaModule } from '@austa/shared/kafka';
import { RedisModule } from '@austa/shared/redis';
import { TracingModule } from '@austa/shared/tracing';
import { PrismaService } from '@austa/shared/database';

@Module({
  imports: [
    LoggerModule.forRoot({ 
      journey: 'health', 
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' 
    }),
    ExceptionsModule,
    KafkaModule.forRoot({
      clientId: 'health-service',
      brokers: process.env.KAFKA_BROKERS.split(',')
    }),
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
    TracingModule.forRoot({
      serviceName: 'health-service',
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

### Logging Example

```typescript
import { Injectable } from '@nestjs/common';
import { JourneyLogger } from '@austa/shared/logging';

@Injectable()
export class HealthMetricsService {
  constructor(private readonly logger: JourneyLogger) {}

  async recordMetric(userId: string, metric: HealthMetric): Promise<void> {
    this.logger.info('Recording health metric', { 
      userId, 
      metricType: metric.type 
    });
    
    try {
      // Implementation
    } catch (error) {
      this.logger.error('Failed to record health metric', error, { userId });
      throw error;
    }
  }
}
```

### Exception Handling Example

```typescript
import { Injectable } from '@nestjs/common';
import { BusinessError, ValidationError } from '@austa/shared/exceptions';

@Injectable()
export class AppointmentService {
  async bookAppointment(data: AppointmentDto): Promise<Appointment> {
    if (!data.providerId) {
      throw new ValidationError('Provider ID is required', 'CARE_001', {
        field: 'providerId'
      });
    }
    
    const isAvailable = await this.checkProviderAvailability(
      data.providerId,
      data.dateTime
    );
    
    if (!isAvailable) {
      throw new BusinessError(
        'Provider is not available at the requested time',
        'CARE_002'
      );
    }
    
    // Continue with booking logic
  }
}
```

### Kafka Example

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaProducer, KafkaConsumer } from '@austa/shared/kafka';

@Injectable()
export class GameEventsService implements OnModuleInit {
  constructor(
    private readonly kafkaProducer: KafkaProducer,
    private readonly kafkaConsumer: KafkaConsumer,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe(
      'health.events',
      'game-service-group',
      this.handleHealthEvent.bind(this)
    );
  }

  private async handleHealthEvent(message: any): Promise<void> {
    // Process health event
  }

  async publishAchievementEvent(achievementEvent: AchievementEvent): Promise<void> {
    await this.kafkaProducer.send('game.achievements', achievementEvent);
  }
}
```

### Redis Example

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@austa/shared/redis';

@Injectable()
export class LeaderboardService {
  constructor(private readonly redisService: RedisService) {}

  async updateUserScore(userId: string, points: number): Promise<void> {
    const redisClient = this.redisService.getClient();
    await redisClient.zIncrBy('leaderboard', points, userId);
  }

  async getTopUsers(limit: number = 10): Promise<Array<{userId: string, score: number}>> {
    const redisClient = this.redisService.getClient();
    const results = await redisClient.zRevRangeWithScores('leaderboard', 0, limit - 1);
    
    return results.map(item => ({
      userId: item.value,
      score: item.score,
    }));
  }
}
```

### Tracing Example

```typescript
import { Injectable } from '@nestjs/common';
import { Span, TraceService } from '@austa/shared/tracing';

@Injectable()
export class HealthMetricsService {
  constructor(private readonly traceService: TraceService) {}

  @Span('recordHealthMetric')
  async recordMetric(userId: string, metric: HealthMetric): Promise<void> {
    const span = this.traceService.getActiveSpan();
    span?.setAttribute('userId', userId);
    span?.setAttribute('metricType', metric.type);
    
    // Implementation
  }
}
```

### Database Example

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@austa/shared/database';

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAppointmentsByUser(userId: string): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: { userId },
      include: { provider: true }
    });
  }

  async createAppointment(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({ data });
  }
}
```

## Technologies

- TypeScript 5.0+
- NestJS 10.0+
- Prisma ORM 4.0+
- Kafka.js 2.0+
- Redis 7.0+
- OpenTelemetry
- Winston 3.0+

## Contributing

When extending the shared module:

1. Keep components focused on cross-cutting concerns
2. Maintain backward compatibility
3. Include comprehensive tests
4. Follow journey-centered design principles
5. Document all public APIs and interfaces