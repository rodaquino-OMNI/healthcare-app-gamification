/**
 * GraphQL Resolvers Aggregator
 *
 * This file exports all resolver classes for the API Gateway.
 * The resolvers are organized by domain and handle the GraphQL operations.
 */

import { AuthResolvers } from './auth.resolvers';
import { CareResolvers } from './care.resolvers';
import { GamificationResolvers } from './gamification.resolvers';
import { HealthResolvers } from './health.resolvers';
import { PlanResolvers } from './plan.resolvers';

/**
 * Array of all resolver classes to be registered with the GraphQL module.
 * Each resolver handles a specific domain of the application.
 */
export const resolvers = [
    AuthResolvers,
    HealthResolvers,
    CareResolvers,
    PlanResolvers,
    GamificationResolvers,
];

export default resolvers;
