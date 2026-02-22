import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { LoggerModule } from '@app/shared/logging/logger.module';

/**
 * Configures the TemplatesModule, which manages notification templates within the AUSTA SuperApp.
 * It exports the TemplatesService for use in other modules.
 */
@Module({
  imports: [LoggerModule],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
