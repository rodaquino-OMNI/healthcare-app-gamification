import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'; // v0.3.17
import { IsString, IsNotEmpty, IsJSON } from 'class-validator'; // v0.14.1

/**
 * Represents a rule that determines how points and achievements are awarded based on user actions.
 * 
 * Rules consist of:
 * - An event type to listen for (e.g., "STEPS_RECORDED", "APPOINTMENT_COMPLETED")
 * - A condition that determines if the rule should be triggered
 * - Actions to perform when the rule is triggered (award points, progress achievements, etc.)
 */
@Entity()
export class Rule {
  /**
   * Unique identifier for the rule
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The event type that this rule listens for
   * Examples: "STEPS_RECORDED", "APPOINTMENT_COMPLETED", "CLAIM_SUBMITTED"
   */
  @Column()
  @IsString()
  @IsNotEmpty()
  event: string;

  /**
   * A javascript string that represents the condition to be met for the rule to trigger
   * This condition will be evaluated at runtime with the event data
   * Example: "event.data.steps >= 10000" or "event.data.appointmentType === 'TELEMEDICINE'"
   */
  @Column()
  @IsString()
  condition: string;

  /**
   * A JSON array of actions to be performed when the rule is triggered
   * Examples of actions:
   * [
   *   { "type": "AWARD_XP", "value": 50 },
   *   { "type": "PROGRESS_ACHIEVEMENT", "achievementId": "active-lifestyle", "value": 1 }
   * ]
   */
  @Column({ type: 'jsonb' })
  @IsJSON()
  actions: string;
}