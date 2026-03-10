import * as crypto from 'crypto';

import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/** Extracts message and stack from an unknown error. */
function extractError(err: unknown): {
    message: string;
    stack: string;
} {
    if (err instanceof Error) {
        return {
            message: err.message,
            stack: err.stack ?? '',
        };
    }
    return { message: String(err), stack: '' };
}

/** Shape of a user row returned by Prisma with roles. */
interface BiometricUser {
    id: string;
    email: string;
    roles?: Array<{ name: string }>;
}

/**
 * Interface for a stored biometric device key.
 */
interface BiometricDeviceKey {
    userId: string;
    publicKey: string;
    deviceId: string;
    platform: string;
    createdAt: Date;
    expiresAt: Date;
}

/**
 * Service responsible for biometric authentication operations including
 * device registration, challenge generation, and signature verification.
 */
@Injectable()
export class BiometricService {
    /** Challenge TTL in seconds (5 minutes) */
    private static readonly CHALLENGE_TTL_SECONDS = 300;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private logger: LoggerService,
        private prisma: PrismaService,
        private redisService: RedisService
    ) {}

    /**
     * Registers a biometric device key for a user.
     * Stores the public key in Redis with a configurable expiration.
     * @param userId The user's unique identifier
     * @param publicKey The device's public key in PEM format
     * @param deviceId The unique device identifier
     * @param platform The device platform (e.g. 'ios', 'android')
     * @returns Object containing success status and the device key identifier
     */
    async registerDevice(
        userId: string,
        publicKey: string,
        deviceId: string,
        platform: string
    ): Promise<{ success: boolean; deviceKeyId: string }> {
        this.logger.log(`Registering biometric device for user: ${userId}, device: ${deviceId}`, 'BiometricService');

        if (!userId || !publicKey || !deviceId || !platform) {
            throw new AppException(
                'Missing required fields for biometric registration',
                ErrorType.VALIDATION,
                'BIO_001'
            );
        }

        const deviceKeyId = crypto.randomBytes(16).toString('hex');
        const expirationDays = this.configService.get<number>('authService.biometric.deviceKeyExpirationDays', 90);
        const ttlSeconds = expirationDays * 24 * 3600;

        const deviceKey: BiometricDeviceKey = {
            userId,
            publicKey,
            deviceId,
            platform,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + ttlSeconds * 1000),
        };

        try {
            await this.redisService.set(`biometric:device:${deviceKeyId}`, JSON.stringify(deviceKey), ttlSeconds);

            this.logger.log(`Biometric device registered: ${deviceKeyId} for user ${userId}`, 'BiometricService');

            return { success: true, deviceKeyId };
        } catch (error: unknown) {
            const { message, stack } = extractError(error);
            this.logger.error(`Failed to register biometric device: ${message}`, stack, 'BiometricService');

            throw new AppException('Failed to register biometric device', ErrorType.TECHNICAL, 'BIO_002', {
                userId,
                deviceId,
            });
        }
    }

    /**
     * Generates a cryptographic challenge for biometric verification.
     * The challenge is stored in Redis with a 5-minute TTL.
     * @param userId The user's unique identifier
     * @returns Object containing the challenge nonce and its expiration time
     */
    async generateChallenge(userId: string): Promise<{ challenge: string; expiresIn: number }> {
        this.logger.log(`Generating biometric challenge for user: ${userId}`, 'BiometricService');

        if (!userId) {
            throw new AppException('User ID is required to generate a challenge', ErrorType.VALIDATION, 'BIO_003');
        }

        const challenge = crypto.randomBytes(32).toString('hex');

        try {
            await this.redisService.set(
                `biometric:challenge:${userId}`,
                challenge,
                BiometricService.CHALLENGE_TTL_SECONDS
            );

            this.logger.log(`Biometric challenge generated for user: ${userId}`, 'BiometricService');

            return {
                challenge,
                expiresIn: BiometricService.CHALLENGE_TTL_SECONDS,
            };
        } catch (error: unknown) {
            const { message, stack } = extractError(error);
            this.logger.error(`Failed to generate biometric challenge: ${message}`, stack, 'BiometricService');

            throw new AppException('Failed to generate biometric challenge', ErrorType.TECHNICAL, 'BIO_004', {
                userId,
            });
        }
    }

    /**
     * Verifies a biometric signature against the stored public key and challenge.
     * On success, issues JWT access and refresh tokens.
     * @param userId The user's unique identifier
     * @param signature The cryptographic signature produced by the device
     * @param challenge The challenge nonce that was signed
     * @param deviceKeyId The identifier of the registered device key
     * @returns JWT access and refresh tokens on successful verification
     */
    async verifySignature(
        userId: string,
        signature: string,
        challenge: string,
        deviceKeyId: string
    ): Promise<{ access_token: string; refresh_token: string }> {
        this.logger.log(
            `Verifying biometric signature for user: ${userId}, device key: ${deviceKeyId}`,
            'BiometricService'
        );

        // 1. Validate the stored challenge
        const storedChallenge = await this.redisService.get(`biometric:challenge:${userId}`);
        if (!storedChallenge) {
            throw new AppException(
                'Challenge expired or not found',
                ErrorType.AUTHENTICATION,
                'BIO_005',
                {},
                HttpStatus.UNAUTHORIZED
            );
        }

        if (storedChallenge !== challenge) {
            throw new AppException(
                'Invalid challenge',
                ErrorType.AUTHENTICATION,
                'BIO_006',
                {},
                HttpStatus.UNAUTHORIZED
            );
        }

        // 2. Retrieve the device key
        const deviceKeyData = await this.redisService.get(`biometric:device:${deviceKeyId}`);
        if (!deviceKeyData) {
            throw new AppException(
                'Device key not found or expired',
                ErrorType.AUTHENTICATION,
                'BIO_007',
                {},
                HttpStatus.UNAUTHORIZED
            );
        }

        let deviceKey: BiometricDeviceKey;
        try {
            deviceKey = JSON.parse(deviceKeyData) as BiometricDeviceKey;
        } catch {
            throw new AppException('Corrupted device key data', ErrorType.TECHNICAL, 'BIO_008');
        }

        // 3. Verify the device key belongs to the requesting user
        if (deviceKey.userId !== userId) {
            this.logger.warn(`Device key ${deviceKeyId} does not belong to user ${userId}`, 'BiometricService');
            throw new AppException(
                'Device key does not belong to this user',
                ErrorType.AUTHENTICATION,
                'BIO_009',
                {},
                HttpStatus.UNAUTHORIZED
            );
        }

        // 4. Verify the cryptographic signature
        try {
            const verifier = crypto.createVerify('SHA256');
            verifier.update(challenge);
            verifier.end();

            const signatureBuffer = Buffer.from(signature, 'base64');
            const isValid = verifier.verify(deviceKey.publicKey, signatureBuffer);

            if (!isValid) {
                this.logger.warn(`Invalid biometric signature for user: ${userId}`, 'BiometricService');
                throw new AppException(
                    'Invalid biometric signature',
                    ErrorType.AUTHENTICATION,
                    'BIO_010',
                    {},
                    HttpStatus.UNAUTHORIZED
                );
            }
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }
            const { message, stack } = extractError(error);
            this.logger.error(`Signature verification failed: ${message}`, stack, 'BiometricService');
            throw new AppException(
                'Biometric signature verification failed',
                ErrorType.AUTHENTICATION,
                'BIO_011',
                {},
                HttpStatus.UNAUTHORIZED
            );
        }

        // 5. Consume the challenge (one-time use)
        await this.redisService.del(`biometric:challenge:${userId}`);

        // 6. Look up the user to build the JWT payload
        let user: BiometricUser | null;
        try {
            user = (await this.prisma.user.findUnique({
                where: { id: userId },
                include: { roles: true },
            })) as BiometricUser | null;
        } catch (error: unknown) {
            const { message, stack } = extractError(error);
            this.logger.error(`Failed to find user for biometric auth: ${message}`, stack, 'BiometricService');
            throw new AppException('Failed to retrieve user data', ErrorType.TECHNICAL, 'BIO_012', { userId });
        }

        if (!user) {
            throw new AppException('User not found', ErrorType.AUTHENTICATION, 'BIO_013', {}, HttpStatus.UNAUTHORIZED);
        }

        // 7. Generate JWT tokens
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles?.map((r) => r.name) || [],
        };

        const expiration = this.configService.get<string>('authService.jwt.accessTokenExpiration');
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('authService.jwt.secret'),
            expiresIn: expiration,
        });

        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshTtl = this.getRefreshTokenTtl();
        await this.redisService.set(`refresh:${refreshToken}`, userId, refreshTtl);

        this.logger.log(`Biometric authentication successful for user: ${userId}`, 'BiometricService');

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    /**
     * Parses the refresh token expiration config string (e.g. '7d') into seconds.
     * @returns TTL in seconds
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
}
