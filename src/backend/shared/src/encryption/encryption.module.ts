import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EncryptionService } from './encryption.service';

/**
 * Global module providing PHI field-level encryption capabilities.
 * Import once at the app root; EncryptionService is available everywhere.
 */
@Global()
@Module({
    imports: [ConfigModule],
    providers: [EncryptionService],
    exports: [EncryptionService],
})
export class EncryptionModule {}
