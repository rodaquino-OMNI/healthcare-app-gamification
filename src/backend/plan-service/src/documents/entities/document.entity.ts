/**
 * Represents a document.
 * This entity is used for storing document metadata for various entities
 * like claims, medical history records, etc.
 * Field names match Prisma's camelCase convention.
 */
export class Document {
  /**
   * Unique identifier for the document
   */
  id!: string;

  /**
   * ID of the entity this document is associated with
   */
  entityId!: string;

  /**
   * Type of entity this document is associated with
   * (e.g., 'claim', 'medical_record', etc.)
   */
  entityType!: string;

  /**
   * Type of document
   * (e.g., 'receipt', 'prescription', 'lab_result', etc.)
   */
  type!: string;

  /**
   * Path to the file in storage
   */
  filePath!: string;

  /**
   * Date when the document was created
   */
  createdAt!: Date;

  /**
   * Date when the document was last updated
   */
  updatedAt!: Date;
}
