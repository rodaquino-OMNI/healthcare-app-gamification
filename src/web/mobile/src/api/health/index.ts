/**
 * Health API barrel — re-exports all domain modules so existing imports
 * like `from '../api/health'` or `from '@api/health'` continue to work.
 */

export * from './health-metrics';
export * from './health-records';
export * from './health-goals';
export * from './health-wellness';
export * from './health-devices';
