import { FilterDto } from '@app/shared/dto/filter.dto'; // @app/shared ^1.0.0
import { PaginationDto } from '@app/shared/dto/pagination.dto'; // @app/shared ^1.0.0
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'; // @nestjs/common 10.0.0
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AchievementsService } from './achievements.service';

/**
 * Controller for managing achievements.
 * Provides endpoints for retrieving achievement data.
 */
@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
    /**
     * Injects the Achievements service.
     *
     * @param achievementsService - Service that provides achievement-related functionality
     */
    constructor(private readonly achievementsService: AchievementsService) {}

    /**
     * Retrieves all achievements.
     * Supports pagination and filtering.
     *
     * @param pagination - Pagination parameters like page and limit
     * @param filter - Filtering criteria like journey or specific conditions
     * @returns A promise that resolves to an array of achievements.
     */
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'List all achievements' })
    @ApiResponse({ status: 200, description: 'Returns paginated list of achievements' })
    async findAll(@Query() pagination: PaginationDto, @Query() filter: FilterDto): Promise<any> {
        return this.achievementsService.findAll(filter, pagination);
    }

    /**
     * Retrieves a single achievement by its ID.
     *
     * @param id - The unique identifier of the achievement
     * @returns A promise that resolves to a single achievement.
     */
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get achievement by ID' })
    @ApiResponse({ status: 200, description: 'Returns the achievement' })
    async findOne(@Param('id') id: string): Promise<any> {
        return this.achievementsService.findById(id);
    }
}
