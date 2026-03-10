import { PrismaService } from '@app/shared/database/prisma.service';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisModule } from '@app/shared/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BiometricController } from './biometric.controller';
import { BiometricService } from './biometric.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { configuration } from '../config/configuration';

/**
 * Module that configures biometric authentication for the AUSTA SuperApp.
 * Provides device registration, challenge generation, and signature verification.
 */
@Module({
    imports: [
        ConfigModule.forFeature(configuration),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('authService.jwt.secret', 'fallback-secret-change-me'),
                signOptions: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    expiresIn: configService.get<string>('authService.jwt.accessTokenExpiration', '1h') as any,
                },
            }),
            inject: [ConfigService],
        }),
        ExceptionsModule,
        LoggerModule,
        RedisModule,
    ],
    controllers: [BiometricController],
    providers: [BiometricService, JwtAuthGuard, PrismaService, LoggerService],
    exports: [BiometricService],
})
export class BiometricModule {}
