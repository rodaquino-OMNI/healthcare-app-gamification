import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Plan } from './plan.entity';

/**
 * Represents specific coverage details for an insurance plan.
 * This entity stores detailed information about what is covered by a plan,
 * including coverage type, details, limitations, and co-payment requirements.
 */
@Entity()
export class Coverage {
  /**
   * Unique identifier for the coverage record
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID of the plan this coverage is associated with
   */
  @Column()
  planId!: string;

  /**
   * Type of coverage (e.g., 'medical', 'dental', 'vision', 'prescription')
   */
  @Column()
  type!: string;

  /**
   * Detailed description of what is covered
   */
  @Column({ type: 'text' })
  details!: string;

  /**
   * Limitations or exclusions for this coverage
   */
  @Column({ type: 'text', nullable: true })
  limitations!: string;

  /**
   * Co-payment amount required for this coverage
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  coPayment!: number;

  /**
   * Timestamp when the coverage record was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Timestamp when the coverage record was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Relationship to the Plan entity
   */
  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'planId' })
  plan!: Plan;
}