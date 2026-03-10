import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Controller, Get, UseGuards, Request } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { InsightsService } from '@app/health/insights/insights.service';

/**
 * Handles incoming requests related to health insights.
 */
@ApiTags('insights')
@Controller('insights')
export class InsightsController {
    /**
     * Initializes the InsightsController.
     * @param insightsService - The InsightsService for generating health insights.
     * @param logger - The logger service for logging events.
     */
    constructor(
        private readonly insightsService: InsightsService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('InsightsController'); // Initializes the logger with the context 'InsightsController'.
    }

    /**
     * Retrieves health insights for the current user.
     * @param req - The request object.
     * @param user - The current user.
     * @returns A promise that resolves with the generated insights for the user.
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get health insights for the current user' })
    @ApiResponse({ status: 200, description: 'Returns generated health insights' })
    // eslint-disable-next-line max-len
    async getInsights(@Request() _req: unknown, @CurrentUser() user: { id: string }): Promise<unknown> {
        // Logs the request to retrieve insights.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.logger.log(`Request to retrieve insights for user ${user.id}`);
        // Calls the insightsService to generate user insights.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const insights = await this.insightsService.generateUserInsights(user.id);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return insights;
    }
}
