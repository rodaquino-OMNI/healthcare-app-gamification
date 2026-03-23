import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/auth/auth/guards/roles.guard';
import { PhiAccess } from '@app/shared/audit';
import { ConsentGuard, RequireConsent, ConsentType } from '@app/shared/consent';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    UseFilters,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateNutritionRecordDto } from './dto/create-nutrition-record.dto';
import { FilterNutritionDto } from './dto/filter-nutrition.dto';
import { UpdateNutritionRecordDto } from './dto/update-nutrition-record.dto';
import { NutritionService } from './nutrition.service';

interface AuthenticatedRequest {
    user: { id: string };
}

@ApiTags('nutrition')
@ApiBearerAuth()
@Controller('nutrition')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe({ whitelist: true }))
export class NutritionController {
    constructor(private readonly nutritionService: NutritionService) {}

    @Get()
    @ApiOperation({ summary: 'List nutrition records (paginated, date range)' })
    @ApiResponse({ status: 200, description: 'Returns paginated nutrition records' })
    async listNutritionRecords(
        @Request() req: AuthenticatedRequest,
        @Query() filters: FilterNutritionDto
    ): Promise<unknown> {
        return this.nutritionService.listNutritionRecords(req.user.id, filters);
    }

    @Get('daily-summary')
    @ApiOperation({ summary: 'Get daily macro and calorie summary' })
    @ApiResponse({ status: 200, description: 'Returns daily nutrition summary' })
    async getDailySummary(
        @Request() req: AuthenticatedRequest,
        @Query('date') date?: string
    ): Promise<unknown> {
        return this.nutritionService.getDailySummary(req.user.id, date);
    }

    @Get('goals')
    @ApiOperation({ summary: 'Get nutrition goals for user' })
    @ApiResponse({ status: 200, description: 'Returns nutrition goals' })
    async getNutritionGoals(@Request() req: AuthenticatedRequest): Promise<unknown> {
        return this.nutritionService.getNutritionGoals(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single nutrition record by ID' })
    @ApiResponse({ status: 200, description: 'Returns a single nutrition record' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    async getNutritionRecord(
        @Param('id') id: string,
        @Request() req: AuthenticatedRequest
    ): Promise<unknown> {
        return this.nutritionService.getNutritionRecord(id, req.user.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('NutritionRecord')
    @ApiOperation({ summary: 'Log a meal' })
    @ApiResponse({ status: 201, description: 'Meal record created successfully' })
    async createNutritionRecord(
        @Request() req: AuthenticatedRequest,
        @Body() createDto: CreateNutritionRecordDto
    ): Promise<unknown> {
        return this.nutritionService.createNutritionRecord(req.user.id, createDto);
    }

    @Put(':id')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('NutritionRecord')
    @ApiOperation({ summary: 'Update a meal record' })
    @ApiResponse({ status: 200, description: 'Meal record updated successfully' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    async updateNutritionRecord(
        @Param('id') id: string,
        @Request() req: AuthenticatedRequest,
        @Body() updateDto: UpdateNutritionRecordDto
    ): Promise<unknown> {
        return this.nutritionService.updateNutritionRecord(id, req.user.id, updateDto);
    }
}
