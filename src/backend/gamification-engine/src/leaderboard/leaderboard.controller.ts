import { Controller, Get, Param, UseGuards, UseFilters, ParseEnumPipe } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JOURNEY_IDS } from '@app/shared/constants/journey.constants';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';

/**
 * Controller for handling leaderboard-related requests.
 */
@Controller('leaderboard')
export class LeaderboardController {
  /**
   * Injects the LeaderboardService, LoggerService and TracingService dependencies.
   */
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService,
  ) {
    this.logger.log('Initializing LeaderboardController', 'LeaderboardController');
  }

  /**
   * Retrieves the leaderboard for a specific journey.
   * @param journey The journey to get leaderboard data for (health, care, plan)
   * @returns A promise that resolves to the leaderboard data.
   */
  @Get(':journey')
  @UseFilters(AllExceptionsFilter)
  async getLeaderboard(@Param('journey') journey: string): Promise<any> {
    this.logger.log(`Request to retrieve leaderboard for journey: ${journey}`, 'LeaderboardController');
    
    // Call the leaderboard service to get the data
    const leaderboard = await this.leaderboardService.getLeaderboard(journey);
    
    return leaderboard;
  }
}