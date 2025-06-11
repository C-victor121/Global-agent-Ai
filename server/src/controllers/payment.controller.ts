import { Request, Response } from 'express';
import Subscription, { ISubscription } from '../models/subscription.model';
import Plan, { IPlan } from '../models/plan.model';
import User, { IUser } from '../models/user.model';
import mercadopagoService, { WebhookProcessingResult, ProcessedPaymentWebhookResult } from '../services/mercadopago.service';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Crea una nueva suscripción y genera la preferencia de pago
 */
export const createSubscription = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { planId, paymentMethod, billingType, userIdentification } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Validar datos requeridos
    if (!planId || !paymentMethod || !billingType) {
      return res.status(400).json({ 
        message: 'Faltan datos requeridos: planId, paymentMethod, billingType' 
      });
    }

    // Validar método de pago
    if (!['pse', 'efecty'].includes(paymentMethod)) {
      return res.status(400).json({ 
        message: 'Método de pago no válido. Use: pse, efecty' 
      });
    }

    // Validar tipo de facturación
    if (!['monthly', 'annual'].includes(billingType)) {
      return res.status(400).json({ 
        message: 'Tipo de facturación no válido. Use: monthly, annual' 
      });
    }

    // Obtener usuario y plan
    const [user, plan] = await Promise.all([
      User.findById(userId),
      Plan.findById(planId)
    ]);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: 'Plan no encontrado o inactivo' });
    }

    // Verificar si ya tiene una suscripción activa
    const existingSubscription = await Subscription.findOne({
      userId,
      status: { $in: ['active', 'pending'] }
    });

    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'Ya tienes una suscripción activa o pendiente' 
      });
    }

    // Calcular fechas
    const startDate = new Date();
    const endDate = new Date();
    if (billingType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Crear suscripción en estado pending
    const subscription = new Subscription({
      userId,
      planId,
      status: 'pending',
      paymentMethod: `mercadopago_${paymentMethod}`,
      startDate,
      endDate,
      nextBillingDate: endDate,
      isTrialActive: plan.trialPeriodDays > 0,
      trialEndDate: plan.trialPeriodDays > 0 ? 
        new Date(Date.now() + plan.trialPeriodDays * 24 * 60 * 60 * 1000) : undefined,
      autoRenew: true,
      paymentHistory: [],
      metadata: {
        failedPaymentAttempts: 0
      }
    });

    await subscription.save();

    // Crear preferencia de pago en MercadoPago
    const preference = await mercadopagoService.createPaymentPreference({
      user,
      plan,
      paymentMethod,
      billingType
    });

    // Actualizar suscripción con ID de preferencia
    subscription.metadata = {
      ...subscription.metadata,
      mercadopagoPreferenceId: preference.id
    };
    await subscription.save();

    return res.status(201).json({
      success: true,
      data: {
        subscription: {
          id: subscription._id,
          status: subscription.status,
          plan: plan.name,
          amount: billingType === 'monthly' ? plan.monthlyPrice : (plan.annualPrice || plan.monthlyPrice * 12),
          billingType,
          paymentMethod
        },
        payment: {
          preferenceId: preference.id,
          initPoint: preference.init_point,
          sandboxInitPoint: preference.sandbox_init_point
        }
      }
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

/**
 * Webhook de MercadoPago para procesar notificaciones de pago
 */
export const mercadopagoWebhook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const webhookData = req.body;
    
    // Procesar webhook
    const result: WebhookProcessingResult = await mercadopagoService.processWebhook(webhookData);
    
    if (result.processed && (result as ProcessedPaymentWebhookResult).paymentId) {
      const processedResult = result as ProcessedPaymentWebhookResult;
      // Buscar suscripción por external_reference o metadata
      const subscription = await Subscription.findOne({
        userId: processedResult.userId,
        'metadata.mercadopagoPreferenceId': { $exists: true }
      }).populate('planId');

      if (subscription) {
        // Actualizar historial de pagos
        const paymentRecord = {
          paymentId: processedResult.paymentId,
          amount: processedResult.amount,
          currency: 'COP',
          status: processedResult.status as 'approved' | 'pending' | 'rejected' | 'cancelled', // Asegurar el tipo
          paymentMethod: `mercadopago_${processedResult.paymentMethod}`,
          paidAt: processedResult.status === 'approved' ? new Date() : undefined,
          mercadopagoData: webhookData
        };

        subscription.paymentHistory.push(paymentRecord);

        // Actualizar estado de suscripción
        if (processedResult.status === 'approved') {
          subscription.status = 'active';
          subscription.metadata!.failedPaymentAttempts = 0;
        } else if (processedResult.status === 'rejected') {
          subscription.metadata!.failedPaymentAttempts = 
            (subscription.metadata?.failedPaymentAttempts || 0) + 1;
          
          // Si fallan muchos intentos, cancelar suscripción
          if (subscription.metadata!.failedPaymentAttempts >= 3) {
            subscription.status = 'cancelled';
            subscription.cancelledAt = new Date();
            subscription.cancelReason = 'Múltiples fallos de pago';
          }
        }

        subscription.metadata!.lastPaymentAttempt = new Date();
        await subscription.save();
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
};

/**
 * Obtiene las suscripciones del usuario autenticado
 */
export const getUserSubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const subscriptions = await Subscription.find({ userId })
      .populate('planId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Cancela una suscripción
 */
export const cancelSubscription = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { subscriptionId } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Suscripción no encontrada' });
    }

    if (subscription.status === 'cancelled') {
      return res.status(400).json({ message: 'La suscripción ya está cancelada' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason || 'Cancelada por el usuario';
    subscription.autoRenew = false;

    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Suscripción cancelada exitosamente',
      data: subscription
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Obtiene el estado de una suscripción específica
 */
export const getSubscriptionStatus = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId
    }).populate('planId');

    if (!subscription) {
      return res.status(404).json({ message: 'Suscripción no encontrada' });
    }

    return res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};