import { Module } from '@nestjs/common';

import { ConsentController } from './consent.controller';
import { ConsentGuard } from './consent.guard';
import { ConsentService } from './consent.service';
import { PrismaService } from '../database/prisma.service';

/**
 * Module for LGPD consent management.
 *
 * Provides:
 * - ConsentService: CRUD operations for consent records
 * - ConsentGuard: Route guard that enforces consent requirements
 * - ConsentController: REST API endpoints for consent management
 *
 * Export ConsentService and ConsentGuard so other modules can:
 * - Check consent status programmatically
 * - Apply @RequireConsent() + ConsentGuard to protected routes
 */
@Module({
    controllers: [ConsentController],
    providers: [ConsentService, ConsentGuard, PrismaService],
    exports: [ConsentService, ConsentGuard],
})
export class ConsentModule {}
