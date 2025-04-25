import { Controller, Get, UseGuards, Request, Inject } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { JwtAuthGuard } from '@nestjs/passport'; // @nestjs/passport v10.0.0+
import { InsightsService } from 'src/backend/health-service/src/insights/insights.service.ts';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service.ts';
import { CurrentUser } from 'src/backend/auth-service/src/auth/decorators/current-user.decorator.ts';

/**
 * Handles incoming requests related to health insights.
 */
@Controller('insights')
export class InsightsController {
  /**
   * Initializes the InsightsController.
   * @param insightsService - The InsightsService for generating health insights.
   * @param logger - The logger service for logging events.
   */
  constructor(
    private readonly insightsService: InsightsService,
    private readonly logger: LoggerService,
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
  async getInsights(@Request() req: any, @CurrentUser() user: any): Promise<any> {
    this.logger.log(`Request to retrieve insights for user ${user.id}`); // Logs the request to retrieve insights.
    const insights = await this.insightsService.generateUserInsights(user.id); // Calls the insightsService to generate user insights.
    return insights; // Returns the generated insights.
  }
}