import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { Controller, Get, Delete, Patch, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { RectifyDataDto } from './dto/rectify-data.dto';
import { PrivacyService } from './privacy.service';

/**
 * Controller implementing LGPD Data Subject Rights endpoints (Art. 18).
 *
 * All endpoints are protected by JWT authentication.
 * Users can only access/modify/delete their own data.
 */
@Controller('api/privacy')
@UseGuards(JwtAuthGuard)
@ApiTags('privacy')
@ApiBearerAuth()
export class PrivacyController {
    constructor(private readonly privacyService: PrivacyService) {}

    /**
     * Art. 18-II - Right of access.
     * Returns all personal data held for the authenticated user.
     */
    @Get('my-data')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all personal data (LGPD Art. 18-II)',
        description:
            'Returns a structured object containing every piece of personal data stored for the authenticated user across all services.',
    })
    @ApiResponse({ status: 200, description: 'Personal data retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getMyData(@CurrentUser('id') userId: string): Promise<object> {
        return this.privacyService.getMyData(userId);
    }

    /**
     * Art. 18-V - Right to data portability.
     * Exports all user data as a FHIR R4 Bundle (type: collection).
     */
    @Get('export')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Export data as FHIR R4 Bundle (LGPD Art. 18-V)',
        description: 'Exports all user data in FHIR R4 Bundle format for interoperability and portability.',
    })
    @ApiResponse({ status: 200, description: 'FHIR Bundle generated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async exportData(@CurrentUser('id') userId: string): Promise<object> {
        return this.privacyService.exportAsFhirBundle(userId);
    }

    /**
     * Art. 18-VI - Right to erasure (right to be forgotten).
     * Deletes all personal data in dependency order within a transaction.
     */
    @Delete('my-data')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete all personal data (LGPD Art. 18-VI)',
        description: 'Permanently deletes all personal data for the authenticated user. This action is irreversible.',
    })
    @ApiResponse({
        status: 200,
        description: 'Data deleted successfully. Returns counts per model.',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteMyData(@CurrentUser('id') userId: string): Promise<{ deletedCounts: Record<string, number> }> {
        return this.privacyService.deleteMyData(userId);
    }

    /**
     * Art. 18-III - Right to rectification.
     * Allows the user to correct name, email, or phone.
     */
    @Patch('my-data')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Rectify personal data (LGPD Art. 18-III)',
        description:
            'Updates allowed personal fields (name, email, phone). CPF and password cannot be changed through this endpoint.',
    })
    @ApiResponse({ status: 200, description: 'Data rectified successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async rectifyMyData(@CurrentUser('id') userId: string, @Body() dto: RectifyDataDto): Promise<object> {
        return this.privacyService.rectifyMyData(userId, dto);
    }
}
