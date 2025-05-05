import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

/**
 * Represents a document in the database.
 * This entity is used for storing document metadata for various entities
 * like claims, medical history records, etc.
 */
@Entity()
export class Document {
  /**
   * Unique identifier for the document
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID of the entity this document is associated with
   */
  @Column()
  entity_id!: string;

  /**
   * Type of entity this document is associated with
   * (e.g., 'claim', 'medical_record', etc.)
   */
  @Column()
  entity_type!: string;

  /**
   * Type of document
   * (e.g., 'receipt', 'prescription', 'lab_result', etc.)
   */
  @Column()
  type!: string;

  /**
   * Path to the file in storage
   */
  @Column()
  file_path!: string;

  /**
   * Date when the document was created
   */
  @CreateDateColumn()
  created_at!: Date;

  /**
   * Date when the document was last updated
   */
  @UpdateDateColumn()
  updated_at!: Date;

  /**
   * Convenience property to get the entity ID
   * This is used by relationships in other entities
   */
  get entityId(): string {
    return this.entity_id;
  }
}