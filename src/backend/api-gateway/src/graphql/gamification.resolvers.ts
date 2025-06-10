import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Resolver()
export class GamificationResolvers {
  private readonly gamificationServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gamificationServiceUrl = this.configService.get<string>('services.gamification.url', 'http://gamification-engine:3005');
  }

  @Query('getGameProfile')
  @UseGuards(JwtAuthGuard)
  async getGameProfile(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.gamificationServiceUrl}/profiles/${userId}`),
    );
    return response.data;
  }

  @Query('getAchievements')
  @UseGuards(JwtAuthGuard)
  async getAchievements(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.gamificationServiceUrl}/achievements/${userId}`),
    );
    return response.data;
  }

  @Query('getQuests')
  @UseGuards(JwtAuthGuard)
  async getQuests(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.gamificationServiceUrl}/quests/${userId}`),
    );
    return response.data;
  }

  @Query('getRewards')
  @UseGuards(JwtAuthGuard)
  async getRewards(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.gamificationServiceUrl}/rewards/${userId}`),
    );
    return response.data;
  }

  @Mutation('claimReward')
  @UseGuards(JwtAuthGuard)
  async claimReward(
    @CurrentUser() user: any,
    @Args('rewardId') rewardId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.gamificationServiceUrl}/rewards/${rewardId}/claim`, {
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('completeQuestTask')
  @UseGuards(JwtAuthGuard)
  async completeQuestTask(
    @CurrentUser() user: any,
    @Args('questId') questId: string,
    @Args('taskId') taskId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.gamificationServiceUrl}/quests/${questId}/tasks/${taskId}/complete`, {
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('acknowledgeAchievement')
  @UseGuards(JwtAuthGuard)
  async acknowledgeAchievement(
    @CurrentUser() user: any,
    @Args('achievementId') achievementId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.gamificationServiceUrl}/achievements/${achievementId}/acknowledge`, {
        userId: user.id,
      }),
    );
    return response.data;
  }
}