import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'; // @nestjs/common 10.0.0
import { JwtAuthGuard, RolesGuard } from '@nestjs/passport'; // @nestjs/passport 10.0.0
import { AchievementsService } from './achievements.service';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';

/**
 * Controller for managing achievements.
 * Provides endpoints for retrieving achievement data.
 */
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() filter: FilterDto
  ): Promise<any> {
    return this.achievementsService.findAll(pagination, filter);
  }

  /**
   * Retrieves a single achievement by its ID.
   * 
   * @param id - The unique identifier of the achievement
   * @returns A promise that resolves to a single achievement.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<any> {
    return this.achievementsService.findById(id);
  }
}