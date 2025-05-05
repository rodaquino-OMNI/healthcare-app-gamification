import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm'; // v0.3.17
import { Coverage } from './coverage.entity';

// Define a constant for journey IDs as a temporary fix
const JOURNEY_IDS = {
  HEALTH: 'health',
  CARE: 'care',
  PLAN: 'plan'
};

/**
 * Represents an insurance plan in the database.
 * This entity stores information about insurance plans including plan number,
 * type, validity dates, and coverage details for the AUSTA SuperApp.
 */
@Entity()
export class Plan {
  /**
   * Unique identifier for the plan
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * User ID associated with this plan
   */
  @Column()
  userId!: string;

  /**
   * Insurance plan number or identifier
   */
  @Column()
  planNumber!: string;

  /**
   * Type of insurance plan (e.g., individual, family, corporate)
   */
  @Column()
  type!: string;

  /**
   * Date when the plan becomes valid
   */
  @Column()
  validityStart!: Date;

  /**
   * Date when the plan validity ends
   */
  @Column()
  validityEnd!: Date;

  /**
   * Detailed coverage information stored as JSON
   * Contains high-level overview of plan coverage that can be displayed on cards
   */
  @Column({ type: 'jsonb', nullable: true })
  coverageDetails!: object;

  /**
   * Journey identifier, defaults to the PLAN journey
   */
  @Column({ default: JOURNEY_IDS.PLAN })
  journey!: string;

  /**
   * Timestamp when the plan record was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Timestamp when the plan record was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Related coverage details
   * One plan can have multiple coverage types (medical, dental, vision, etc.)
   */
  @OneToMany(() => Coverage, (coverage) => coverage.planId)
  coverages!: Coverage[];

  /**
   * Related benefits
   * Using Type function for lazy-loading
   */
  @OneToMany('Benefit', 'plan')
  benefits!: any[];

  /**
   * Related claims
   * Using Type function for lazy-loading
   */
  @OneToMany('Claim', 'plan')
  claims!: any[];
}