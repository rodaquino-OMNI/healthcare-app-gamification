import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { createEncryptionExtension, EncryptionService } from '../encryption';

/**
 * Service for handling Prisma database connections.
 * Manages the lifecycle of the Prisma client instance.
 * Attaches PHI encryption via Prisma $extends query hooks when EncryptionService
 * is available, returning an extended client that transparently encrypts/decrypts
 * PHI fields on every query (LGPD Art.46).
 *
 * All model delegates (user, plan, claim, etc.) are inherited from PrismaClient.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    /**
     * Extended Prisma client with PHI encryption query hooks.
     * Null when EncryptionService is not injected (e.g. in tests).
     */
    private _extendedClient: PrismaClient | null = null;

    /**
     * Returns the encryption-enabled client when available, or `this` as fallback.
     * Services handling PHI data should prefer this accessor.
     */
    get encrypted(): PrismaClient {
        return this._extendedClient ?? this;
    }

    /**
     * Constructor initializes the Prisma client with appropriate logging options
     * based on the environment. Optionally receives EncryptionService for PHI
     * field-level encryption via Prisma $extends query hooks.
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
     * Attaches PHI encryption query hooks via $extends if EncryptionService is available.
     */
    async onModuleInit(): Promise<void> {
        await this.$connect();

        if (this.encryptionService) {
            // PHI encryption via Prisma $extends query hooks (LGPD Art.46)
            this._extendedClient = this.$extends(
                createEncryptionExtension(this.encryptionService)
            ) as unknown as PrismaClient;
        }
    }

    /**
     * Disconnects from the database when the module is destroyed.
     */
    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}
