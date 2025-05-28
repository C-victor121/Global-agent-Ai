
import api from './api';

// Definimos la interfaz para un Plan, similar a la del backend pero para el frontend
export interface Plan {
  _id?: string;
  name: string;
  shortDescription: string;
  monthlyPrice: number;
  annualPrice?: number;
  trialPeriodDays: number;
  requiresCardForTrial: boolean;
  isActive: boolean;
  features: {
    aiAgents: {
      numberOfAgents: number;
      allowAudio: boolean;
      allowPhoneVoice: boolean;
    };
    integrations: {
      numberOfPlatforms: number;
      dropi: boolean;
      whatsapp: boolean;
      apiAccess: boolean;
    };
    capacity: {
      conversationLimitMonthly: number;
      accessToMetrics: boolean;
      advancedDashboard: boolean;
    };
    others: {
      technicalSupport: 'email' | 'chat' | 'priority';
      smartFunnelsAccess: boolean;
      aiTemplatesAccess: boolean;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

// Obtener todos los planes
export const getPlans = async (): Promise<Plan[]> => {
  const response = await api.get<Plan[]>('/plans');
  return response.data;
};

// Obtener un plan por ID
export const getPlanById = async (id: string): Promise<Plan> => {
  const response = await api.get<Plan>(`/plans/${id}`);
  return response.data;
};

// Crear un nuevo plan
export const createPlan = async (planData: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>): Promise<Plan> => {
  const response = await api.post<Plan>('/plans', planData);
  return response.data;
};

// Actualizar un plan existente
export const updatePlan = async (id: string, planData: Partial<Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Plan> => {
  const response = await api.put<Plan>(`/plans/${id}`, planData);
  return response.data;
};

// Eliminar un plan
export const deletePlan = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/plans/${id}`);
  return response.data;
};