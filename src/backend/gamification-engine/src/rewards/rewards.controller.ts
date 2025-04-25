import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { Reward } from './entities/reward.entity';
import { CreateRewardDto } from './dto/create-reward.dto';
import { JwtAuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@nestjs/core';
import { Roles } from '@nestjs/core';

/**
 * Handles incoming HTTP requests related to rewards.
 */
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
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardsService.create(createRewardDto as unknown as Reward);
  }

  /**
   * Retrieves all rewards.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(): Promise<Reward[]> {
    return this.rewardsService.findAll();
  }

  /**
   * Retrieves a single reward by its ID.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Promise<Reward> {
    return this.rewardsService.findOne(id);
  }
}