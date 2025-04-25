# src/backend/api-gateway/src/app.module.ts
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { GraphQLModule } from '@nestjs/graphql'; // @nestjs/graphql v12.0.0+
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; // @nestjs/apollo v12.0.0+
import { ConfigModule } from '@nestjs/config'; // @nestjs/config v10.0.0+

import configuration from './config/configuration';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { resolvers } from './graphql/resolvers';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';
import { AuthModule } from 'src/backend/auth-service/src/auth/auth.module';
import { HealthModule } from 'src/backend/health-service/src/health/health.module';
import { AppointmentsModule } from 'src/backend/care-service/src/appointments/appointments.module';
import { ClaimsModule } from 'src/backend/plan-service/src/claims/claims.module';
import { AchievementsModule } from 'src/backend/gamification-engine/src/achievements/achievements.module';
import { NotificationsModule } from 'src/backend/notification-service/src/notifications/notifications.module';

/**
 * The root module for the API Gateway, configuring GraphQL, middleware, and feature modules.
 */
@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }), GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.graphql',
      sortSchema: true,
      playground: true,
      debug: true,
      resolvers: resolvers,
    }), ExceptionsModule, TracingModule, AuthModule, HealthModule, AppointmentsModule, ClaimsModule, AchievementsModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}