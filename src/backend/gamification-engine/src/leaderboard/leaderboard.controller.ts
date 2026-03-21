import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { LeaderboardService } from './leaderboard.service';

/**
 * Controller for handling leaderboard-related requests.
 */
@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
    /**
     * Injects the LeaderboardService, LoggerService and TracingService dependencies.
     */
    constructor(
        private readonly leaderboardService: LeaderboardService,
        private readonly logger: LoggerService,
        private readonly tracingService: TracingService
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
    @ApiOperation({ summary: 'Get leaderboard for a specific journey' })
    @ApiResponse({ status: 200, description: 'Returns leaderboard data for the journey' })
    async getLeaderboard(@Param('journey') journey: string): Promise<unknown> {
        this.logger.log(
            `Request to retrieve leaderboard for journey: ${journey}`,
            'LeaderboardController'
        );

        return this.leaderboardService.getLeaderboard(journey);
    }
}
