import { Plan } from './plan.entity';

/**
 * Represents a benefit associated with an insurance plan.
 * This entity stores information about extra benefits provided by a plan,
 * such as wellness programs, discounts, or special services.
 */
export class Benefit {
  /**
   * Unique identifier for the benefit
   */
  id!: string;

  /**
   * ID of the plan this benefit is associated with
   */
  planId!: string;

  /**
   * Type of benefit (e.g., 'wellness_program', 'discount', 'telemedicine')
   */
  type!: string;

  /**
   * Detailed description of the benefit
   */
  description!: string;

  /**
   * Limitations or conditions for using the benefit
   */
  limitations!: string;

  /**
   * Current usage status of the benefit (e.g., 'available', 'used')
   */
  usage!: string;

  /**
   * Relationship to the Plan entity
   */
  plan!: Plan;
}
