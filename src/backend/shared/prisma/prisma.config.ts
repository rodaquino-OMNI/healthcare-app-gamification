/**
 * Prisma Configuration (Forward-compatible with Prisma 7.x)
 *
 * This file provides the defineConfig pattern that will be required in Prisma 7.x.
 * Currently serves as documentation and forward-compatibility preparation.
 *
 * When upgrading to Prisma 7.x:
 * 1. Remove env("DATABASE_URL") from schema.prisma datasource block
 * 2. Uncomment the defineConfig export below
 * 3. Run `npx prisma generate` to verify
 */

// Prisma 7.x configuration (uncomment when upgrading):
// import { defineConfig } from 'prisma/config';
// import { envField } from 'prisma/env';
//
// export default defineConfig({
//   earlyAccess: true,
//   datasource: {
//     url: envField('DATABASE_URL'),
//   },
// });

/**
 * Runtime configuration helper for current Prisma 5.x/6.x.
 * Validates DATABASE_URL is set at startup.
 */
export function validateDatabaseConfig(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is required. ' +
      'Set it in .env or your deployment configuration.'
    );
  }
}

export const prismaConfig = {
  databaseUrl: process.env.DATABASE_URL,
} as const;
