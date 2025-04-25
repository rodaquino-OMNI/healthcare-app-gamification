import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  UseGuards, 
  NotFoundException,
  Logger 
} from '@nestjs/common'; // @nestjs/common ^9.0.0
import { Roles } from '@app/auth'; // @app/auth ^1.0.0
import { RolesGuard } from '@app/auth'; // @app/auth ^1.0.0
import { CurrentUser } from '@app/auth'; // @app/auth ^1.0.0
import { FilterDto } from '@app/shared'; // @app/shared ^1.0.0
import { PaginationDto } from '@app/shared'; // @app/shared ^1.0.0
import { LoggerService } from '@app/shared'; // @app/shared ^1.0.0
import { QuestsService } from './quests.service';

/**
 * Controller for managing quests.
 */
@Controller('quests')
export class QuestsController {
  /**
   * Injects the QuestsService and LoggerService.
   */
  constructor(
    private readonly questsService: QuestsService,
    private readonly logger: LoggerService
  ) {}

  /**
   * Retrieves all quests.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('user')
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() filter: FilterDto
  ): Promise<any[]> {
    this.logger.log('Finding all quests', 'QuestsController');
    const quests = await this.questsService.findAll();
    this.logger.log(`Found ${quests.length} quests`, 'QuestsController');
    return quests;
  }

  /**
   * Retrieves a single quest by its ID.
   */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('user')
  async findOne(@Param('id') id: string): Promise<any> {
    this.logger.log(`Finding quest with ID: ${id}`, 'QuestsController');
    const quest = await this.questsService.findOne(id);
    
    if (!quest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    
    this.logger.log(`Found quest with ID: ${id}`, 'QuestsController');
    return quest;
  }

  /**
   * Starts a quest for a user.
   */
  @Post(':id/start')
  @UseGuards(RolesGuard)
  @Roles('user')
  async startQuest(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<any> {
    this.logger.log(`Starting quest ${id} for user ${user.id}`, 'QuestsController');
    const userQuest = await this.questsService.startQuest(user.id, id);
    this.logger.log(`Started quest ${id} for user ${user.id}`, 'QuestsController');
    return userQuest;
  }

  /**
   * Completes a quest for a user.
   */
  @Post(':id/complete')
  @UseGuards(RolesGuard)
  @Roles('user')
  async completeQuest(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<any> {
    this.logger.log(`Completing quest ${id} for user ${user.id}`, 'QuestsController');
    const userQuest = await this.questsService.completeQuest(user.id, id);
    this.logger.log(`Completed quest ${id} for user ${user.id}`, 'QuestsController');
    return userQuest;
  }
}