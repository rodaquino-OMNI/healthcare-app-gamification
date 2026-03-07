/**
 * Represents a treatment plan for a patient.
 * This entity is part of the Care Journey and allows tracking and display
 * of prescribed treatment plans as specified in the Care Now journey requirements.
 */
export class TreatmentPlan {
    /**
     * Unique identifier for the treatment plan.
     */
    id: string;

    /**
     * Name of the treatment plan.
     */
    name: string;

    /**
     * Description of the treatment plan.
     */
    description: string;

    /**
     * Start date of the treatment plan.
     */
    startDate: Date;

    /**
     * End date of the treatment plan.
     */
    endDate: Date;

    /**
     * Progress of the treatment plan (percentage from 0 to 100).
     */
    progress: number = 0;

    /**
     * Reference to the care activity this treatment plan is associated with.
     */
    careActivity: any;

    /**
     * Date and time when the treatment plan was created.
     */
    createdAt: Date;

    /**
     * Date and time when the treatment plan was last updated.
     */
    updatedAt: Date;
}
