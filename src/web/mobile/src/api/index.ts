/**
 * API barrel file
 *
 * Re-exports all API modules and provides a unified api object
 * for components that consume multiple API services.
 */

import { restClient, graphQLClient } from './client';

/**
 * Unified API client object for convenience
 */
export const api = {
  rest: restClient,
  graphql: graphQLClient,
};

export { graphQLClient, restClient } from './client';
export * from './auth';
export * from './health';
export * from './care';
export * from './plan';
export * from './gamification';
export * from './notifications';
export * from './wellness';
