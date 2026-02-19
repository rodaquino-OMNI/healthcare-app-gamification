import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { GraphQLModule } from '@nestjs/graphql'; // @nestjs/graphql v12.0.0+
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; // @nestjs/apollo v12.0.0+
import { ConfigModule } from '@nestjs/config'; // @nestjs/config v10.0.0+
import configuration from './config/configuration';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { resolvers } from './graphql/resolvers';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { AuthModule } from '@app/auth/auth/auth.module';
import { HealthModule } from '@app/health/health/health.module';
import { AppModule as CareAppModule } from '@app/care/app.module';
import { ClaimsModule } from '@app/plan/claims/claims.module';
import { AchievementsModule } from '@app/gamification/achievements/achievements.module';
import { NotificationsModule } from '@app/notifications/notifications/notifications.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }), GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.graphql',
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      debug: process.env.NODE_ENV !== 'production',
      resolvers: resolvers,
    }), ExceptionsModule, TracingModule, AuthModule, HealthModule, CareAppModule, ClaimsModule, AchievementsModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*')
      .apply(RateLimitMiddleware)
      .forRoutes('*')
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/auth/login', method: RequestMethod.POST },
        { path: 'api/auth/register', method: RequestMethod.POST },
        { path: 'api/health-check', method: RequestMethod.GET }
      )
      .forRoutes('*');
  }
}