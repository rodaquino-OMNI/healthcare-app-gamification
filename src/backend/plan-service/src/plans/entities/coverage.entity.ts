import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm'; // v0.3.17

/**
 * Represents insurance coverage details in the database.
 * This entity stores information about coverage types, details, limitations,
 * and co-payment for insurance plans in the AUSTA SuperApp.
 */
@Entity()
export class Coverage {
  /**
   * Unique identifier for the coverage
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Foreign key reference to the Plan entity
   */
  @Column()
  planId: string;

  /**
   * Type of coverage (e.g., medical, dental, vision, etc.)
   */
  @Column()
  type: string;

  /**
   * Detailed description of what is covered
   */
  @Column({ type: 'text' })
  details: string;

  /**
   * Description of any limitations or exclusions
   */
  @Column({ type: 'text', nullable: true })
  limitations: string;

  /**
   * Amount of co-payment required, if any
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coPayment: number;

  /**
   * Timestamp when the coverage record was created
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the coverage record was last updated
   */
  @UpdateDateColumn()
  updatedAt: Date;
}