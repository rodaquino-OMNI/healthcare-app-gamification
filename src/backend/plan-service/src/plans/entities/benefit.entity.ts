import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Plan } from './plan.entity';

/**
 * Represents a benefit associated with an insurance plan.
 * This entity stores information about extra benefits provided by a plan,
 * such as wellness programs, discounts, or special services.
 */
@Entity()
export class Benefit {
  /**
   * Unique identifier for the benefit
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID of the plan this benefit is associated with
   */
  @Column()
  planId!: string;

  /**
   * Type of benefit (e.g., 'wellness_program', 'discount', 'telemedicine')
   */
  @Column()
  type!: string;

  /**
   * Detailed description of the benefit
   */
  @Column({ type: 'text' })
  description!: string;

  /**
   * Limitations or conditions for using the benefit
   */
  @Column({ type: 'text', nullable: true })
  limitations!: string;

  /**
   * Current usage status of the benefit (e.g., 'available', 'used')
   */
  @Column({ nullable: true })
  usage!: string;

  /**
   * Relationship to the Plan entity
   */
  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'planId' })
  plan!: Plan;
}