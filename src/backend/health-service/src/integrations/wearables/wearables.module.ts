import { Module } from '@nestjs/common';
import { WearablesService } from './wearables.service';
import { GoogleFitAdapter } from './adapters/googlefit.adapter';
import { HealthKitAdapter } from './adapters/healthkit.adapter';
import { DevicesModule } from '../../devices/devices.module';

/**
 * Module that configures wearable device integrations for the Health Service.
 * Provides adapters for various wearable platforms and a unified service
 * to manage their connections and data synchronization.
 * 
 * Addresses requirement F-101-RQ-004: Connect with supported wearable devices
 * to import health metrics.
 */
@Module({
  imports: [DevicesModule],
  providers: [WearablesService, GoogleFitAdapter, HealthKitAdapter],
  exports: [WearablesService]
})
export class WearablesModule {}