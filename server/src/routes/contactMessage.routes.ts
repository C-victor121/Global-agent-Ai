import { Router } from 'express';
import {
  receiveContactMessage,
  updateMessageStatus,
  getContactMessages,
  generateUserApiKey,
  getUserApiInfo,
  updateWordPressUrl,
  downloadWordPressPlugin // Añadir esta línea
} from '../controllers/contactMessage.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Ruta pública para recibir mensajes desde WordPress (requiere API Key en headers)
router.post('/contact-message', receiveContactMessage);

// Ruta para que n8n actualice el estado del mensaje
router.post('/update-status', updateMessageStatus);

// Rutas protegidas (requieren autenticación JWT)
router.use(authenticateToken);

// Obtener historial de mensajes del usuario
router.get('/messages', getContactMessages);

// Generar nueva API Key
router.post('/generate-api-key', generateUserApiKey);

// Obtener información de API Key y cuotas
router.get('/api-info', getUserApiInfo);

// Actualizar URL de WordPress
router.put('/wordpress-url', updateWordPressUrl);

// Descargar plugin de WordPress
router.get('/download-wordpress-plugin', downloadWordPressPlugin);

export default router;