/**
 * GraphQL fragments for the Plan journey, defining reusable field selections
 * for Plan, Coverage, Claim, and Benefit entities to optimize data fetching
 * across queries and mutations.
 */

import { gql } from '@apollo/client'; // v3.7.17

/**
 * Fragment for Coverage entity with essential fields
 */
export const CoverageFragment = gql`
  fragment CoverageFragment on Coverage {
    id
    planId
    type
    details
    limitations
    coPayment
  }
`;

/**
 * Fragment for Benefit entity with essential fields
 */
export const BenefitFragment = gql`
  fragment BenefitFragment on Benefit {
    id
    planId
    type
    description
    limitations
    usage
  }
`;

/**
 * Fragment for Claim entity with essential fields
 */
export const ClaimFragment = gql`
  fragment ClaimFragment on Claim {
    id
    planId
    type
    amount
    status
    submittedAt
  }
`;

/**
 * Fragment for Plan entity, including nested coverages, benefits, and claims
 * using their respective fragments for consistent data fetching
 */
export const PlanFragment = gql`
  fragment PlanFragment on Plan {
    id
    userId
    planNumber
    type
    validityStart
    validityEnd
    coverageDetails
    coverages {
      ...CoverageFragment
    }
    benefits {
      ...BenefitFragment
    }
    claims {
      ...ClaimFragment
    }
  }
  ${CoverageFragment}
  ${BenefitFragment}
  ${ClaimFragment}
`;