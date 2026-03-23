import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/auth/auth/guards/roles.guard';
import { PhiAccess } from '@app/shared/audit';
import { ConsentGuard, RequireConsent, ConsentType } from '@app/shared/consent';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import {
    Controller,
    Get,
    Post,
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
import { GoalType, GoalPeriod } from '@prisma/client';

import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';
import { FilterWellnessDto } from './dto/filter-wellness.dto';
import { WellnessService } from './wellness.service';

@ApiTags('wellness')
@Controller('wellness')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class WellnessController {
    constructor(private readonly wellnessService: WellnessService) {}

    @Post('mood')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('MoodCheckIn')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Log a mood check-in' })
    @ApiResponse({ status: 201, description: 'Mood check-in created' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async logMoodCheckIn(
        @Request() req: { user: { id: string } },
        @Body() dto: CreateMoodCheckInDto
    ): Promise<unknown> {
        return this.wellnessService.logMoodCheckIn(req.user.id, dto);
    }

    @Get('mood/history')
    @ApiOperation({ summary: 'Get mood check-in history' })
    @ApiResponse({ status: 200, description: 'Mood history retrieved' })
    async getMoodHistory(
        @Request() req: { user: { id: string } },
        @Query() filters: FilterWellnessDto
    ): Promise<unknown> {
        return this.wellnessService.getMoodHistory(req.user.id, filters);
    }

    @Get('tips')
    @ApiOperation({ summary: 'Get wellness tips' })
    @ApiResponse({ status: 200, description: 'Wellness tips retrieved' })
    async getWellnessTips(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.wellnessService.getWellnessTips(req.user.id);
    }

    @Get('daily-plan')
    @ApiOperation({ summary: 'Get daily wellness plan' })
    @ApiResponse({ status: 200, description: 'Daily plan retrieved' })
    async getDailyPlan(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.wellnessService.getDailyPlan(req.user.id);
    }

    @Get('insights')
    @ApiOperation({ summary: 'Get wellness insights' })
    @ApiResponse({ status: 200, description: 'Wellness insights retrieved' })
    async getInsights(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.wellnessService.getInsights(req.user.id);
    }

    @Post('journal')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('JournalEntry')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a journal entry' })
    @ApiResponse({ status: 201, description: 'Journal entry created' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createJournalEntry(
        @Request() req: { user: { id: string } },
        @Body() dto: CreateJournalEntryDto
    ): Promise<unknown> {
        return this.wellnessService.createJournalEntry(req.user.id, dto);
    }

    @Get('journal')
    @ApiOperation({ summary: 'Get journal entries' })
    @ApiResponse({ status: 200, description: 'Journal entries retrieved' })
    async getJournalEntries(
        @Request() req: { user: { id: string } },
        @Query() filters: FilterWellnessDto
    ): Promise<unknown> {
        return this.wellnessService.getJournalEntries(req.user.id, filters);
    }

    @Get('challenges')
    @ApiOperation({ summary: 'Get available wellness challenges' })
    @ApiResponse({ status: 200, description: 'Challenges retrieved' })
    async getChallenges(): Promise<unknown> {
        return this.wellnessService.getChallenges();
    }

    @Get('challenges/:id')
    @ApiOperation({ summary: 'Get a single wellness challenge' })
    @ApiResponse({ status: 200, description: 'Challenge retrieved' })
    @ApiResponse({ status: 404, description: 'Challenge not found' })
    async getChallengeById(@Param('id') id: string): Promise<unknown> {
        return this.wellnessService.getChallengeById(id);
    }

    @Get('streaks')
    @ApiOperation({ summary: 'Get wellness streaks' })
    @ApiResponse({ status: 200, description: 'Streaks retrieved' })
    async getStreaks(@Request() req: { user: { id: string } }): Promise<unknown> {
        return this.wellnessService.getStreaks(req.user.id);
    }

    @Post('goals')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('WellnessGoal')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a wellness goal' })
    @ApiResponse({ status: 201, description: 'Wellness goal created' })
    @ApiResponse({ status: 403, description: 'Consent not granted' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createGoal(
        @Request() req: { user: { id: string } },
        @Body() goalData: { type: GoalType; targetValue: number; period: GoalPeriod }
    ): Promise<unknown> {
        return this.wellnessService.createGoal(req.user.id, goalData);
    }
}
