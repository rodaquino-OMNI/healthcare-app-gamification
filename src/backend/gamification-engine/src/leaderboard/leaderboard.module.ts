import { Module } from '@nestjs/common'; // 10.0.0

import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

/**
 * Module for handling leaderboard functionality in the gamification engine.
 * Provides services for calculating and retrieving leaderboard data based on
 * user achievements and XP across different journeys.
 */
@Module({
    controllers: [LeaderboardController],
    providers: [LeaderboardService],
    exports: [LeaderboardService],
})
export class LeaderboardModule {}
