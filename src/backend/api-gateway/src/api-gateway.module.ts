import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthResolvers } from './graphql/auth.resolvers';
import { CareResolvers } from './graphql/care.resolvers';
import { GamificationResolvers } from './graphql/gamification.resolvers';
import { HealthResolvers } from './graphql/health.resolvers';
import { PlanResolvers } from './graphql/plan.resolvers';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        HttpModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthResolvers,
        HealthResolvers,
        CareResolvers,
        PlanResolvers,
        GamificationResolvers,
        JwtStrategy,
    ],
    exports: [AuthResolvers, HealthResolvers, CareResolvers, PlanResolvers, GamificationResolvers],
})
export class ApiGatewayModule {}
