import { Router } from 'express';
import {
  createSubscription,
  mercadopagoWebhook,
  getUserSubscriptions,
  cancelSubscription,
  getSubscriptionStatus
} from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.post('/subscription', authenticateToken, createSubscription);
router.get('/subscriptions', authenticateToken, getUserSubscriptions);
router.put('/subscription/:subscriptionId/cancel', authenticateToken, cancelSubscription);
router.get('/subscription/:subscriptionId', authenticateToken, getSubscriptionStatus);

// Webhooks (no requieren autenticación)
router.post('/mercadopago/webhook', mercadopagoWebhook);

export default router;