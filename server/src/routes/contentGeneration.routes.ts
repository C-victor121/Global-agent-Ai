import { Router } from 'express';
import { generateContent, getContentGenerationHistory } from '../controllers/contentGeneration.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Asegúrate que la ruta a tu middleware sea correcta

const router = Router();

// Ruta para generar nuevo contenido
// Se aplica el middleware de autenticación para asegurar que solo usuarios logueados puedan acceder
router.post('/generate', authMiddleware, generateContent);

// Ruta para obtener el historial de generaciones del usuario logueado
router.get('/history', authMiddleware, getContentGenerationHistory);

export default router;