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

// import { defineConfig } from 'prisma/config';
// import { envField } from 'prisma/env';
//
// export default defineConfig({
//   earlyAccess: true,
//   datasource: {
//     url: envField('DATABASE_URL'),
//   },
// });

// Current Prisma version uses env() in schema.prisma (Prisma 5.x/6.x compatible)
export {};
