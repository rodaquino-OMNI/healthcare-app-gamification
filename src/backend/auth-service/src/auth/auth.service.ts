/* eslint-disable */
import * as crypto from 'crypto';

import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

/**
 * Interface for role objects with a name property
 */
interface Role {
    name: string;
    [key: string]: any;
}

/**
 * Service responsible for authentication operations including user registration,
 * login, JWT token management, and authentication-related functionalities.
 */
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private logger: LoggerService,
        private prisma: PrismaService,
        private redisService: RedisService
    ) {}

    /**
     * Registers a new user in the system.
     * @param createUserDto User registration data
     * @returns The created user object (without password)
     */
    async register(createUserDto: CreateUserDto): Promise<any> {
        this.logger.log(`Registering user with email: ${createUserDto.email}`, 'AuthService');

        try {
            // Try to find if a user with the same email already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email: createUserDto.email },
            });

            if (existingUser) {
                throw new AppException('User with this email already exists', ErrorType.VALIDATION, 'AUTH_002', {
                    email: createUserDto.email,
                });
            }

            // Create the user using the users service
            const user = await this.usersService.create(createUserDto);

            return user;
        } catch (error: any) {
            // If it's already our custom AppException, just rethrow it
            if (error instanceof AppException) {
                throw error as any;
            }

            // Otherwise wrap in a new AppException
            const errorMsg = error.message || 'Unknown error during registration';
            const errorStack = error.stack || '';
            this.logger.error(`Failed to register user: ${errorMsg}`, errorStack, 'AuthService');

            throw new AppException(
                'Registration failed',
                ErrorType.TECHNICAL,
                'AUTH_003',
                { email: createUserDto.email },
                error instanceof Error ? undefined : undefined
            );
        }
    }

    /**
     * Parses refresh token expiration config string (e.g. '7d') into seconds.
     */
    private getRefreshTokenTtl(): number {
        const exp = this.configService.get<string>('authService.jwt.refreshTokenExpiration') || '7d';
        const match = exp.match(/^(\d+)([dhms])$/);
        if (!match) {
            return 7 * 24 * 3600;
        }
        const val = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 'd':
                return val * 86400;
            case 'h':
                return val * 3600;
            case 'm':
                return val * 60;
            case 's':
                return val;
            default:
                return 7 * 86400;
        }
    }

    /**
     * Generates a cryptographically secure refresh token and stores it in Redis.
     * @param userId The user ID to associate with the refresh token
     * @returns The generated refresh token string
     */
    async generateRefreshToken(userId: string): Promise<string> {
        const token = crypto.randomBytes(64).toString('hex');
        const ttl = this.getRefreshTokenTtl();
        await this.redisService.set(`refresh:${token}`, userId, ttl);
        return token;
    }

    /**
     * Rotates refresh tokens: validates the old token, revokes it, and issues new tokens.
     * @param refreshToken The current refresh token to rotate
     * @returns New access token and refresh token pair
     */
    async refreshTokens(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
        const userId = await this.redisService.get(`refresh:${refreshToken}`);
        if (!userId) {
            throw new AppException(
                'Invalid or expired refresh token',
                ErrorType.AUTHENTICATION,
                'AUTH_008',
                {},
                HttpStatus.UNAUTHORIZED
            );
        }

        // Revoke the old refresh token (single-use rotation)
        await this.redisService.del(`refresh:${refreshToken}`);

        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new AppException('User not found', ErrorType.AUTHENTICATION, 'AUTH_009', {}, HttpStatus.UNAUTHORIZED);
        }

        const payload = {
            sub: user.id as string,
            email: user.email as string,
            roles: (user.roles as Role[])?.map((r: Role) => r.name) || [],
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('authService.jwt.secret'),
            expiresIn: this.configService.get<string>('authService.jwt.accessTokenExpiration') as any,
        });

        const newRefreshToken = await this.generateRefreshToken(user.id as string);

        return { access_token: accessToken, refresh_token: newRefreshToken };
    }

    /**
     * Revokes a refresh token by removing it from Redis.
     * @param refreshToken The refresh token to revoke
     */
    async revokeRefreshToken(refreshToken: string): Promise<void> {
        await this.redisService.del(`refresh:${refreshToken}`);
    }

    /**
     * Authenticates a user and generates JWT + refresh tokens.
     * Includes account lockout tracking after repeated failed attempts.
     * @param email User's email
     * @param password User's password
     * @returns Object containing access token, refresh token, and user data
     */
    async login(email: string, password: string): Promise<any> {
        this.logger.log(`Attempting login for user: ${email}`, 'AuthService');

        // Check account lockout before attempting credentials validation
        const lockoutKey = `lockout:${email}`;
        const attempts = parseInt((await this.redisService.get(lockoutKey)) || '0', 10);
        const threshold = this.configService.get<number>('authService.password.lockoutThreshold') || 5;

        if (attempts >= threshold) {
            this.logger.warn(`Account locked for ${email} after ${attempts} failed attempts`, 'AuthService');
            throw new AppException(
                'Account temporarily locked due to too many failed attempts',
                ErrorType.AUTHENTICATION,
                'AUTH_007',
                {},
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        let user: any;
        try {
            // Validate user credentials
            user = await this.usersService.validateCredentials(email, password);
        } catch (error: any) {
            // Increment failed attempt counter on credential failure
            const newAttempts = parseInt((await this.redisService.get(lockoutKey)) || '0', 10) + 1;
            const lockoutDuration = this.configService.get<number>('authService.password.lockoutDuration') || 1800;
            await this.redisService.set(lockoutKey, String(newAttempts), lockoutDuration);

            const errorMsg = error.message || 'Unknown login error';
            const errorStack = error.stack || '';
            this.logger.error(`Login failed for user ${email}: ${errorMsg}`, errorStack, 'AuthService');

            throw new AppException(
                'Invalid login credentials',
                ErrorType.VALIDATION,
                'AUTH_004',
                {},
                error instanceof Error ? undefined : undefined
            );
        }

        // Clear lockout counter on successful login
        await this.redisService.del(lockoutKey);

        // Generate JWT access token
        const payload = {
            sub: user.id as string,
            email: user.email as string,
            roles: (user.roles as Role[])?.map((role: Role) => role.name) || [],
        };

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('authService.jwt.secret'),
            expiresIn: this.configService.get<string>('authService.jwt.accessTokenExpiration') as any,
        });

        // Generate refresh token
        const refreshToken = await this.generateRefreshToken(user.id as string);

        return {
            access_token: token,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    /**
     * Validates a user's JWT token and returns the user data.
     * @param payload JWT payload
     * @returns User object if token is valid
     */
    async validateToken(payload: any): Promise<any> {
        this.logger.log(`Validating token for user ID: ${payload.sub}`, 'AuthService');

        try {
            const user = await this.usersService.findOne(payload.sub);
            return user;
        } catch (error: any) {
            const errorMsg = error.message || 'Unknown token validation error';
            const errorStack = error.stack || '';
            this.logger.error(`Token validation failed: ${errorMsg}`, errorStack, 'AuthService');
            return null;
        }
    }
}
