/**
 * Represents a medical event recorded for a user.
 * This entity stores information about medical events such as doctor visits,
 * procedures, diagnoses, and other significant health occurrences.
 */
export class MedicalEvent {
  /**
   * Unique identifier for the medical event
   */
  id!: string;
  
  /**
   * ID of the user this event belongs to
   */
  userId!: string;
  
  /**
   * Type of medical event (e.g., 'DOCTOR_VISIT', 'DIAGNOSIS', etc.)
   */
  type!: string;
  
  /**
   * Title or brief description of the event
   */
  title!: string;
  
  /**
   * Detailed description of the medical event
   */
  description!: string;
  
  /**
   * Healthcare provider associated with the event
   */
  provider?: string;
  
  /**
   * Location where the event occurred
   */
  location?: string;
  
  /**
   * Date when the event occurred
   */
  date!: Date;
  
  /**
   * List of related document IDs or URLs
   */
  documents?: string[];
  
  /**
   * Custom tags for categorization
   */
  tags?: string[];
  
  /**
   * Created timestamp
   */
  createdAt!: Date;
  
  /**
   * Last updated timestamp
   */
  updatedAt!: Date;
}