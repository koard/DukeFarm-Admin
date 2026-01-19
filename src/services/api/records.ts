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

  notes?: string;
}

export interface RecordResponse {
  id: string;
  userId: string;
  farmType: string;
  cultivationTypeId: string;
  recordedAt: string;
  fishAgeLabel: string;
  fishAgeDays: number;
  fishAgeStageId?: string;
  harvestStatus?: string;       
  harvestStatusReason?: string; 
  pondType: string;
  pondCount: number;
  fishCount: number;      
  fishCountText: string;  
  averageFishWeightGr?: number | null; 
  foodAmountKg?: number | null; 

  weatherTemperatureC?: number;
  weatherRainMm?: number;
  weatherHumidityPct?: number;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListRecordsParams {
  userId?: string;
  farmType?: string;
  page?: number;
  limit?: number;
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
   */
  async list(params?: ListRecordsParams): Promise<{ data: RecordResponse[], total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.farmType) queryParams.append('farmType', params.farmType);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await httpClient.get<{ data: RecordResponse[], total: number }>(
      `${this.basePath}?${queryParams.toString()}`
    );
    return response; 
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