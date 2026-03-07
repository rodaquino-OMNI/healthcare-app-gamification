import { Plan } from './plan.entity';

/**
 * Represents specific coverage details for an insurance plan.
 * This entity stores detailed information about what is covered by a plan,
 * including coverage type, details, limitations, and co-payment requirements.
 */
export class Coverage {
    /**
     * Unique identifier for the coverage record
     */
    id!: string;

    /**
     * ID of the plan this coverage is associated with
     */
    planId!: string;

    /**
     * Type of coverage (e.g., 'medical', 'dental', 'vision', 'prescription')
     */
    type!: string;

    /**
     * Detailed description of what is covered
     */
    details!: string;

    /**
     * Limitations or exclusions for this coverage
     */
    limitations!: string;

    /**
     * Co-payment amount required for this coverage
     */
    coPayment: number = 0;

    /**
     * Timestamp when the coverage record was created
     */
    createdAt!: Date;

    /**
     * Timestamp when the coverage record was last updated
     */
    updatedAt!: Date;

    /**
     * Relationship to the Plan entity
     */
    plan!: Plan;
}
