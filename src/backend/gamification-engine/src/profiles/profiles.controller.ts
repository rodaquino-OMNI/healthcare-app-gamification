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
  Roles,
  CurrentUser,
} from '@nestjs/common';
import { ProfilesService } from 'src/backend/gamification-engine/src/profiles/profiles.service';
import { GameProfile } from 'src/backend/gamification-engine/src/profiles/entities/game-profile.entity';
import { AppException } from 'src/backend/shared/src/exceptions/exceptions.types';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { AUTH_INSUFFICIENT_PERMISSIONS } from 'src/backend/shared/src/constants/error-codes.constants';

/**
 * Controller for managing user game profiles.
 */
@Controller('profiles')
export class ProfilesController {
  /**
   * Injects the ProfilesService dependency.
   */
  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * Retrieves a user's game profile by user ID.
   * @param userId The ID of the user whose profile to retrieve
   * @returns The user's game profile
   */
  @Get(':userId')
  @UseFilters(new AllExceptionsFilter())
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
  @UseFilters(new AllExceptionsFilter())
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
  @UseFilters(new AllExceptionsFilter())
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateData: Partial<GameProfile>,
  ): Promise<GameProfile> {
    return this.profilesService.update(userId, updateData);
  }
}