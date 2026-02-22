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
export class Permission {
  /**
   * Unique identifier for the permission
   */
  id: number = 0;

  /**
   * Name of the permission in the format journey:resource:action
   * Examples: health:metrics:read, care:appointment:create, plan:claim:submit
   */
  name: string = '';

  /**
   * Human-readable description of what the permission allows
   */
  description: string = '';
}
