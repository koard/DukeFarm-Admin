import { httpClient } from './client';
import { PaginatedResponse } from './types';

/**
 * Feed Formula interface matching API response
 */
export interface FeedFormula {
  id: string;
  name: string;
  targetStage: string;
  description: string;
  recommendations: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Feed Formula request body
 */
export interface CreateFeedFormulaRequest {
  name: string;
  targetStage: string;
  description: string;
  recommendations: string;
}

/**
 * Update Feed Formula request body (all fields optional)
 */
export interface UpdateFeedFormulaRequest {
  name?: string;
  targetStage?: string;
  description?: string;
  recommendations?: string;
}

/**
 * Query parameters for listing feed formulas
 */
export interface ListFeedFormulasParams {
  page?: number;
  limit?: number;
}

/**
 * Feed Formulas API Service
 * Handles all feed formula-related API operations
 */
export class FeedFormulasAPI {
  private readonly basePath = '/feed-formulas';

  /**
   * Create new feed formula (Admin only)
   */
  async create(data: CreateFeedFormulaRequest): Promise<FeedFormula> {
    return httpClient.post<FeedFormula>(this.basePath, data);
  }

  /**
   * List all feed formulas with pagination
   */
  async list(params?: ListFeedFormulasParams): Promise<PaginatedResponse<FeedFormula>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    return httpClient.get<PaginatedResponse<FeedFormula>>(endpoint);
  }

  /**
   * Get feed formula by ID
   */
  async getById(id: string): Promise<FeedFormula> {
    return httpClient.get<FeedFormula>(`${this.basePath}/${id}`);
  }

  /**
   * Update feed formula (Admin only)
   */
  async update(id: string, data: UpdateFeedFormulaRequest): Promise<FeedFormula> {
    return httpClient.put<FeedFormula>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete feed formula (Admin only)
   */
  async delete(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

// Export singleton instance
export const feedFormulasAPI = new FeedFormulasAPI();
