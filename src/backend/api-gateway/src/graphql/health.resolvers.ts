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
export class HealthResolvers {
    private readonly healthServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
        this.healthServiceUrl = this.configService.get<string>(
            'services.health.url',
            'http://health-service:3002'
        );
    }

    @Query('getHealthMetrics')
    @UseGuards(JwtAuthGuard)
    async getHealthMetrics(
        @CurrentUser() user: AuthenticatedUser,
        @Args('userId') userId: string,
        @Args('types', { nullable: true }) types?: string[],
        @Args('startDate', { nullable: true }) startDate?: Date,
        @Args('endDate', { nullable: true }) endDate?: Date,
        @Args('source', { nullable: true }) source?: string
    ): Promise<unknown> {
        const cacheKey = `health:metrics:${userId}:${types?.join(',') ?? ''}:${startDate?.toISOString() ?? ''}:${endDate?.toISOString() ?? ''}:${source ?? ''}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const params = new URLSearchParams();
        if (types) {
            params.append('types', types.join(','));
        }
        if (startDate) {
            params.append('startDate', startDate.toISOString());
        }
        if (endDate) {
            params.append('endDate', endDate.toISOString());
        }
        if (source) {
            params.append('source', source);
        }

        const response = await lastValueFrom(
            withRetry(
                this.httpService.get<unknown>(
                    `${this.healthServiceUrl}/metrics/${userId}?${String(params)}`
                ),
                { context: 'getHealthMetrics' }
            )
        );
        await this.cacheManager.set(cacheKey, response.data, 300_000); // 300s TTL in ms
        return response.data;
    }

    @Query('getHealthGoals')
    @UseGuards(JwtAuthGuard)
    async getHealthGoals(
        @CurrentUser() user: AuthenticatedUser,
        @Args('userId') userId: string,
        @Args('status', { nullable: true }) status?: string,
        @Args('type', { nullable: true }) type?: string
    ): Promise<unknown> {
        const cacheKey = `health:goals:${userId}:${status ?? ''}:${type ?? ''}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const params = new URLSearchParams();
        if (status) {
            params.append('status', status);
        }
        if (type) {
            params.append('type', type);
        }

        const response = await lastValueFrom(
            withRetry(
                this.httpService.get<unknown>(
                    `${this.healthServiceUrl}/goals/${userId}?${String(params)}`
                ),
                { context: 'getHealthGoals' }
            )
        );
        await this.cacheManager.set(cacheKey, response.data, 300_000); // 300s TTL in ms
        return response.data;
    }

    @Query('getMedicalHistory')
    @UseGuards(JwtAuthGuard)
    async getMedicalHistory(
        @CurrentUser() user: AuthenticatedUser,
        @Args('userId') userId: string,
        @Args('types', { nullable: true }) types?: string[],
        @Args('startDate', { nullable: true }) startDate?: Date,
        @Args('endDate', { nullable: true }) endDate?: Date,
        @Args('severity', { nullable: true }) severity?: string
    ): Promise<unknown> {
        const params = new URLSearchParams();
        if (types) {
            params.append('types', types.join(','));
        }
        if (startDate) {
            params.append('startDate', startDate.toISOString());
        }
        if (endDate) {
            params.append('endDate', endDate.toISOString());
        }
        if (severity) {
            params.append('severity', severity);
        }

        const response = await lastValueFrom(
            withRetry(
                this.httpService.get<unknown>(
                    `${this.healthServiceUrl}/medical-history/${userId}?${String(params)}`
                ),
                { context: 'getMedicalHistory' }
            )
        );
        return response.data;
    }

    @Query('getConnectedDevices')
    @UseGuards(JwtAuthGuard)
    async getConnectedDevices(
        @CurrentUser() user: AuthenticatedUser,
        @Args('userId') userId: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            withRetry(this.httpService.get<unknown>(`${this.healthServiceUrl}/devices/${userId}`), {
                context: 'getConnectedDevices',
            })
        );
        return response.data;
    }

    @Mutation('createHealthMetric')
    @UseGuards(JwtAuthGuard)
    async createHealthMetric(
        @CurrentUser() user: AuthenticatedUser,
        @Args('recordId') recordId: string,
        @Args('createMetricDto') createMetricDto: unknown
    ): Promise<unknown> {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post<unknown>(
                    `${this.healthServiceUrl}/metrics/${recordId}`,
                    createMetricDto
                ),
                { maxRetries: 1, context: 'createHealthMetric' }
            )
        );
        return response.data;
    }
}
