import type { 
  ApiResponse, 
  RecommendationResponse, 
  AgentsResponse, 
  MetadataResponse,
  Filters,
  AgentFilter,
  AgentSortBy,
  AgentSortOrder
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getRecommendations(
    taskDescription: string, 
    filters: Filters = {}, 
    strategy: string = 'best_overall'
  ): Promise<ApiResponse<RecommendationResponse>> {
    return this.request<RecommendationResponse>('/recommend', {
      method: 'POST',
      body: JSON.stringify({
        task_description: taskDescription,
        filters,
        strategy
      })
    });
  }

  async getAgents(
    limit?: number,
    offset?: number,
    category?: string,
    language?: string,
    sortBy: AgentSortBy = 'name',
    order: AgentSortOrder = 'asc',
    taskDescription?: string
  ): Promise<ApiResponse<AgentsResponse>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    if (category) params.append('category', category);
    if (language) params.append('language', language);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    if (taskDescription) params.append('taskDescription', taskDescription);

    const endpoint = `/agents${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<AgentsResponse>(endpoint);
  }

  async getAgentById(id: string): Promise<ApiResponse<{ agent: any }>> {
    return this.request<{ agent: any }>(`/agents/${id}`);
  }

  async analyzeTask(taskDescription: string): Promise<ApiResponse<any>> {
    return this.request<any>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        task_description: taskDescription
      })
    });
  }

  async getMetadata(): Promise<ApiResponse<MetadataResponse>> {
    return this.request<MetadataResponse>('/metadata');
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/v1', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService; 