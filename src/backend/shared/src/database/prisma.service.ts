import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { EncryptionService } from '../encryption';

/**
 * Service for handling Prisma database connections.
 * Manages the lifecycle of the Prisma client instance.
 * Attaches PHI encryption middleware when EncryptionService is available.
 *
 * All model delegates (user, plan, claim, etc.) are inherited from PrismaClient.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    /**
     * Constructor initializes the Prisma client with appropriate logging options
     * based on the environment. Optionally receives EncryptionService for PHI
     * field-level encryption via Prisma middleware.
     */
    constructor(@Optional() private encryptionService?: EncryptionService) {
        super({
            log:
                process.env.NODE_ENV === 'development'
                    ? ['query', 'info', 'warn', 'error']
                    : ['error'],
        });
    }

    /**
     * Connects to the database when the module initializes.
     * Attaches PHI encryption middleware if EncryptionService is available.
     */
    async onModuleInit(): Promise<void> {
        if (this.encryptionService) {
            // Disabled: $use was removed in Prisma 7.x — see prisma-encryption.middleware.ts
            // for the pending migration to the $extends query extension (AUSTA-200).
            // this.$use(createEncryptionMiddleware(this.encryptionService));
        }
        await this.$connect();
    }

    /**
     * Disconnects from the database when the module is destroyed.
     */
    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}
