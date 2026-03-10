import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import {
    Controller,
    Post,
    Body,
    UseFilters,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
    IntegrityService,
    IntegrityVerdict,
} from './integrity.service';

/** DTO for integrity verification requests from mobile clients. */
interface VerifyIntegrityDto {
    /** Attestation token from Play Integrity (Android) or App Attest (iOS). */
    token: string;
    /** Mobile platform: 'android' or 'ios'. */
    platform: string;
    /** Optional device identifier for audit logging. */
    deviceId?: string;
}

/** Response shape for integrity verification. */
interface VerifyIntegrityResponse {
    /** Whether the attestation passed verification. */
    verified: boolean;
    /** Human-readable verdict from the platform API. */
    verdict?: string;
}

/**
 * Controller for app integrity verification endpoints.
 *
 * Receives attestation tokens from mobile clients and verifies them
 * against Google Play Integrity API (Android) or Apple App Attest (iOS).
 *
 * MASVS-RESILIENCE-2: Server-side integrity verification.
 */
@ApiTags('integrity')
@Controller('auth/integrity')
@UseFilters(AllExceptionsFilter)
export class IntegrityController {
    constructor(private readonly integrityService: IntegrityService) {}

    /**
     * Verify an app integrity attestation token.
     *
     * @param dto Contains the attestation token, platform, and optional deviceId
     * @returns Verification result with verdict
     */
    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify app integrity attestation token' })
    @ApiResponse({
        status: 200,
        description: 'Integrity verification result',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request — missing token or platform',
    })
    @UsePipes(new ValidationPipe())
    async verify(
        @Body() dto: VerifyIntegrityDto,
    ): Promise<VerifyIntegrityResponse> {
        const result: IntegrityVerdict =
            await this.integrityService.verify(
                dto.token,
                dto.platform,
            );

        return {
            verified: result.verified,
            verdict: result.verdict,
        };
    }
}
