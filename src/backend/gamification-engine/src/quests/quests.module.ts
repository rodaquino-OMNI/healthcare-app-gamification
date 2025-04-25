import { Module } from '@nestjs/common'; // @nestjs/common ^9.0.0
import { TypeOrmModule } from '@nestjs/typeorm'; // @nestjs/typeorm ^9.0.0
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { Quest } from './entities/quest.entity';
import { UserQuest } from './entities/user-quest.entity';

/**
 * Module for managing quests within the gamification engine.
 * Configures the necessary providers, controllers, and database entities
 * to enable quest functionality across the application.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Quest, UserQuest])],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}