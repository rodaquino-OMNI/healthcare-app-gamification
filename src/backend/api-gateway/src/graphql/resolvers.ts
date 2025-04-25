/**
 * GraphQL Resolvers Aggregator
 * 
 * This file dynamically imports resolvers from various feature areas and combines
 * them into a single object for the API Gateway. It helps avoid circular dependency
 * issues by keeping resolvers modular and domain-specific.
 */
import { merge } from 'lodash'; // lodash 4.17.21
import { AuthService } from '@healthcare/auth-service'; // @healthcare/auth-service 1.0.0
import { HealthService } from '@healthcare/health-service'; // @healthcare/health-service 1.0.0
import { AppointmentsService } from '@healthcare/care-service'; // @healthcare/care-service 1.0.0
import { ClaimsService } from '@healthcare/plan-service'; // @healthcare/plan-service 1.0.0

// Initialize service instances
const authService = new AuthService();
const healthService = new HealthService();
const appointmentsService = new AppointmentsService();
const claimsService = new ClaimsService();

// Import resolvers from different domains
// Each module exports resolver functions for its specific domain
import { authResolvers } from './resolvers/auth';
import { healthResolvers } from './resolvers/health';
import { careResolvers } from './resolvers/care';
import { planResolvers } from './resolvers/plan';
import { gamificationResolvers } from './resolvers/gamification';

// Use the service instances to initialize any resolvers that need them
// Some resolvers may be initialized with their respective service instances
// while others might access services through the context
const authResolverMap = authResolvers(authService);
const healthResolverMap = healthResolvers(healthService);
const careResolverMap = careResolvers(appointmentsService);
const planResolverMap = planResolvers(claimsService);

// Merge all resolvers into a single object to ensure no conflicts
// This creates a unified resolver map that covers all GraphQL types
const combinedResolvers = merge(
  {},
  authResolverMap,
  healthResolverMap,
  careResolverMap,
  planResolverMap,
  gamificationResolvers
);

// Export the resolver array
// Apollo Server accepts an array of resolver objects that it merges internally
export const resolvers = [combinedResolvers];