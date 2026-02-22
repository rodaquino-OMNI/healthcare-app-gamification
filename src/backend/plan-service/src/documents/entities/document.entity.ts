/**
 * Represents a document.
 * This entity is used for storing document metadata for various entities
 * like claims, medical history records, etc.
 */
export class Document {
  /**
   * Unique identifier for the document
   */
  id!: string;

  /**
   * ID of the entity this document is associated with
   */
  entity_id!: string;

  /**
   * Type of entity this document is associated with
   * (e.g., 'claim', 'medical_record', etc.)
   */
  entity_type!: string;

  /**
   * Type of document
   * (e.g., 'receipt', 'prescription', 'lab_result', etc.)
   */
  type!: string;

  /**
   * Path to the file in storage
   */
  file_path!: string;

  /**
   * Date when the document was created
   */
  created_at!: Date;

  /**
   * Date when the document was last updated
   */
  updated_at!: Date;

  /**
   * Convenience property to get the entity ID
   * This is used by relationships in other entities
   */
  get entityId(): string {
    return this.entity_id;
  }
}
