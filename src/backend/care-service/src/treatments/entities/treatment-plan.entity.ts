import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CareActivity } from '../../care-activities/entities/care-activity.entity';

/**
 * Represents a treatment plan for a patient.
 * This entity is part of the Care Journey and allows tracking and display
 * of prescribed treatment plans as specified in the Care Now journey requirements.
 */
@Entity()
export class TreatmentPlan {
  /**
   * Unique identifier for the treatment plan.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of the treatment plan.
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Description of the treatment plan.
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Start date of the treatment plan.
   */
  @Column({ type: 'timestamp' })
  startDate: Date;

  /**
   * End date of the treatment plan.
   */
  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  /**
   * Progress of the treatment plan (percentage from 0 to 100).
   */
  @Column({ type: 'float', default: 0 })
  progress: number;

  /**
   * Reference to the care activity this treatment plan is associated with.
   */
  @ManyToOne(() => CareActivity, { onDelete: 'CASCADE' })
  careActivity: CareActivity;

  /**
   * Date and time when the treatment plan was created.
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Date and time when the treatment plan was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}