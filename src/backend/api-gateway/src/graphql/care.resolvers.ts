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
export class CareResolvers {
    private readonly careServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
        this.careServiceUrl = this.configService.get<string>(
            'services.care.url',
            'http://care-service:3003'
        );
    }

    @Query('getAppointments')
    @UseGuards(JwtAuthGuard)
    async getAppointments(
        @CurrentUser() user: AuthenticatedUser,
        @Args('userId') userId: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.get<unknown>(
                    `${this.careServiceUrl}/appointments?userId=${userId}`
                ),
                { context: 'getAppointments' }
            )
        );
        return response.data;
    }

    @Query('getAppointment')
    @UseGuards(JwtAuthGuard)
    async getAppointment(
        @CurrentUser() user: AuthenticatedUser,
        @Args('id') id: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            withRetry(this.httpService.get<unknown>(`${this.careServiceUrl}/appointments/${id}`), {
                context: 'getAppointment',
            })
        );
        return response.data;
    }

    @Query('getProviders')
    async getProviders(
        @Args('specialty', { nullable: true }) specialty?: string,
        @Args('location', { nullable: true }) location?: string
    ): Promise<unknown> {
        const cacheKey = `providers:${specialty ?? ''}:${location ?? ''}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const params = new URLSearchParams();
        if (specialty) {
            params.append('specialty', specialty);
        }
        if (location) {
            params.append('location', location);
        }

        const response = await lastValueFrom(
            withRetry(
                this.httpService.get<unknown>(`${this.careServiceUrl}/providers?${String(params)}`),
                { context: 'getProviders' }
            )
        );
        await this.cacheManager.set(cacheKey, response.data, 600_000); // 600s TTL in ms
        return response.data;
    }

    @Mutation('bookAppointment')
    @UseGuards(JwtAuthGuard)
    async bookAppointment(
        @CurrentUser() user: AuthenticatedUser,
        @Args('providerId') providerId: string,
        @Args('dateTime') dateTime: string,
        @Args('type') type: string,
        @Args('reason', { nullable: true }) reason?: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post<unknown>(`${this.careServiceUrl}/appointments`, {
                    providerId,
                    dateTime,
                    type,
                    reason,
                    userId: user.id,
                }),
                { maxRetries: 1, context: 'bookAppointment' }
            )
        );
        return response.data;
    }

    @Mutation('cancelAppointment')
    @UseGuards(JwtAuthGuard)
    async cancelAppointment(
        @CurrentUser() user: AuthenticatedUser,
        @Args('id') id: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.delete<unknown>(`${this.careServiceUrl}/appointments/${id}`),
                { maxRetries: 1, context: 'cancelAppointment' }
            )
        );
        return response.data;
    }
}
