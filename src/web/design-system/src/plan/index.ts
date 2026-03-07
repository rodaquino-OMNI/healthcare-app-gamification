/**
 * Barrel file for Plan journey components
 * Exports all components related to the Plan journey within the design system,
 * providing a centralized access point for Plan-related UI elements.
 *
 * This simplifies imports for consumers of the design system:
 * import { BenefitCard, ClaimCard } from 'design-system/plan';
 */

import { BenefitCard } from './BenefitCard/BenefitCard';
import { ClaimCard } from './ClaimCard/ClaimCard';
import { CoverageInfoCard } from './CoverageInfoCard/CoverageInfoCard';
import { InsuranceCard } from './InsuranceCard/InsuranceCard';

export { BenefitCard, ClaimCard, CoverageInfoCard, InsuranceCard };
