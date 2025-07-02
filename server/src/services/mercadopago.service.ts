import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { ISubscription } from '../models/subscription.model';
import { IPlan } from '../models/plan.model';
import { IUser } from '../models/user.model';

export interface ProcessedPaymentWebhookResult {
  paymentId: string;
  status: string; // 'approved', 'pending', 'rejected', etc.
  amount: number;
  externalReference?: string;
  userId?: string;
  planId?: string;
  paymentMethod?: string;
  billingType?: string;
  processed: true;
}

export interface FailedWebhookProcessingResult {
  processed: false;
  reason: string;
}

export type WebhookProcessingResult = ProcessedPaymentWebhookResult | FailedWebhookProcessingResult;

interface CreatePreferenceData {
  user: IUser;
  plan: IPlan;
  paymentMethod: 'pse' | 'efecty';
  billingType: 'monthly' | 'annual';
}

interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

class MercadoPagoService {
  private client: MercadoPagoConfig;
  private preference: Preference;
  private payment: Payment;

  constructor() {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is required');
    }

    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: {
        timeout: 5000,
        idempotencyKey: 'abc'
      }
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }

  /**
   * Crea una preferencia de pago para PSE o Efecty
   */
  async createPaymentPreference(data: CreatePreferenceData): Promise<MercadoPagoPreferenceResponse> {
    try {
      const { user, plan, paymentMethod, billingType } = data;
      const amount = billingType === 'monthly' ? plan.monthlyPrice : (plan.annualPrice || plan.monthlyPrice * 12);
      
      // URLs de retorno
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const backUrls = {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`
      };

      // Configuración específica según el método de pago
      const paymentMethods = this.getPaymentMethodsConfig(paymentMethod);

      if (!user || !user._id || !plan || !plan._id) {
        throw new Error('User or Plan information is missing or invalid.');
      }

      const preferenceData = {
        items: [
          {
            id: plan._id.toString(),
            title: `${plan.name} - ${billingType === 'monthly' ? 'Mensual' : 'Anual'}`,
            description: plan.shortDescription,
            quantity: 1,
            unit_price: amount,
            currency_id: 'COP'
          }
        ],
        payer: {
          name: user.name,
          email: user.email,
          identification: {
            type: 'CC', // Cédula de ciudadanía por defecto
            number: '12345678' // Este debería venir del formulario
          }
        },
        back_urls: backUrls,
        auto_return: 'approved',
        payment_methods: paymentMethods,
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/mercadopago/webhook`,
        external_reference: `${user._id}_${plan._id}_${Date.now()}`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        metadata: {
          user_id: user._id.toString(),
          plan_id: plan._id.toString(),
          payment_method: paymentMethod,
          billing_type: billingType
        }
      };

      const response = await this.preference.create({ body: preferenceData });
      
      return {
        id: response.id!,
        init_point: response.init_point!,
        sandbox_init_point: response.sandbox_init_point!
      };
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);
      throw new Error('Error al crear la preferencia de pago');
    }
  }

  /**
   * Obtiene la información de un pago
   */
  async getPaymentInfo(paymentId: string) {
    try {
      const payment = await this.payment.get({ id: paymentId });
      return payment;
    } catch (error) {
      console.error('Error getting payment info:', error);
      throw new Error('Error al obtener información del pago');
    }
  }

  /**
   * Procesa el webhook de MercadoPago
   */
  async processWebhook(data: any): Promise<WebhookProcessingResult> {
    try {
      const { type, data: webhookData } = data;
      
      if (type === 'payment') {
        const paymentInfo = await this.getPaymentInfo(webhookData.id);
        return this.processPaymentNotification(paymentInfo);
      }
      
      return { processed: false, reason: 'Tipo de webhook no soportado' };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  /**
   * Procesa la notificación de pago
   */
  private async processPaymentNotification(paymentInfo: any): Promise<ProcessedPaymentWebhookResult> {
    try {
      const { status, external_reference, transaction_amount, metadata } = paymentInfo;
      
      return {
        paymentId: paymentInfo.id,
        status,
        amount: transaction_amount,
        externalReference: external_reference,
        userId: metadata?.user_id,
        planId: metadata?.plan_id,
        paymentMethod: metadata?.payment_method,
        billingType: metadata?.billing_type,
        processed: true
      };
    } catch (error) {
      console.error('Error processing payment notification:', error);
      throw error;
    }
  }

  /**
   * Configura los métodos de pago según el tipo seleccionado
   */
  private getPaymentMethodsConfig(paymentMethod: 'pse' | 'efecty') {
    const baseConfig = {
      installments: 1,
      default_installments: 1
    };

    switch (paymentMethod) {
      case 'pse':
        return {
          ...baseConfig,
          excluded_payment_methods: [
            { id: 'visa' },
            { id: 'master' },
            { id: 'amex' },
            { id: 'efecty' }
          ],
          excluded_payment_types: [
            { id: 'credit_card' },
            { id: 'debit_card' },
            { id: 'ticket' }
          ]
        };
      
      case 'efecty':
        return {
          ...baseConfig,
          excluded_payment_methods: [
            { id: 'visa' },
            { id: 'master' },
            { id: 'amex' }
          ],
          excluded_payment_types: [
            { id: 'credit_card' },
            { id: 'debit_card' },
            { id: 'bank_transfer' }
          ],
          included_payment_methods: [
            { id: 'efecty' }
          ]
        };
      
      default:
        return baseConfig;
    }
  }

  /**
   * Valida la configuración del servicio
   */
  validateConfiguration(): boolean {
    return !!(process.env.MERCADOPAGO_ACCESS_TOKEN);
  }
}

export default new MercadoPagoService();