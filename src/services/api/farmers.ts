import { httpClient } from './client';
import { PaginatedResponse } from './types';

/**
 * Interfaces (เพิ่ม FarmerEntry เพื่อรองรับตารางประวัติ)
 */

export interface FarmerEntry {
  id: string;
  recordedAt: string;
  fishAgeDays: number;
  fishAgeLabel: string;
  pondType: string;
  pondCount: number;
  fishCount: number;
  fishCountText: string;
  foodAmountKg?: number | null;
  fishAverageWeight?: number | null;
  weatherTemperatureC?: number;
  weatherRainMm?: number;
  weatherHumidityPct?: number;
}

export interface FarmerStats {
  averageFishWeight?: number | null;
  survivalRate: number;
  survivalRatePct: number;
  latestFishAgeDays: number;
  latestFishAgeLabel: string;
  latestFishCount: number;
  totalPonds: number;
}

export interface Farmer {
  userId: string;
  no: number;
  fullName: string;
  phone: string;
  pictureUrl?: string | null;
  farmType: string;
  farmTypes: string[];
  availableFarmTypes?: string[];

  registrationStatus: 'PENDING' | 'COMPLETED';
  pondCount: number | null;
  farmAreaRai: number | null;
  latitude: number | null;
  longitude: number | null;
  registeredAt: string;
  totalRecords?: number;
  lastRecordDate?: string | null;
  stats?: FarmerStats;
  entries?: FarmerEntry[];
}

export interface FarmerDetailEntry {
  id: string;
  recordedAt: string;
  farmType: string;
  fishAgeDays: number | null;
  fishAgeLabel: string | null;
  pondType: string | null;
  pondCount: number | null;
  fishRemaining: number | null;
  fishReleased: number | null;
  foodAmountKg: number | null;
  averageFishWeightGr: number | null;
  feedFormulaName: string | null;
  medicineName: string | null;
  weatherTemperatureC: number | null;
  weatherRainMm: number | null;
  weatherHumidityPct: number | null;
  fishAverageWeight: number | null;
}

export interface DashboardSummary {
  fishType: string;
  avgWeight: number | null;
  releaseCount: number | null;
  remainingCount: number | null;
  survivalRate: number | null;
}

export interface PondInfo {
  id: string;
  pondType: string;
  farmType: string;
  widthM: number;
  lengthM: number;
  depthM: number;
  volumeM3: number;
  productionCycleCount: number;
}

export interface FarmerDetailResponse extends Omit<Farmer, 'entries'> {
  ponds?: PondInfo[];
  stats?: FarmerStats;
  dashboardSummary?: DashboardSummary;
  entries?: FarmerDetailEntry[];
}

export interface FarmersListParams {
  page?: number;
  limit?: number;
  search?: string;
  farmType?: string;
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
    if (params?.search) searchParams.append('search', params.search);
    if (params?.farmType) searchParams.append('farmType', params.farmType);

    const query = searchParams.toString();
    const endpoint = query ? `/farmers?${query}` : '/farmers';

    return httpClient.get<PaginatedResponse<Farmer>>(endpoint);
  },

  /**
   * Fetch single farmer detail by ID
   */
  async getById(farmerId: string): Promise<FarmerDetailResponse> {
    return httpClient.get<FarmerDetailResponse>(`/farmers/${farmerId}`);
  },

  /**
   * Delete farmer by user ID
   */
  async delete(farmerId: string): Promise<void> {
    await httpClient.delete<void>(`/farmers/${farmerId}`);
  },
};