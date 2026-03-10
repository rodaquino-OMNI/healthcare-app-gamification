/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, max-len */
import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { lastValueFrom } from 'rxjs';

import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthenticatedUser {
    id: string;
    email?: string;
    [key: string]: unknown;
}

@Resolver()
export class GamificationResolvers {
    private readonly gamificationServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.gamificationServiceUrl = this.configService.get<string>(
            'services.gamification.url',
            'http://gamification-engine:3005'
        );
    }

    @Query('getGameProfile')
    @UseGuards(JwtAuthGuard)
    async getGameProfile(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const response = await lastValueFrom(this.httpService.get(`${this.gamificationServiceUrl}/profiles/${userId}`));
        return response.data;
    }

    @Query('getAchievements')
    @UseGuards(JwtAuthGuard)
    async getAchievements(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const response = await lastValueFrom(
            this.httpService.get(`${this.gamificationServiceUrl}/achievements/${userId}`)
        );
        return response.data;
    }

    @Query('getQuests')
    @UseGuards(JwtAuthGuard)
    async getQuests(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const response = await lastValueFrom(this.httpService.get(`${this.gamificationServiceUrl}/quests/${userId}`));
        return response.data;
    }

    @Query('getRewards')
    @UseGuards(JwtAuthGuard)
    async getRewards(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const response = await lastValueFrom(this.httpService.get(`${this.gamificationServiceUrl}/rewards/${userId}`));
        return response.data;
    }

    @Mutation('claimReward')
    @UseGuards(JwtAuthGuard)
    async claimReward(@CurrentUser() user: AuthenticatedUser, @Args('rewardId') rewardId: string) {
        const response = await lastValueFrom(
            this.httpService.post(`${this.gamificationServiceUrl}/rewards/${rewardId}/claim`, {
                userId: user.id,
            })
        );
        return response.data;
    }

    @Mutation('completeQuestTask')
    @UseGuards(JwtAuthGuard)
    async completeQuestTask(
        @CurrentUser() user: AuthenticatedUser,
        @Args('questId') questId: string,
        @Args('taskId') taskId: string
    ) {
        const response = await lastValueFrom(
            this.httpService.post(`${this.gamificationServiceUrl}/quests/${questId}/tasks/${taskId}/complete`, {
                userId: user.id,
            })
        );
        return response.data;
    }

    @Mutation('acknowledgeAchievement')
    @UseGuards(JwtAuthGuard)
    async acknowledgeAchievement(@CurrentUser() user: AuthenticatedUser, @Args('achievementId') achievementId: string) {
        const response = await lastValueFrom(
            this.httpService.post(`${this.gamificationServiceUrl}/achievements/${achievementId}/acknowledge`, {
                userId: user.id,
            })
        );
        return response.data;
    }
}
