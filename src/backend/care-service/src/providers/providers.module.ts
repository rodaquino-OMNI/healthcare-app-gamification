import { Module } from '@nestjs/common';

import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { ExceptionsModule } from '../../../shared/src/exceptions/exceptions.module';
import { LoggerModule } from '../../../shared/src/logging/logger.module';

/**
 * Module that encapsulates the provider-related functionalities for the Care Now journey.
 */
@Module({
    imports: [ExceptionsModule, LoggerModule],
    controllers: [ProvidersController],
    providers: [ProvidersService],
    exports: [ProvidersService],
})
export class ProvidersModule {}
