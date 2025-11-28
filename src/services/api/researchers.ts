import { httpClient } from './client';
import { PaginatedResponse } from './types';

/**
 * Researchers API Service
 */

export interface Researcher {
  no: number;
  userId: string;
  fullName: string;
  phone: string;
  organization: string;
  department?: string;
  registeredAt: string;
}

export interface ResearchersListParams {
  page?: number;
  limit?: number;
}

/**
 * Researchers API operations
 */
export const researchersAPI = {
  /**
   * Get list of researchers with pagination
   * @param params Pagination parameters
   * @returns Paginated list of researchers
   */
  async list(params?: ResearchersListParams): Promise<PaginatedResponse<Researcher>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    const endpoint = query ? `/researchers?${query}` : '/researchers';
    
    return httpClient.get<PaginatedResponse<Researcher>>(endpoint);
  },
};
