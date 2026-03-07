/* eslint-disable */
import { Controller, Get, Post, Delete, Body, Param, Req, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ConsentService } from './consent.service';
import { CreateConsentDto, ConsentType } from './dto/create-consent.dto';

interface AuthRequest {
    user?: { id?: string; sub?: string };
    ip?: string;
    headers?: Record<string, string>;
}

/**
 * Controller for LGPD consent management endpoints.
 *
 * Provides a REST API for users to:
 * - View their consent records
 * - Grant new consents
 * - Revoke specific consents
 * - Check active consent status for a given type
 *
 * All endpoints require JWT authentication.
 * The JwtAuthGuard is expected to be applied globally or per-route
 * by the consuming service module.
 */
@ApiTags('consents')
@ApiBearerAuth()
@Controller('api/consents')
export class ConsentController {
    constructor(private readonly consentService: ConsentService) {}

    @Get()
    @ApiOperation({ summary: 'List all consent records for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of consent records returned.' })
    async getUserConsents(@Req() req: AuthRequest): Promise<unknown> {
        const userId = req.user?.id || req.user?.sub;
        return this.consentService.getUserConsents(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Grant a new consent' })
    @ApiResponse({ status: 201, description: 'Consent record created.' })
    @ApiResponse({ status: 400, description: 'Invalid consent data.' })
    // eslint-disable-next-line max-len
    async createConsent(@Req() req: AuthRequest, @Body(ValidationPipe) dto: CreateConsentDto): Promise<unknown> {
        const userId = req.user?.id || req.user?.sub;
        const ip = req.ip || req.headers?.['x-forwarded-for'];
        const userAgent = req.headers?.['user-agent'];
        return this.consentService.createConsent(userId, dto, ip, userAgent);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Revoke a specific consent' })
    @ApiResponse({ status: 200, description: 'Consent revoked.' })
    @ApiResponse({ status: 404, description: 'Consent record not found.' })
    @ApiResponse({ status: 403, description: 'Cannot revoke consent belonging to another user.' })
    async revokeConsent(@Req() req: AuthRequest, @Param('id') id: string): Promise<unknown> {
        const userId = req.user?.id || req.user?.sub;
        return this.consentService.revokeConsent(userId, id);
    }

    @Get('check/:type')
    @ApiOperation({ summary: 'Check if user has active consent of a specific type' })
    @ApiResponse({ status: 200, description: 'Returns consent status.' })
    async hasActiveConsent(
        @Req() req: AuthRequest,
        @Param('type') type: string
    ): Promise<{ consentType: ConsentType; hasConsent: boolean }> {
        const userId = req.user?.id || req.user?.sub;
        const consentType = type as ConsentType;
        const hasConsent = await this.consentService.hasActiveConsent(userId, consentType);
        return { consentType, hasConsent };
    }
}
