/**
 * InsuranceCard component module
 *
 * This module exports the InsuranceCard component and related types for the Plan journey
 * of the AUSTA SuperApp. The InsuranceCard component provides a digital representation
 * of a user's insurance card with plan and member details.
 */

// Import component, types, and styled components from implementation files
import { InsuranceCard, type InsuranceCardProps } from './InsuranceCard';
import {
    InsuranceCardContainer,
    InsuranceCardHeader,
    InsuranceCardBody,
    InsuranceCardFooter,
} from './InsuranceCard.styles';

// Re-export component and styled components
export { InsuranceCard, InsuranceCardContainer, InsuranceCardHeader, InsuranceCardBody, InsuranceCardFooter };

// Re-export types
export type { InsuranceCardProps };

// Export default component for convenience
export default InsuranceCard;
