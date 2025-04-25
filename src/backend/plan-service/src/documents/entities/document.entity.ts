import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from 'typeorm'; // v0.3.17

/**
 * Entity representing a document associated with a plan-related entity such as a claim.
 * Used for storing document metadata and file references for insurance claims.
 */
@Entity()
export class Document {
  /**
   * Unique identifier for the document
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID of the entity this document is associated with (e.g., claim ID)
   */
  @Column()
  entity_id: string;

  /**
   * Type of entity this document is associated with (e.g., 'claim', 'coverage')
   */
  @Column()
  entity_type: string;

  /**
   * Type of document (e.g., 'receipt', 'medical_report', 'prescription')
   */
  @Column()
  type: string;

  /**
   * Path to the file in storage (e.g., S3 path)
   */
  @Column()
  file_path: string;

  /**
   * Timestamp when the document was created
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Timestamp when the document was last updated
   */
  @UpdateDateColumn()
  updated_at: Date;
}