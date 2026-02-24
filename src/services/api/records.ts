import { httpClient } from './client';

export interface WeatherState {
  observedAt: string;
  temperatureC: number;
  rainMm: number;
  humidityPct: number;
  conditionText: string;
  weatherCode: number;
}

export interface FormStateResponse {
  currentDateTime: string;
  farmType: string;
  locationAvailable: boolean;
  weather: WeatherState | null;
}

export interface CreateRecordRequest {
  farmType?: string;
  recordedAt?: string;
  fishAgeLabel?: string;

  pondType?: string;
  pondCount?: number;

  fishCountText?: string;
  foodAmountKg?: number | null;

  weather?: {
    temperatureC: number;
    rainMm: number;
    humidityPct: number;
  };

  weatherTemperatureC?: number;
  weatherRainMm?: number;
  weatherHumidityPct?: number;

  metadata?: {
    cycleStartDate?: string;
    initialAgeOffsetDays?: number;
  };

  notes?: string;
}

export interface RecordResponse {
  id: string;
  userId: string;
  farmType: string;
  cultivationTypeId?: string;
  recordedAt: string;

  fishAgeLabel: string;
  fishAgeDays: number;
  fishAgeStageId?: string;

  pondType: string;
  pondCount: number;

  fishCount: number;
  fishCountText: string;

  fishAverageWeight?: number | null;
  foodAmountKg?: number | null;

  weatherTemperatureC: number;
  weatherRainMm: number;
  weatherHumidityPct: number;

  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListRecordsParams {
  userId?: string;
  farmType?: string;
  pondId?: string;
  productionCycleId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export class RecordsAPI {
  private readonly basePath = 'records';

  /**
   * GET /records/form-state
   */
  async getFormState(farmType: string): Promise<FormStateResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('farmType', farmType);

    const response = await httpClient.get<{ data: FormStateResponse }>(
      `${this.basePath}/form-state?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * GET /records
   * Note: httpClient already unwraps { data: ... } envelope,
   * so the response is the records array directly.
   */
  async list(params?: ListRecordsParams): Promise<RecordResponse[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.farmType && params.farmType !== 'ALL') queryParams.append('farmType', params.farmType);
      if (params.pondId) queryParams.append('pondId', params.pondId);
      if (params.productionCycleId) queryParams.append('productionCycleId', params.productionCycleId);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
    }

    const result = await httpClient.get<RecordResponse[]>(
      `${this.basePath}?${queryParams.toString()}`
    );
    return Array.isArray(result) ? result : [];
  }

  /**
   * GET /records/:id
   */
  async getById(id: string): Promise<RecordResponse> {
    const response = await httpClient.get<{ data: RecordResponse }>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * POST /records
   */
  async create(data: CreateRecordRequest): Promise<RecordResponse> {
    const response = await httpClient.post<{ data: RecordResponse }>(this.basePath, data);
    return response.data;
  }

  /**
   * PUT /records/:id
   */
  async update(id: string, data: Partial<CreateRecordRequest>): Promise<RecordResponse> {
    const response = await httpClient.put<{ data: RecordResponse }>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * DELETE /records/:id
   */
  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.basePath}/${id}`);
  }
}

export const recordsAPI = new RecordsAPI();