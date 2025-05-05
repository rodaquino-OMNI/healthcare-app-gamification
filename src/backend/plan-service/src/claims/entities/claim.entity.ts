import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'; // v0.3.17
import { Document } from '../../documents/entities/document.entity';

/**
 * Represents an insurance claim in the database.
 * This entity is used for storing and tracking insurance claims submitted by users
 * in the Plan journey of the AUSTA SuperApp.
 */
@Entity()
export class Claim {
  /**
   * Unique identifier for the claim
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID of the user who submitted the claim
   */
  @Column()
  userId!: string;

  /**
   * ID of the plan this claim is associated with
   */
  @Column()
  planId!: string;

  /**
   * Type of claim (e.g., 'medical_visit', 'procedure', 'medication', 'exam')
   */
  @Column()
  type!: string;

  /**
   * Claim amount in the local currency (BRL)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  /**
   * Current status of the claim 
   * Possible values: 'draft', 'submitted', 'under_review', 'additional_info_required',
   * 'approved', 'denied', 'appealed', 'expired', 'processing', 'completed', 'cancelled'
   */
  @Column()
  status!: string;

  /**
   * Date when the claim was submitted
   */
  @CreateDateColumn()
  submittedAt!: Date;

  /**
   * Date when the claim was last processed or updated
   */
  @UpdateDateColumn()
  processedAt!: Date;

  /**
   * Relationship with the Plan entity
   * Note: Plan entity is referenced as a string to avoid circular dependencies
   */
  @ManyToOne('Plan')
  @JoinColumn({ name: 'planId' })
  plan!: any;

  /**
   * Documents associated with this claim (e.g., receipts, prescriptions)
   */
  @OneToMany(() => Document, (document) => document.entityId)
  documents!: Document[];
}