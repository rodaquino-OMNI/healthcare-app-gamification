/* eslint-disable */
import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { PhiAccess } from '@app/shared/audit';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { TracingService } from '@app/shared/tracing/tracing.service';
import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { TreatmentsService } from './treatments.service';

@ApiTags('treatments')
@Controller('treatments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TreatmentsController {
    constructor(
        private readonly treatmentsService: TreatmentsService,
        private readonly tracingService: TracingService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new treatment plan' })
    @ApiResponse({ status: 201, description: 'Treatment plan created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @PhiAccess('TreatmentPlan')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(
        @CurrentUser() userId: string,
        @Body() createTreatmentPlanDto: CreateTreatmentPlanDto
    ): Promise<TreatmentPlan> {
        return this.tracingService.createSpan('TreatmentsController.create', () => {
            return this.treatmentsService.create(userId, createTreatmentPlanDto);
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get all treatment plans for a user' })
    @ApiResponse({ status: 200, description: 'List of treatment plans returned.' })
    @PhiAccess('TreatmentPlan')
    async findAll(@CurrentUser() userId: string, @Query() filterDto: FilterDto): Promise<TreatmentPlan[]> {
        return this.tracingService.createSpan('TreatmentsController.findAll', () => {
            return this.treatmentsService.findAll(userId, filterDto);
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a treatment plan by id' })
    @ApiResponse({ status: 200, description: 'Treatment plan returned.' })
    @ApiResponse({ status: 404, description: 'Treatment plan not found.' })
    @PhiAccess('TreatmentPlan')
    async findOne(@Param('id') id: string): Promise<TreatmentPlan> {
        return this.tracingService.createSpan('TreatmentsController.findOne', () => {
            return this.treatmentsService.findOne(id);
        });
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a treatment plan' })
    @ApiResponse({ status: 200, description: 'Treatment plan updated successfully.' })
    @ApiResponse({ status: 404, description: 'Treatment plan not found.' })
    @PhiAccess('TreatmentPlan')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(
        @Param('id') id: string,
        @Body() updateTreatmentPlanDto: UpdateTreatmentPlanDto
    ): Promise<TreatmentPlan> {
        return this.tracingService.createSpan('TreatmentsController.update', () => {
            return this.treatmentsService.update(id, updateTreatmentPlanDto);
        });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a treatment plan' })
    @ApiResponse({ status: 200, description: 'Treatment plan deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Treatment plan not found.' })
    @PhiAccess('TreatmentPlan')
    async remove(@Param('id') id: string): Promise<TreatmentPlan> {
        return this.tracingService.createSpan('TreatmentsController.remove', () => {
            return this.treatmentsService.remove(id);
        });
    }
}
