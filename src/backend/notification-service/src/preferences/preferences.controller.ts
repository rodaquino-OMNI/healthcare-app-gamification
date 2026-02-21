import { Controller, Get, Post, Patch, Query, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { NotificationPreference } from './entities/notification-preference.entity';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';

/**
 * Controller for managing user notification preferences.
 * Provides endpoints for retrieving, creating, and updating notification preferences.
 */
@ApiTags('preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  /**
   * Retrieves all notification preferences based on the provided filter and pagination parameters.
   * Users can only access their own preferences.
   *
   * @param filter - Optional filtering criteria
   * @param pagination - Optional pagination parameters
   * @param user - The ID of the current authenticated user
   * @returns A promise that resolves to an array of NotificationPreference entities
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get notification preferences for the current user' })
  @ApiResponse({ status: 200, description: 'Returns list of notification preferences' })
  async getPreferences(
    @Query() filter: FilterDto,
    @Query() pagination: PaginationDto,
    @CurrentUser('id') user: string,
  ): Promise<NotificationPreference[]> {
    // Add the userId to the filter to ensure users only see their own preferences
    if (!filter) {
      filter = {};
    }

    // Ensure the where clause exists
    if (!filter.where) {
      filter.where = {};
    }

    // Force userId filter to the current user's ID for security
    filter.where.userId = user;

    return this.preferencesService.findAll(filter, pagination);
  }

  /**
   * Creates a new notification preference record for the current user.
   *
   * @param user - The ID of the current authenticated user
   * @returns A promise that resolves to the newly created NotificationPreference entity
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new notification preference for the current user' })
  @ApiResponse({ status: 201, description: 'Notification preference created successfully' })
  async createPreference(
    @CurrentUser('id') user: string,
  ): Promise<NotificationPreference> {
    return this.preferencesService.create(user);
  }

  /**
   * Updates an existing notification preference record.
   * Note: Additional security checks may be necessary in the service layer
   * to ensure users can only update their own preferences.
   *
   * @param id - The ID of the notification preference record
   * @param data - Partial notification preference data to update
   * @returns A promise that resolves to the updated NotificationPreference entity
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a notification preference' })
  @ApiResponse({ status: 200, description: 'Notification preference updated successfully' })
  async updatePreference(
    @Param('id') id: string,
    @Body() data: Partial<NotificationPreference>,
  ): Promise<NotificationPreference> {
    return this.preferencesService.update(id, data);
  }
}