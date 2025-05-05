import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Param,
  Body,
  UseGuards,
  UseFilters,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { GameProfile } from './entities/game-profile.entity';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { AUTH_INSUFFICIENT_PERMISSIONS } from '@app/shared/constants/error-codes.constants';
import { LoggerService } from '@app/shared/logging/logger.service';

/**
 * Controller for managing user game profiles.
 */
@Controller('profiles')
@UseFilters(AllExceptionsFilter)
export class ProfilesController {
  /**
   * Injects the ProfilesService dependency.
   */
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly logger: LoggerService
  ) {}

  /**
   * Retrieves a user's game profile by user ID.
   * @param userId The ID of the user whose profile to retrieve
   * @returns The user's game profile
   */
  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<GameProfile> {
    return this.profilesService.findById(userId);
  }

  /**
   * Creates a new game profile for a user.
   * @param data Object containing the userId for whom to create the profile
   * @returns The newly created game profile
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(@Body() data: { userId: string }): Promise<GameProfile> {
    return this.profilesService.create(data.userId);
  }

  /**
   * Updates an existing game profile.
   * @param userId The ID of the user whose profile to update
   * @param updateData The partial profile data to update
   * @returns The updated game profile
   */
  @Patch(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateData: Partial<GameProfile>,
  ): Promise<GameProfile> {
    return this.profilesService.update(userId, updateData);
  }
}