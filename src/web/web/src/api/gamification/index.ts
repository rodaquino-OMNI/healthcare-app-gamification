/**
 * Gamification API barrel export
 *
 * Re-exports all types and functions from the gamification domain modules.
 */

export * from './gamification-achievements';
export * from './gamification-challenges';

// Default export aggregating all functions for backwards compatibility
export { default } from './gamification-default';
