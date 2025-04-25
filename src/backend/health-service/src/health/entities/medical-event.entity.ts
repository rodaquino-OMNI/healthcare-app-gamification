import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'; // typeorm@0.3.17

/**
 * Represents a medical event in a user's health history.
 * 
 * This entity stores events such as doctor visits, diagnoses, procedures, and treatments,
 * providing a chronological view of a user's medical history as required by F-101-RQ-002.
 */
@Entity('medical_events', {
  indices: [
    { columns: ['recordId', 'type'] }
  ]
})
export class MedicalEvent {
  /**
   * Unique identifier for the medical event.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Reference to the health record this event belongs to.
   */
  @Column({ type: 'uuid', nullable: false })
  recordId: string;

  /**
   * The type of medical event (e.g., 'visit', 'diagnosis', 'procedure', 'medication').
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  /**
   * Detailed description of the medical event.
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Date when the medical event occurred.
   */
  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  /**
   * Healthcare provider associated with this medical event.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  provider: string;

  /**
   * References to documents associated with this medical event (e.g., medical reports, images).
   */
  @Column({ type: 'jsonb', nullable: true })
  documents: string[];

  /**
   * Timestamp when the record was created.
   */
  @Column({ type: 'timestamp', default: () => 'now()', nullable: false })
  createdAt: Date;

  /**
   * Timestamp when the record was last updated.
   */
  @Column({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', nullable: false })
  updatedAt: Date;

  /**
   * Creates a new MedicalEvent instance.
   * @param partial Optional partial properties to initialize the instance with.
   */
  constructor(partial?: Partial<MedicalEvent>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}