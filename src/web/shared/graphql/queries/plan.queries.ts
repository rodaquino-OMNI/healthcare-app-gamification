/**
 * @file Plan Queries
 * @description Defines GraphQL queries for the Plan journey, including queries for retrieving
 * plan details, claims, and related information. These queries are used by the frontend to fetch
 * data from the backend.
 */

import { gql } from '@apollo/client'; // v3.7.17

import { PlanFragment, ClaimFragment } from '../fragments/plan.fragments';

/**
 * GraphQL query to retrieve a specific plan by ID
 */
export const GET_PLAN = gql`
    query GetPlan($planId: ID!) {
        getPlan(planId: $planId) {
            ...PlanFragment
        }
    }
    ${PlanFragment}
`;

/**
 * GraphQL query to retrieve claims for a specific plan
 * Optionally filtered by claim status
 */
export const GET_CLAIMS = gql`
    query GetClaims($planId: ID!, $status: ClaimStatus) {
        getClaims(planId: $planId, status: $status) {
            ...ClaimFragment
        }
    }
    ${ClaimFragment}
`;
