import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { Reward } from './entities/reward.entity';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createRewardData: any): Promise<Reward> {
    return this.rewardsService.create(createRewardData as Reward);
  }
  
  /**
   * Retrieves all rewards.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Reward[]> {
    return this.rewardsService.findAll();
  }
  
  /**
   * Retrieves a single reward by its ID.
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string): Promise<Reward> {
    return this.rewardsService.findOne(id);
  }
}