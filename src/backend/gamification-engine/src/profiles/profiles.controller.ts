import { AUTH_INSUFFICIENT_PERMISSIONS } from '@app/shared/constants/error-codes.constants';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { GameProfile } from './entities/game-profile.entity';
import { ProfilesService } from './profiles.service';

/**
 * Controller for managing user game profiles.
 */
@ApiTags('profiles')
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
    @ApiOperation({ summary: 'Get game profile by user ID' })
    @ApiResponse({ status: 200, description: 'Returns the user game profile' })
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
    @ApiOperation({ summary: 'Create a new game profile for a user' })
    @ApiResponse({ status: 201, description: 'Game profile created successfully' })
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
    @ApiOperation({ summary: 'Update an existing game profile' })
    @ApiResponse({ status: 200, description: 'Game profile updated successfully' })
    async updateProfile(
        @Param('userId') userId: string,
        @Body() updateData: Partial<GameProfile>
    ): Promise<GameProfile> {
        return this.profilesService.update(userId, updateData);
    }
}
