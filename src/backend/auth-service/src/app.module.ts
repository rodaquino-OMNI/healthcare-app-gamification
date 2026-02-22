import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config'; // 10.0.0+
import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { configuration } from './config/configuration';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { PrismaService } from '@app/shared/database/prisma.service';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { HealthModule } from './health/health.module';

/**
 * Root module for the Auth Service that configures all necessary components.
 * This module integrates authentication, user management, roles, permissions, 
 * and shared infrastructure modules to provide a complete authentication
 * and authorization system for the AUSTA SuperApp.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ExceptionsModule,
    LoggerModule,
    TracingModule,
    KafkaModule,
    RedisModule,
    AuditModule,
    HealthModule,
  ],
  providers: [PrismaService, { provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {}