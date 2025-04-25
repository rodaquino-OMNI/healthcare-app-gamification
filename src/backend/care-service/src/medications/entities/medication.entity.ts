import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'; // version: latest

/**
 * Represents a medication entity in the database.
 * This entity is used for tracking medications as part of the Care Now journey.
 * It supports medication tracking with reminders and adherence monitoring.
 */
@Entity()
export class Medication {
  /**
   * Unique identifier for the medication
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID of the user who owns this medication record
   */
  @Column()
  userId: string;

  /**
   * Name of the medication
   */
  @Column()
  name: string;

  /**
   * Dosage amount (e.g., 500 for 500mg)
   */
  @Column('float')
  dosage: number;

  /**
   * Frequency of medication (e.g., "daily", "twice daily", "every 8 hours")
   */
  @Column()
  frequency: string;

  /**
   * Date when the medication regimen starts
   */
  @Column()
  startDate: Date;

  /**
   * Optional end date for the medication regimen
   */
  @Column({ nullable: true })
  endDate: Date;

  /**
   * Whether reminders are enabled for this medication
   */
  @Column({ default: true })
  reminderEnabled: boolean;

  /**
   * Any additional notes or instructions
   */
  @Column({ nullable: true })
  notes: string;

  /**
   * Whether the medication is currently active
   */
  @Column({ default: true })
  active: boolean;

  /**
   * Record creation timestamp
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Record update timestamp
   */
  @UpdateDateColumn()
  updatedAt: Date;
}