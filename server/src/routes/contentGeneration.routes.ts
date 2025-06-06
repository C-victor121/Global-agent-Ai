import { Router } from 'express';
import {
  generateContent,
  getContentGenerationHistory,
  saveGeneratedContent, // Importar nueva función
  deleteContentGeneration, // Importar nueva función
  deleteAllContentGenerations // Importar nueva función
} from '../controllers/contentGeneration.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Asegúrate que la ruta a tu middleware sea correcta

const router = Router();

// Ruta para generar nuevo contenido
// Se aplica el middleware de autenticación para asegurar que solo usuarios logueados puedan acceder
router.post('/generate', authMiddleware, generateContent);

// Ruta para obtener el historial de generaciones del usuario logueado
router.get('/history', authMiddleware, getContentGenerationHistory);

// Nueva ruta para guardar contenido generado y aceptado por el usuario
router.post('/save', authMiddleware, saveGeneratedContent);

// Nueva ruta para eliminar un elemento específico del historial
router.delete('/:id', authMiddleware, deleteContentGeneration);

// Nueva ruta para eliminar todo el historial de un usuario
router.delete('/all', authMiddleware, deleteAllContentGenerations);

export default router;