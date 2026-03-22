import { AuthModule } from '@app/auth/auth/auth.module';
import { AppModule as CareAppModule } from '@app/care/app.module';
import { AchievementsModule } from '@app/gamification/achievements/achievements.module';
import { HealthModule } from '@app/health/health/health.module';
import { NotificationsModule } from '@app/notifications/notifications/notifications.module';
import { ClaimsModule } from '@app/plan/claims/claims.module';
import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; // @nestjs/apollo v12.0.0+
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { ConfigModule, ConfigService } from '@nestjs/config'; // @nestjs/config v10.0.0+
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql'; // @nestjs/graphql v12.0.0+
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import configuration from './config/configuration';
import { resolvers } from './graphql/resolvers';
import { GatewayHealthModule } from './health/health.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                autoSchemaFile:
                    configService.get<string>('apiGateway.graphql.autoSchemaFile') ??
                    'schema.graphql',
                sortSchema: configService.get<boolean>('apiGateway.graphql.sortSchema') ?? true,
                playground: configService.get<boolean>('apiGateway.graphql.playground') ?? false,
                debug: configService.get<boolean>('apiGateway.graphql.debug') ?? false,
                introspection:
                    configService.get<boolean>('apiGateway.graphql.introspection') ?? false,
                /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any -- GraphQL resolvers map lacks strict typing in Apollo dynamic config */
                resolvers: resolvers as any,
                /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
            }),
        }),
        PrometheusModule.register(),
        ExceptionsModule,
        TracingModule,
        AuditModule,
        AuthModule,
        HealthModule,
        CareAppModule,
        ClaimsModule,
        AchievementsModule,
        NotificationsModule,
        GatewayHealthModule,
    ],
    controllers: [],
    providers: [{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes('{*path}')
            .apply(RateLimitMiddleware)
            .forRoutes('{*path}')
            .apply(AuthMiddleware)
            .exclude(
                { path: 'api/auth/login', method: RequestMethod.POST },
                { path: 'api/auth/register', method: RequestMethod.POST },
                { path: 'api/health-check', method: RequestMethod.GET }
            )
            .forRoutes('{*path}');
    }
}
