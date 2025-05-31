import { Router } from 'express';
import {
  startEmbeddedSignup,
  handleFacebookCallback,
  verifyWhatsappWebhook,
  handleWhatsappMessage,
  sendWhatsappMessage,
  validateMetaSignature,
  getWhatsappConfig // Importar la nueva función del controlador
} from '../controllers/whatsapp.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Asumiendo que tu middleware de autenticación se llama así
import express from 'express';

const router = Router();

// Ruta para iniciar el Embedded Signup (protegida, requiere que el usuario esté logueado en tu app)
router.get('/connect', authMiddleware, startEmbeddedSignup);

// Ruta de callback para Facebook después del Embedded Signup
// No necesita authRequired aquí porque Facebook redirige y no tendremos sesión de nuestra app directamente,
// pero validaremos el 'state' y luego asociaremos con el usuario logueado.
router.get('/callback', handleFacebookCallback);

// Rutas para el Webhook de WhatsApp
// GET para la verificación del webhook (Meta envía una petición GET para verificar la URL)
router.get('/webhook', verifyWhatsappWebhook);

// POST para recibir los eventos de mensajes (notificaciones de Meta)
// Usamos express.raw({ type: 'application/json' }) para obtener el body como buffer para la validación de firma
router.post('/webhook', express.raw({ type: 'application/json' }), validateMetaSignature, handleWhatsappMessage);

// Ruta para enviar un mensaje de WhatsApp (protegida)
router.post('/messages', authMiddleware, sendWhatsappMessage);

// Ruta para obtener la configuración de WhatsApp del usuario (protegida)
router.get('/config', authMiddleware, getWhatsappConfig);

export default router;