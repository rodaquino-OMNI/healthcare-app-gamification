import { Module } from '@nestjs/common';

import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';
import { PrismaService } from '../database/prisma.service';

/**
 * Module providing LGPD Data Subject Rights (Art. 18) endpoints.
 *
 * Exports PrivacyService so other modules can programmatically
 * invoke DSR operations (e.g., scheduled anonymisation jobs).
 */
@Module({
    controllers: [PrivacyController],
    providers: [PrismaService, PrivacyService],
    exports: [PrivacyService],
})
export class PrivacyModule {}
