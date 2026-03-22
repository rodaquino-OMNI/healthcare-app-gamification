/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, max-len -- GraphQL resolver bridges untyped HTTP responses from auth-service to client schema */
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
export class AuthResolvers {
    private readonly authServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
        this.authServiceUrl = this.configService.get<string>(
            'services.auth.url',
            'http://auth-service:3001'
        );
    }

    @Query('getUser')
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: AuthenticatedUser, @Args('id') id: string) {
        const cacheKey = `user:${id}`;
        const cached = await this.cacheManager.get<unknown>(cacheKey);
        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const response = await lastValueFrom(
            withRetry(this.httpService.get(`${this.authServiceUrl}/users/${id}`), {
                context: 'getUser',
            })
        );
        await this.cacheManager.set(cacheKey, response.data, 60_000); // 60s TTL in ms
        return response.data;
    }

    @Mutation('login')
    async login(@Args('email') email: string, @Args('password') password: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/login`, { email, password }),
                { maxRetries: 1, context: 'login' }
            )
        );
        return response.data;
    }

    @Mutation('register')
    async register(
        @Args('name') name: string,
        @Args('email') email: string,
        @Args('password') password: string
    ) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/register`, {
                    name,
                    email,
                    password,
                }),
                { maxRetries: 1, context: 'register' }
            )
        );
        return response.data;
    }

    @Mutation('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser() user: AuthenticatedUser) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/logout`, { userId: user.id }),
                { maxRetries: 1, context: 'logout' }
            )
        );
        return response.data;
    }

    @Mutation('refreshToken')
    @UseGuards(JwtAuthGuard)
    async refreshToken(@CurrentUser() user: AuthenticatedUser) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/refresh`, { userId: user.id }),
                { maxRetries: 1, context: 'refreshToken' }
            )
        );
        return response.data;
    }

    @Mutation('verifyMFA')
    @UseGuards(JwtAuthGuard)
    async verifyMFA(@CurrentUser() user: AuthenticatedUser, @Args('code') code: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/mfa/verify`, {
                    userId: user.id,
                    code,
                }),
                { maxRetries: 1, context: 'verifyMFA' }
            )
        );
        return response.data;
    }

    @Mutation('requestPasswordReset')
    async requestPasswordReset(@Args('email') email: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/password/reset-request`, {
                    email,
                }),
                { maxRetries: 1, context: 'requestPasswordReset' }
            )
        );
        return response.data;
    }

    @Mutation('resetPassword')
    async resetPassword(@Args('token') token: string, @Args('password') password: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/password/reset`, {
                    token,
                    password,
                }),
                { maxRetries: 1, context: 'resetPassword' }
            )
        );
        return response.data;
    }

    @Mutation('updateUser')
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @CurrentUser() user: AuthenticatedUser,
        @Args('name', { nullable: true }) name?: string,
        @Args('email', { nullable: true }) email?: string
    ) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.patch(`${this.authServiceUrl}/users/${user.id}`, { name, email }),
                { maxRetries: 1, context: 'updateUser' }
            )
        );
        return response.data;
    }

    @Mutation('changePassword')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @CurrentUser() user: AuthenticatedUser,
        @Args('oldPassword') oldPassword: string,
        @Args('newPassword') newPassword: string
    ) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/password/change`, {
                    userId: user.id,
                    oldPassword,
                    newPassword,
                }),
                { maxRetries: 1, context: 'changePassword' }
            )
        );
        return response.data;
    }

    @Mutation('setupMFA')
    @UseGuards(JwtAuthGuard)
    async setupMFA(@CurrentUser() user: AuthenticatedUser) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/mfa/setup`, { userId: user.id }),
                { maxRetries: 1, context: 'setupMFA' }
            )
        );
        return response.data;
    }

    @Mutation('disableMFA')
    @UseGuards(JwtAuthGuard)
    async disableMFA(@CurrentUser() user: AuthenticatedUser) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/mfa/disable`, {
                    userId: user.id,
                }),
                { maxRetries: 1, context: 'disableMFA' }
            )
        );
        return response.data;
    }

    @Mutation('socialLogin')
    async socialLogin(@Args('provider') provider: string, @Args('token') token: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/social/${provider}`, { token }),
                { maxRetries: 1, context: 'socialLogin' }
            )
        );
        return response.data;
    }

    @Mutation('biometricLogin')
    async biometricLogin(@Args('biometricData') biometricData: string) {
        const response = await lastValueFrom(
            withRetry(
                this.httpService.post(`${this.authServiceUrl}/auth/biometric`, { biometricData }),
                { maxRetries: 1, context: 'biometricLogin' }
            )
        );
        return response.data;
    }
}
