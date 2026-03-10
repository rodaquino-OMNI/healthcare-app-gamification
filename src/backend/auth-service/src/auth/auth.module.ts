import { PrismaService } from '@app/shared/database/prisma.service';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 10.0.0+
import { JwtModule } from '@nestjs/jwt'; // 10.0.0+
import { PassportModule } from '@nestjs/passport'; // 10.0.0+

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LockoutGuard } from './guards/lockout.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { OAuthStrategy } from './strategies/oauth.strategy';
import { configuration } from '../config/configuration';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';

/**
 * Configures the authentication module for the AUSTA SuperApp.
 */
@Module({
    imports: [
        ConfigModule.forFeature(configuration),
        PassportModule,
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
        RolesModule,
        PermissionsModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        OAuthStrategy,
        JwtAuthGuard,
        RolesGuard,
        LockoutGuard,
        PrismaService,
        LoggerService,
    ],
    exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
