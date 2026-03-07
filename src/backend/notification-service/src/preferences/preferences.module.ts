import { Module } from '@nestjs/common';

import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

/**
 * Module that encapsulates the functionality for managing user notification preferences.
 * Imports and registers the controller and service for notification preferences,
 * and exports the service to make it available to other modules.
 */
@Module({
    controllers: [PreferencesController],
    providers: [PreferencesService],
    exports: [PreferencesService],
})
export class PreferencesModule {}
