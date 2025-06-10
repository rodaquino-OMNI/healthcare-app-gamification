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
 * Status history item for tracking claim status changes
 */
export class StatusHistoryItem {
  status!: string;
  timestamp!: Date;
  note?: string;
  
  constructor(status: string, note?: string) {
    this.status = status;
    this.timestamp = new Date();
    if (note) this.note = note;
  }
}

/**
 * Enum for claim status values to ensure consistency
 */
export enum ClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  INFORMATION_REQUIRED = 'information_required',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

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
   * Uses values from the ClaimStatus enum
   */
  @Column()
  status!: string;

  /**
   * Date when the claim was submitted
   */
  @CreateDateColumn()
  submittedAt!: Date;

  /**
   * Date when the claim was approved
   */
  @Column({ nullable: true })
  approvedAt?: Date;

  /**
   * Date when the claim was rejected
   */
  @Column({ nullable: true })
  rejectedAt?: Date;

  /**
   * Date when the claim was paid
   */
  @Column({ nullable: true })
  paidAt?: Date;

  /**
   * Date when the claim was last processed or updated
   */
  @UpdateDateColumn()
  processedAt!: Date;

  /**
   * Procedure code related to the claim
   */
  @Column({ nullable: true })
  procedureCode?: string;

  /**
   * Diagnosis code related to the claim
   */
  @Column({ nullable: true })
  diagnosisCode?: string;

  /**
   * Service date for the claim
   */
  @Column({ nullable: true })
  serviceDate?: Date;

  /**
   * Provider name performing the service
   */
  @Column({ nullable: true })
  providerName?: string;

  /**
   * Provider tax ID
   */
  @Column({ nullable: true })
  providerTaxId?: string;

  /**
   * Procedure description
   */
  @Column({ nullable: true })
  procedureDescription?: string;

  /**
   * URL to the receipt document
   */
  @Column({ nullable: true })
  receiptUrl?: string;

  /**
   * Additional document URLs
   */
  @Column("simple-array", { nullable: true })
  additionalDocumentUrls?: string[];

  /**
   * History of status changes
   */
  @Column("json", { nullable: true })
  statusHistory?: StatusHistoryItem[];

  /**
   * Notes about the claim
   */
  @Column({ nullable: true })
  notes?: string;

  /**
   * Date when the entity was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Date when the entity was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

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