import { Coverage } from './coverage.entity';

// Define a constant for journey IDs as a temporary fix
const JOURNEY_IDS = {
    HEALTH: 'health',
    CARE: 'care',
    PLAN: 'plan',
};

/**
 * Represents an insurance plan.
 * This entity stores information about insurance plans including plan number,
 * type, validity dates, and coverage details for the AUSTA SuperApp.
 */
export class Plan {
    /**
     * Unique identifier for the plan
     */
    id!: string;

    /**
     * User ID associated with this plan
     */
    userId!: string;

    /**
     * Insurance plan number or identifier
     */
    planNumber!: string;

    /**
     * Type of insurance plan (e.g., individual, family, corporate)
     */
    type!: string;

    /**
     * Date when the plan becomes valid
     */
    validityStart!: Date;

    /**
     * Date when the plan validity ends
     */
    validityEnd!: Date;

    /**
     * Detailed coverage information stored as JSON
     * Contains high-level overview of plan coverage that can be displayed on cards
     */
    coverageDetails!: object;

    /**
     * Journey identifier, defaults to the PLAN journey
     */
    journey: string = JOURNEY_IDS.PLAN;

    /**
     * Timestamp when the plan record was created
     */
    createdAt!: Date;

    /**
     * Timestamp when the plan record was last updated
     */
    updatedAt!: Date;

    /**
     * Related coverage details
     * One plan can have multiple coverage types (medical, dental, vision, etc.)
     */
    coverages!: Coverage[];

    /**
     * Related benefits
     */
    benefits!: any[];

    /**
     * Related claims
     */
    claims!: any[];
}
