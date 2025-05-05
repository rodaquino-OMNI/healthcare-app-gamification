/**
 * Base filter data transfer object.
 * Used for filtering entities in repository queries.
 */
export class FilterDto {
  /**
   * Optional filter conditions as key-value pairs.
   * Each key represents a field name and the value represents the filter condition.
   */
  [key: string]: any;
}