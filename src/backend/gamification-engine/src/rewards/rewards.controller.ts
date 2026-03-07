import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { Reward } from './entities/reward.entity';
import { RewardsService } from './rewards.service';

/**
 * Handles incoming HTTP requests related to rewards.
 */
@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
    /**
     * Injects the RewardsService.
     */
    constructor(private readonly rewardsService: RewardsService) {}

    /**
     * Creates a new reward.
     */
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create a new reward' })
    @ApiResponse({ status: 201, description: 'Reward created successfully' })
    create(@Body() createRewardData: any): Promise<Reward> {
        return this.rewardsService.create(createRewardData as Reward);
    }

    /**
     * Retrieves all rewards.
     */
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'List all rewards' })
    @ApiResponse({ status: 200, description: 'Returns list of all rewards' })
    findAll(): Promise<Reward[]> {
        return this.rewardsService.findAll();
    }

    /**
     * Retrieves a single reward by its ID.
     */
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get reward by ID' })
    @ApiResponse({ status: 200, description: 'Returns the reward' })
    findOne(@Param('id') id: string): Promise<Reward> {
        return this.rewardsService.findOne(id);
    }
}
