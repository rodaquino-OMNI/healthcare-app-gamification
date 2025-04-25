import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 10.0.0+

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { configuration } from './config/configuration';

import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { RedisModule } from 'src/backend/shared/src/redis/redis.module';

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
  ],
  providers: [PrismaService],
})
export class AppModule {}