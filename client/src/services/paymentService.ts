import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Plan {
  _id: string;
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
}

export interface Subscription {
  _id: string;
  userId: string;
  planId: Plan;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'paused';
  paymentMethod: 'mercadopago_pse' | 'mercadopago_efecty' | 'paypal_card';
  mercadopagoSubscriptionId?: string;
  paypalSubscriptionId?: string;
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  trialEndDate?: string;
  isTrialActive: boolean;
  autoRenew: boolean;
  cancelledAt?: string;
  cancelReason?: string;
  paymentHistory: PaymentRecord[];
  metadata?: {
    mercadopagoPreferenceId?: string;
    lastPaymentAttempt?: string;
    failedPaymentAttempts?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  amount: number;
  currency: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  paymentMethod: string;
  paidAt?: string;
  mercadopagoData?: any;
  paypalData?: any;
  createdAt: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
  paymentMethod: 'pse' | 'efecty';
  billingType: 'monthly' | 'annual';
  userIdentification?: {
    type: 'CC' | 'CE' | 'NIT';
    number: string;
  };
}

export interface CreateSubscriptionResponse {
  subscription: {
    id: string;
    status: string;
    plan: string;
    amount: number;
    billingType: string;
    paymentMethod: string;
  };
  payment: {
    preferenceId: string;
    initPoint: string;
    sandboxInitPoint: string;
  };
}

class PaymentService {
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

  /**
   * Obtiene todos los planes disponibles
   */
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/plans`);
    return response.json();
  }

  /**
   * Crea una nueva suscripción
   */
  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<CreateSubscriptionResponse>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/payments/subscription`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Obtiene las suscripciones del usuario
   */
  async getUserSubscriptions(): Promise<ApiResponse<Subscription[]>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/payments/subscriptions`);
    return response.json();
  }

  /**
   * Cancela una suscripción
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<ApiResponse<Subscription>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/payments/subscription/${subscriptionId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    return response.json();
  }

  /**
   * Obtiene el estado de una suscripción específica
   */
  async getSubscriptionStatus(subscriptionId: string): Promise<ApiResponse<Subscription>> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/payments/subscription/${subscriptionId}`);
    return response.json();
  }

  /**
   * Redirige al usuario a MercadoPago para completar el pago
   */
  redirectToPayment(initPoint: string, sandbox: boolean = false): void {
    const url = sandbox ? initPoint.replace('init_point', 'sandbox_init_point') : initPoint;
    window.location.href = url;
  }

  /**
   * Formatea el precio para mostrar
   */
  formatPrice(amount: number, currency: string = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Calcula el descuento anual
   */
  calculateAnnualDiscount(monthlyPrice: number, annualPrice: number): number {
    const yearlyMonthly = monthlyPrice * 12;
    return Math.round(((yearlyMonthly - annualPrice) / yearlyMonthly) * 100);
  }

  /**
   * Obtiene el nombre del método de pago en español
   */
  getPaymentMethodName(method: string): string {
    const methods: Record<string, string> = {
      'pse': 'PSE - Débito a Cuenta Corriente/Ahorros',
      'efecty': 'Efecty - Pago en Efectivo',
      'mercadopago_pse': 'PSE - Débito a Cuenta Corriente/Ahorros',
      'mercadopago_efecty': 'Efecty - Pago en Efectivo',
      'paypal_card': 'PayPal - Tarjeta de Crédito/Débito'
    };
    return methods[method] || method;
  }

  /**
   * Obtiene el estado de la suscripción en español
   */
  getSubscriptionStatusName(status: string): string {
    const statuses: Record<string, string> = {
      'active': 'Activa',
      'cancelled': 'Cancelada',
      'expired': 'Expirada',
      'pending': 'Pendiente',
      'paused': 'Pausada'
    };
    return statuses[status] || status;
  }

  /**
   * Obtiene el color del estado para la UI
   */
  getSubscriptionStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': 'text-green-500',
      'cancelled': 'text-red-500',
      'expired': 'text-gray-500',
      'pending': 'text-yellow-500',
      'paused': 'text-orange-500'
    };
    return colors[status] || 'text-gray-500';
  }
}

export const paymentService = new PaymentService();