import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    admin: number;
    regular: number;
  };
  generations: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  topUsers: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    generationCount: number;
    lastGeneration: string;
  }>;
  formatStats: FormatStat[];
  historicalData?: HistoricalDataPoint[]; // Añadido para los gráficos
  monthlyActiveGenerations?: Array<{ year: number; month: number; count: number; }>; // Nueva métrica
}

export interface FormatStat {
  _id: string;
  count: number;
}

export interface HistoricalDataPoint {
  date: string;
  userCount: number;
  generationCount: number;
}

// La interfaz HistoricalData original ya no es necesaria en esta forma,
// ya que los datos históricos ahora son un array de HistoricalDataPoint.
// Si getHistoricalData todavía devuelve la estructura anterior, necesitará ajustes.
// Por ahora, la comentaremos o eliminaremos si no se usa en otro lugar.
/*
export interface HistoricalData {
  userRegistrations: Array<{
    _id: string;
    count: number;
  }>;
  dailyGenerations: Array<{
    _id: string;
    count: number;
  }>;
  period: string;
}
*/

export interface GenerationDetail {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  intencion: string;
  tono: string;
  objetivo: string;
  producto_servicio: string;
  audiencia: string;
  palabras_clave: string;
  longitud: string;
  formato: string;
  generatedText?: string;
  createdAt: string;
}

export interface GenerationDetailsResponse {
  generations: GenerationDetail[];
  pagination: {
    current: number;
    total: number;
    count: number;
  };
}

class DashboardService {
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response;
  }

  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/dashboard/metrics`);
    return response.json();
  }

  async getHistoricalData(period: '7d' | '30d' | '90d' = '30d'): Promise<ApiResponse<HistoricalDataPoint[]>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/dashboard/historical?period=${period}`);
    return response.json();
  }

  async getGenerationDetails(
    page: number = 1,
    limit: number = 20,
    userId?: string,
    formato?: string
  ): Promise<ApiResponse<GenerationDetailsResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (userId) params.append('userId', userId);
    if (formato) params.append('formato', formato);

    const response = await this.fetchWithAuth(`${API_BASE_URL}/dashboard/generations?${params}`);
    return response.json();
  }
}

export const dashboardService = new DashboardService();