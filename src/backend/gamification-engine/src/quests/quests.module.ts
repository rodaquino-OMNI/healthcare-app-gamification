import { Module } from '@nestjs/common'; // @nestjs/common ^9.0.0
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';

/**
 * Module for managing quests within the gamification engine.
 * Configures the necessary providers, controllers, and database entities
 * to enable quest functionality across the application.
 */
@Module({
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}