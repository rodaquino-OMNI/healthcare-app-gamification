import { Module, Global } from '@nestjs/common';

import { AllExceptionsFilter } from './exceptions.filter';
import { LoggerModule } from '../logging/logger.module';

/**
 * Module that provides the AllExceptionsFilter globally across the application.
 * This enables centralized exception handling with standardized error responses
 * and structured logging for all journeys in the AUSTA SuperApp.
 */
@Global()
@Module({
    imports: [LoggerModule],
    providers: [AllExceptionsFilter],
    exports: [AllExceptionsFilter],
})
export class ExceptionsModule {}
