export interface Agent {
  id: string;
  name: string;
  version: string;
  description: string;
  languages: Record<string, number>;
  ide_integration: string[];
  strengths: string[];
  weaknesses: string[];
  best_use_cases: string[];
  pricing: {
    individual?: number;
    business?: number;
    enterprise?: string | number;
    free_tier: boolean;
    currency: string;
    billing: string;
    [key: string]: any;
  };
  performance_metrics: {
    response_time_ms: number;
    accuracy_score: number;
    user_satisfaction: number;
    code_quality_score: number;
  };
  features: {
    context_window: number;
    offline_capability: boolean;
    customization: string;
    collaboration: boolean;
    learning_capability: boolean;
    security_features: string[];
  };
  complexity_rating: string;
  setup_difficulty: string;
  learning_curve: string;
}

export interface TaskAnalysis {
  languages: string[];
  complexity: string;
  projectType: string[];
  teamSize: string;
  budget: string;
  timeline: string;
  collaboration: boolean;
  idePreference: string | null;
  security: boolean;
}

export interface Recommendation {
  agent: Agent;
  score: number;
  scoreBreakdown: {
    language: number;
    complexity: number;
    useCase: number;
    integration: number;
    performance: number;
  };
  scores?: {
    language: number;
    complexity: number;
    useCase: number;
    integration: number;
    performance: number;
  };
  reasoning: {
    reasons: string[];
    warnings: string[];
    strengths: string[];
    weaknesses: string[];
  };
  taskAnalysis: TaskAnalysis;
}

export interface Filters {
  budget?: 'free' | 'paid' | 'enterprise';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  teamSize?: 'solo' | 'small' | 'large';
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    processingTime?: number;
  };
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  alternatives: Recommendation[];
  allScores: { agentId: string; score: number }[];
  taskAnalysis: TaskAnalysis | null;
  strategy: string;
  filters: Filters;
  totalAgentsConsidered: number;
}

export interface AgentsResponse {
  agents: Agent[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface MetadataResponse {
  metadata: {
    version: string;
    last_updated: string;
    total_agents: number;
    categories: string[];
    supported_languages: string[];
  };
  strategies: Strategy[];
  filters: {
    budget: string[];
    experienceLevel: string[];
    teamSize: string[];
  };
}

export interface AgentFilter {
  language?: string;
  category?: string;
  taskDescription?: string;
}

export type AgentSortBy = 'name' | 'score';
export type AgentSortOrder = 'asc' | 'desc'; 