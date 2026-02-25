import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 10.0.0+
import { PassportModule } from '@nestjs/passport'; // 10.0.0+
import { ConfigModule, ConfigService } from '@nestjs/config'; // 10.0.0+
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { OAuthStrategy } from './strategies/oauth.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LockoutGuard } from './guards/lockout.guard';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { configuration } from '../config/configuration';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';

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
        secret: configService.get<string>('authService.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('authService.jwt.accessTokenExpiration'),
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