import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'; // typeorm latest

/**
 * Permission entity representing an individual action that users or roles can be
 * authorized to perform within the AUSTA SuperApp.
 * 
 * Permissions follow a hierarchical format: journey:resource:action
 * Examples:
 * - health:metrics:read - View health metrics
 * - care:appointment:create - Schedule appointments
 * - plan:claim:submit - Submit insurance claims
 */
@Entity()
export class Permission {
  /**
   * Unique identifier for the permission
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the permission in the format journey:resource:action
   * Examples: health:metrics:read, care:appointment:create, plan:claim:submit
   */
  @Column()
  name: string;

  /**
   * Human-readable description of what the permission allows
   */
  @Column()
  description: string;
}