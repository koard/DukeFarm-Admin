export type FarmType = 'SMALL' | 'LARGE' | 'MARKET';

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
  farmType: string; 
  recordedAt: string;
  fishAgeLabel: string;
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