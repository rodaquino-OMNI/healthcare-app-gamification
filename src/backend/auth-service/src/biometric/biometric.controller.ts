import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    UseGuards,
    UseFilters,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BiometricService } from './biometric.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * DTO for biometric device registration request.
 */
interface RegisterDeviceDto {
    userId: string;
    publicKey: string;
    deviceId: string;
    platform: string;
}

/**
 * DTO for biometric signature verification request.
 */
interface VerifySignatureDto {
    userId: string;
    signature: string;
    challenge: string;
    deviceKeyId: string;
}

/** Result of biometric device registration. */
interface RegisterResult {
    success: boolean;
    deviceKeyId: string;
}

/** Result of biometric challenge generation. */
interface ChallengeResult {
    challenge: string;
    expiresIn: number;
}

/** JWT tokens returned after biometric auth. */
interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

/**
 * Controller for biometric authentication endpoints.
 * Handles device registration, challenge generation, and signature verification.
 */
@ApiTags('biometric')
@Controller('auth/biometric')
@UseFilters(AllExceptionsFilter)
export class BiometricController {
    /**
     * Initializes the BiometricController.
     * @param biometricService Service for biometric authentication operations
     */
    constructor(private biometricService: BiometricService) {}

    /**
     * Registers a biometric device key for the authenticated user.
     * Requires JWT authentication since the user must be logged in to register a device.
     * @param body Registration payload containing userId, publicKey, deviceId, and platform
     * @returns Object with success status and the generated deviceKeyId
     */
    @UseGuards(JwtAuthGuard)
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a biometric device key' })
    @ApiResponse({ status: 201, description: 'Biometric device registered successfully' })
    @ApiResponse({ status: 401, description: 'Authentication required' })
    @UsePipes(new ValidationPipe())
    async register(@Body() body: RegisterDeviceDto): Promise<RegisterResult> {
        const { userId, publicKey, deviceId, platform } = body;
        return this.biometricService.registerDevice(userId, publicKey, deviceId, platform);
    }

    /**
     * Generates a cryptographic challenge for biometric verification.
     * This endpoint does NOT require JWT since it is part of the login flow.
     * @param userId The user ID requesting the challenge
     * @returns Object containing the challenge nonce and its TTL
     */
    @Get('challenge')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a biometric authentication challenge' })
    @ApiResponse({ status: 200, description: 'Challenge generated successfully' })
    async challenge(@Query('userId') userId: string): Promise<ChallengeResult> {
        return this.biometricService.generateChallenge(userId);
    }

    /**
     * Verifies a biometric signature and returns JWT tokens on success.
     * This endpoint does NOT require JWT since it IS the login mechanism.
     * @param body Verification payload containing userId, signature, challenge, and deviceKeyId
     * @returns JWT access and refresh tokens on successful verification
     */
    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify biometric signature and authenticate' })
    @ApiResponse({
        status: 200,
        description: 'Biometric verification successful, returns JWT tokens',
    })
    @ApiResponse({ status: 401, description: 'Invalid signature or expired challenge' })
    @UsePipes(new ValidationPipe())
    async verify(@Body() body: VerifySignatureDto): Promise<AuthTokens> {
        const { userId, signature, challenge, deviceKeyId } = body;
        return this.biometricService.verifySignature(userId, signature, challenge, deviceKeyId);
    }
}
