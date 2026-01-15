import { httpClient } from './client';
import { PaginatedResponse } from './types';
export interface FeedFormula {
  id: string;
  name: string;
  targetStage: string;
  ingredients: string;    
  instruction: string;   
  recommendations: string;
  farmType?: string;        
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}


export interface CreateFeedFormulaRequest {
  name: string;
  targetStage: string;
  ingredients: string;
  instruction: string;
  recommendations: string;
  farmType?: string;
}

export interface UpdateFeedFormulaRequest {
  name?: string;
  targetStage?: string;
  
  ingredients?: string;
  instruction?: string;
  
  recommendations?: string;
  farmType?: string;
}

export interface ListFeedFormulasParams {
  page?: number;
  limit?: number;
}

export class FeedFormulasAPI {
  private readonly basePath = '/feed-formulas';

  async create(data: CreateFeedFormulaRequest): Promise<FeedFormula> {
    return httpClient.post<FeedFormula>(this.basePath, data);
  }

  async list(params?: ListFeedFormulasParams): Promise<PaginatedResponse<FeedFormula>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    return httpClient.get<PaginatedResponse<FeedFormula>>(endpoint);
  }

  async getById(id: string): Promise<FeedFormula> {
    return httpClient.get<FeedFormula>(`${this.basePath}/${id}`);
  }

  async update(id: string, data: UpdateFeedFormulaRequest): Promise<FeedFormula> {
    return httpClient.put<FeedFormula>(`${this.basePath}/${id}`, data);
  }

  async delete(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export const feedFormulasAPI = new FeedFormulasAPI();