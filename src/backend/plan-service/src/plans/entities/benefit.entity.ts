import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm'; // v0.3.17
import { Plan } from './plan.entity';

/**
 * Represents a benefit available under an insurance plan.
 * This entity stores information about benefit types, descriptions,
 * limitations, and usage details in the AUSTA SuperApp.
 */
@Entity()
export class Benefit {
  /**
   * Unique identifier for the benefit
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Foreign key reference to the Plan entity
   */
  @Column()
  planId: string;

  /**
   * Type of benefit (e.g., gym membership, wellness program, etc.)
   */
  @Column()
  type: string;

  /**
   * Detailed description of the benefit
   */
  @Column()
  description: string;

  /**
   * Description of any limitations or restrictions on the benefit
   */
  @Column({ nullable: true })
  limitations: string;

  /**
   * Information about how the benefit can be used or redeemed
   */
  @Column({ nullable: true })
  usage: string;

  /**
   * Related plan that offers this benefit
   */
  @ManyToOne(() => Plan, (plan) => plan.benefits)
  @JoinColumn({ name: 'planId' })
  plan: Plan;
}