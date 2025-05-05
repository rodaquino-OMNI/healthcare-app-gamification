/**
 * Pagination request data transfer object.
 * Used for paginating results in repository queries.
 */
export class PaginationDto {
  /**
   * The page number (1-based).
   * @default 1
   */
  page: number = 1;

  /**
   * The number of items per page.
   * @default 10
   */
  limit: number = 10;
}

/**
 * Paginated response data transfer object.
 * Used for returning paginated results.
 */
export class PaginatedResponse<T> {
  /**
   * The items for the current page.
   */
  items: T[] = [];

  /**
   * The total number of items across all pages.
   */
  total: number = 0;

  /**
   * The current page number.
   */
  page: number = 1;

  /**
   * The number of items per page.
   */
  limit: number = 10;

  /**
   * The total number of pages.
   */
  totalPages: number = 1;

  /**
   * Whether there is a next page.
   */
  hasNext: boolean = false;

  /**
   * Whether there is a previous page.
   */
  hasPrevious: boolean = false;

  constructor(partial?: Partial<PaginatedResponse<T>>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}