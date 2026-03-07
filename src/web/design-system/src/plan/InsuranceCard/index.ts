/**
 * InsuranceCard component module
 *
 * This module exports the InsuranceCard component and related types for the Plan journey
 * of the AUSTA SuperApp. The InsuranceCard component provides a digital representation
 * of a user's insurance card with plan and member details.
 */

// Import component and types from implementation file
import { InsuranceCard, InsuranceCardProps } from './InsuranceCard';

// Import styled components
import {
    InsuranceCardContainer,
    InsuranceCardHeader,
    InsuranceCardBody,
    InsuranceCardFooter,
} from './InsuranceCard.styles';

// Re-export component and types
export {
    InsuranceCard,
    InsuranceCardProps,
    InsuranceCardContainer,
    InsuranceCardHeader,
    InsuranceCardBody,
    InsuranceCardFooter,
};

// Export default component for convenience
export default InsuranceCard;
