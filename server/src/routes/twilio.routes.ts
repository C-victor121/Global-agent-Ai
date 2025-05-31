import { Router } from 'express';
import { handleWebhook, getConversations, getMessagesByConversation, sendMessage } from '../controllers/twilio.controller';
import { authRequired as authMiddleware } from '../middleware/auth.middleware'; // Renombrado para coincidir con el uso, o puedes usar authRequired directamente.
import express from 'express';

const router = Router();

// Middleware para parsear el cuerpo de la solicitud de Twilio, que es urlencoded
router.post('/webhook', express.urlencoded({ extended: false }), handleWebhook);

// Rutas para obtener conversaciones y mensajes (protegidas por autenticación)
router.get('/conversations', authMiddleware, getConversations);
router.get('/conversations/:conversationId/messages', authMiddleware, getMessagesByConversation);

// Ruta para enviar un mensaje (protegida por autenticación)
router.post('/messages', authMiddleware, sendMessage);

export default router;