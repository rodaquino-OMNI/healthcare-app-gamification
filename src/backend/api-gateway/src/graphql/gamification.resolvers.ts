/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, max-len -- GraphQL resolver bridges untyped HTTP responses from gamification-engine to client schema */
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { lastValueFrom } from 'rxjs';

import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { withRetry } from '../utils/http-retry';

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
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
        this.gamificationServiceUrl = this.configService.get<string>(
            'services.gamification.url',
            'http://gamification-engine:3005'
        );
    }

    @Query('getGameProfile')
    @UseGuards(JwtAuthGuard)
    async getGameProfile(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const cacheKey = `gamification:profile:${userId}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const response = await lastValueFrom(
            withRetry(this.httpService.get(`${this.gamificationServiceUrl}/profiles/${userId}`), {
                context: 'getGameProfile',
            })
        );
        await this.cacheManager.set(cacheKey, response.data, 300_000); // 300s TTL in ms
        return response.data;
    }

    @Query('getAchievements')
    @UseGuards(JwtAuthGuard)
    async getAchievements(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const cacheKey = `gamification:achievements:${userId}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const response = await lastValueFrom(
            withRetry(
                this.httpService.get(`${this.gamificationServiceUrl}/achievements/${userId}`),
                { context: 'getAchievements' }
            )
        );
        await this.cacheManager.set(cacheKey, response.data, 300_000); // 300s TTL in ms
        return response.data;
    }

    @Query('getQuests')
    @UseGuards(JwtAuthGuard)
    async getQuests(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const cacheKey = `gamification:quests:${userId}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const response = await lastValueFrom(
            withRetry(this.httpService.get(`${this.gamificationServiceUrl}/quests/${userId}`), {
                context: 'getQuests',
            })
        );
        await this.cacheManager.set(cacheKey, response.data, 300_000); // 300s TTL in ms
        return response.data;
    }

    @Query('getRewards')
    @UseGuards(JwtAuthGuard)
    async getRewards(@CurrentUser() user: AuthenticatedUser, @Args('userId') userId: string) {
        const cacheKey = `gamification:rewards:${userId}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const response = await lastValueFrom(
            withRetry(this.httpService.get(`${this.gamificationServiceUrl}/rewards/${userId}`), {
                context: 'getRewards',
            })
        );
        await this.cacheManager.set(cacheKey, response.data, 300_000); // 300s TTL in ms
        return response.data;
    }

    @Mutation('claimReward')
    @UseGuards(JwtAuthGuard)
    async claimReward(@CurrentUser() user: AuthenticatedUser, @Args('rewardId') rewardId: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.gamificationServiceUrl}/rewards/${rewardId}/claim`, {
                    userId: user.id,
                }),
                { maxRetries: 1, context: 'claimReward' }
            )
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
            withRetry(
                this.httpService.post(
                    `${this.gamificationServiceUrl}/quests/${questId}/tasks/${taskId}/complete`,
                    { userId: user.id }
                ),
                { maxRetries: 1, context: 'completeQuestTask' }
            )
        );
        return response.data;
    }

    @Mutation('acknowledgeAchievement')
    @UseGuards(JwtAuthGuard)
    async acknowledgeAchievement(
        @CurrentUser() user: AuthenticatedUser,
        @Args('achievementId') achievementId: string
    ) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(
                    `${this.gamificationServiceUrl}/achievements/${achievementId}/acknowledge`,
                    { userId: user.id }
                ),
                { maxRetries: 1, context: 'acknowledgeAchievement' }
            )
        );
        return response.data;
    }
}
