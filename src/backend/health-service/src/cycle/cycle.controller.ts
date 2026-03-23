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
    Request,
    UseGuards,
    UseFilters,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CycleService } from './cycle.service';
import { CreateCycleRecordDto } from './dto/create-cycle-record.dto';
import { FilterCycleDto } from './dto/filter-cycle.dto';
import { UpdateCycleRecordDto } from './dto/update-cycle-record.dto';

@ApiTags('cycle')
@Controller('cycle')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CycleController {
    constructor(private readonly cycleService: CycleService) {}

    @Get()
    @ApiOperation({ summary: 'List cycle records with pagination and date range' })
    async listCycleRecords(
        @Request() req: { user: { id: string } },
        @Query() filter: FilterCycleDto
    ): Promise<unknown> {
        return this.cycleService.listCycleRecords(req.user.id, filter);
    }

    @Get('predictions')
    @ApiOperation({ summary: 'Get predicted next cycle based on history' })
    async getPredictions(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.cycleService.getPredictions(req.user.id);
    }

    @Get('history')
    @ApiOperation({ summary: 'Get cycle history with statistics' })
    async getCycleHistory(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.cycleService.getCycleHistory(req.user.id);
    }

    @Get('symptoms')
    @ApiOperation({ summary: 'Get symptom tracking summary' })
    async getSymptomsSummary(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.cycleService.getSymptomsSummary(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single cycle record by ID' })
    async getCycleRecord(
        @Request() req: { user: { id: string } },
        @Param('id') id: string
    ): Promise<unknown> {
        return this.cycleService.getCycleRecord(req.user.id, id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('CycleRecord')
    @ApiOperation({ summary: 'Log a new period / cycle record' })
    async createCycleRecord(
        @Request() req: { user: { id: string } },
        @Body() dto: CreateCycleRecordDto
    ): Promise<unknown> {
        return this.cycleService.createCycleRecord(req.user.id, dto);
    }

    @Put(':id')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('CycleRecord')
    @ApiOperation({ summary: 'Update an existing cycle record' })
    async updateCycleRecord(
        @Request() req: { user: { id: string } },
        @Param('id') id: string,
        @Body() dto: UpdateCycleRecordDto
    ): Promise<unknown> {
        return this.cycleService.updateCycleRecord(req.user.id, id, dto);
    }
}
