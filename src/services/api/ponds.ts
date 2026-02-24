import { httpClient } from './client';

export interface ProductionCycle {
  id: string;
  startDate: string;
  endDate: string | null;
  status: 'PLANNING' | 'STOCKING' | 'GROWOUT' | 'HARVEST_READY' | 'HARVESTED' | 'ABORTED';
  farmType: string | null;
  createdAt: string;
}

export interface PondActiveCycleResponse {
  data: ProductionCycle | null;
}

export interface PondCyclesListResponse {
  data: ProductionCycle[];
}

export interface PondCycleCountResponse {
  data: {
    count: number;
  };
}

export class PondsAPI {
  private readonly basePath = 'ponds';

  /**
   * GET /ponds/:id/active-cycle
   * httpClient already unwraps { data: ... } envelope
   */
  async getActiveCycle(pondId: string): Promise<ProductionCycle | null> {
    return httpClient.get<ProductionCycle | null>(
      `${this.basePath}/${pondId}/active-cycle`
    );
  }

  /**
   * GET /ponds/:id/cycles
   * httpClient already unwraps { data: ... } envelope
   */
  async listCycles(pondId: string): Promise<ProductionCycle[]> {
    const result = await httpClient.get<ProductionCycle[]>(
      `${this.basePath}/${pondId}/cycles`
    );
    return Array.isArray(result) ? result : [];
  }

  /**
   * GET /ponds/:id/cycle-count
   * httpClient already unwraps { data: ... } envelope
   */
  async getCycleCount(pondId: string): Promise<number> {
    const result = await httpClient.get<{ count: number }>(
      `${this.basePath}/${pondId}/cycle-count`
    );
    return result?.count ?? 0;
  }

  /**
   * POST /ponds/:id/start-cycle
   * httpClient already unwraps { data: ... } envelope
   */
  async startCycle(pondId: string, farmType?: string): Promise<ProductionCycle> {
    return httpClient.post<ProductionCycle>(
      `${this.basePath}/${pondId}/start-cycle`,
      { farmType }
    );
  }

  /**
   * POST /ponds/:id/end-cycle
   * httpClient already unwraps { data: ... } envelope
   */
  async endCycle(pondId: string): Promise<ProductionCycle> {
    return httpClient.post<ProductionCycle>(
      `${this.basePath}/${pondId}/end-cycle`
    );
  }
}

export const pondsAPI = new PondsAPI();
