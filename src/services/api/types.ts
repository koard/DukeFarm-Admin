/**
 * Custom API Error class
 * Provides structured error information from API responses
 */
export class APIError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * API Response type
 */
export interface APIResponse<T = any> {
  data: T;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
