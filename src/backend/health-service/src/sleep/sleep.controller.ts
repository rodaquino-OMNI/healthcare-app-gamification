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

import { CreateSleepRecordDto } from './dto/create-sleep-record.dto';
import { FilterSleepDto } from './dto/filter-sleep.dto';
import { UpdateSleepRecordDto } from './dto/update-sleep-record.dto';
import { SleepService } from './sleep.service';

@ApiTags('sleep')
@Controller('sleep')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class SleepController {
    constructor(private readonly sleepService: SleepService) {}

    @Get()
    @ApiOperation({ summary: 'List sleep records for current user' })
    @ApiResponse({ status: 200, description: 'Sleep records retrieved' })
    async listSleepRecords(
        @Request() req: { user: { id: string } },
        @Query() filters: FilterSleepDto
    ): Promise<unknown> {
        return this.sleepService.listSleepRecords(req.user.id, filters);
    }

    @Get('trends')
    @ApiOperation({ summary: 'Get sleep trends' })
    @ApiResponse({ status: 200, description: 'Sleep trends retrieved' })
    async getSleepTrends(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.sleepService.getSleepTrends(req.user.id);
    }

    @Get('goals')
    @ApiOperation({ summary: 'Get sleep goals' })
    @ApiResponse({ status: 200, description: 'Sleep goals retrieved' })
    async getSleepGoals(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.sleepService.getSleepGoals(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single sleep record' })
    @ApiResponse({ status: 200, description: 'Sleep record retrieved' })
    @ApiResponse({ status: 404, description: 'Sleep record not found' })
    async getSleepRecord(
        @Request() req: { user: { id: string } },
        @Param('id') id: string
    ): Promise<unknown> {
        return this.sleepService.getSleepRecord(req.user.id, id);
    }

    @Post()
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('SleepRecord')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Log a new sleep record' })
    @ApiResponse({ status: 201, description: 'Sleep record created' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createSleepRecord(
        @Request() req: { user: { id: string } },
        @Body() dto: CreateSleepRecordDto
    ): Promise<unknown> {
        return this.sleepService.createSleepRecord(req.user.id, dto);
    }

    @Put(':id')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('SleepRecord')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a sleep record' })
    @ApiResponse({ status: 200, description: 'Sleep record updated' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async updateSleepRecord(
        @Request() req: { user: { id: string } },
        @Param('id') id: string,
        @Body() dto: UpdateSleepRecordDto
    ): Promise<unknown> {
        return this.sleepService.updateSleepRecord(req.user.id, id, dto);
    }
}
