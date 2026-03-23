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
    Param,
    Body,
    Query,
    UseGuards,
    UseFilters,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ActivityService } from './activity.service';
import { CreateActivityRecordDto } from './dto/create-activity-record.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { UpdateActivityRecordDto } from './dto/update-activity-record.dto';

@ApiTags('activity')
@Controller('activity')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Get()
    @ApiOperation({ summary: 'List activity records for current user' })
    @ApiResponse({ status: 200, description: 'Activity records retrieved' })
    async listActivityRecords(
        @Request() req: { user: { id: string } },
        @Query() filters: FilterActivityDto
    ): Promise<unknown> {
        return this.activityService.listActivityRecords(req.user.id, filters);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get daily activity summary for current user' })
    @ApiResponse({ status: 200, description: 'Activity summary retrieved' })
    async getActivitySummary(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.activityService.getActivitySummary(req.user.id);
    }

    @Get('goals')
    @ApiOperation({ summary: 'Get activity goals for current user' })
    @ApiResponse({ status: 200, description: 'Activity goals retrieved' })
    async getActivityGoals(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.activityService.getActivityGoals(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single activity record' })
    @ApiResponse({ status: 200, description: 'Activity record retrieved' })
    @ApiResponse({ status: 404, description: 'Activity record not found' })
    async getActivityRecord(
        @Request() req: { user: { id: string } },
        @Param('id') id: string
    ): Promise<unknown> {
        return this.activityService.getActivityRecord(req.user.id, id);
    }

    @Post()
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('ActivityRecord')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new activity record' })
    @ApiResponse({ status: 201, description: 'Activity record created' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createActivityRecord(
        @Request() req: { user: { id: string } },
        @Body() dto: CreateActivityRecordDto
    ): Promise<unknown> {
        return this.activityService.createActivityRecord(req.user.id, dto);
    }

    @Put(':id')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('ActivityRecord')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update an existing activity record' })
    @ApiResponse({ status: 200, description: 'Activity record updated' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @ApiResponse({ status: 404, description: 'Activity record not found' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async updateActivityRecord(
        @Request() req: { user: { id: string } },
        @Param('id') id: string,
        @Body() dto: UpdateActivityRecordDto
    ): Promise<unknown> {
        return this.activityService.updateActivityRecord(req.user.id, id, dto);
    }
}
