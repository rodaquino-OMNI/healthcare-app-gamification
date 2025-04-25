import { Module } from '@nestjs/common'; // @nestjs/common@10.0.0+
import { TypeOrmModule } from '@nestjs/typeorm'; // @nestjs/typeorm@10.0.0+
import { TemplatesService } from './templates.service';
import { NotificationTemplate } from './entities/notification-template.entity';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';

/**
 * Configures the TemplatesModule, which manages notification templates within the AUSTA SuperApp.
 * It exports the TemplatesService for use in other modules.
 */
@Module({
  imports: [TypeOrmModule.forFeature([NotificationTemplate]), LoggerModule],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}