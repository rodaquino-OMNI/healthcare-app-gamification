import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service for handling Prisma database connections.
 * Manages the lifecycle of the Prisma client instance.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    /**
     * Constructor initializes the Prisma client with appropriate logging options
     * based on the environment.
     */
    constructor() {
        super({
            log:
                process.env.NODE_ENV === 'development'
                    ? ['query', 'info', 'warn', 'error']
                    : ['error'],
        });
    }

    /**
     * Connects to the database when the module initializes.
     */
    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    /**
     * Disconnects from the database when the module is destroyed.
     */
    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}
