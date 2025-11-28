import { httpClient } from './client';
import { PaginatedResponse } from './types';

/**
 * Farmers API Service
 */

export interface Farmer {
  no: number;
  fullName: string;
  phone: string;
  farmType: 'NURSERY_SMALL' | 'NURSERY_LARGE' | 'GROWOUT';
  registrationStatus: 'PENDING' | 'COMPLETED';
  pondCount: number;
  latitude: number;
  longitude: number;
  registeredAt: string;
}

export interface FarmersListParams {
  page?: number;
  limit?: number;
}

/**
 * Farmers API operations
 */
export const farmersAPI = {
  /**
   * Get list of farmers with pagination
   * @param params Pagination parameters
   * @returns Paginated list of farmers
   */
  async list(params?: FarmersListParams): Promise<PaginatedResponse<Farmer>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    const endpoint = query ? `/farmers?${query}` : '/farmers';
    
    return httpClient.get<PaginatedResponse<Farmer>>(endpoint);
  },
};
