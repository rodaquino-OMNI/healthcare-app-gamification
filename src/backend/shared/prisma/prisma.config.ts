/**
 * Prisma 7.x Configuration
 *
 * datasource url is now managed here instead of in schema.prisma.
 * See: https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */

// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'prisma/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
    earlyAccess: true,
    schema: './schema.prisma',
});

/**
 * Runtime configuration helper.
 * Validates DATABASE_URL is set at startup.
 */
export function validateDatabaseConfig(): void {
    if (!process.env.DATABASE_URL) {
        throw new Error(
            'DATABASE_URL environment variable is required. ' +
                'Set it in .env or your deployment config.'
        );
    }
}

export const prismaConfig = {
    databaseUrl: process.env.DATABASE_URL,
} as const;
