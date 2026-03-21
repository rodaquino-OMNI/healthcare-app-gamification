/**
 * Health API Barrel
 *
 * Re-exports all types and functions from domain sub-modules so that
 * existing imports like `from '../api/health'` or `from '@/api/health'`
 * continue to resolve correctly via health/index.ts.
 */

export * from './health-metrics';
export * from './health-records';
export * from './health-goals';
export * from './health-devices';
