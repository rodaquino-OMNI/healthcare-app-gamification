import { LoggerModule } from '@app/shared/logging/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { IntegrityController } from './integrity.controller';
import { IntegrityService } from './integrity.service';

/**
 * Module for app integrity attestation verification.
 *
 * Provides server-side verification of mobile attestation tokens
 * from Google Play Integrity API (Android) and Apple App Attest (iOS).
 *
 * MASVS-RESILIENCE-2: The app implements integrity verification.
 */
@Module({
    imports: [ConfigModule, HttpModule.register({ timeout: 5000 }), LoggerModule],
    controllers: [IntegrityController],
    providers: [IntegrityService],
    exports: [IntegrityService],
})
export class IntegrityModule {}
