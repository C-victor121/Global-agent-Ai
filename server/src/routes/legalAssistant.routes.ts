import { Router } from 'express';
import multer from 'multer';
import { generateLegalDocument } from '../controllers/legalAssistant.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Configurar multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite por archivo
    files: 5 // máximo 5 archivos
  },
  fileFilter: (_req, file, cb) => {
    // Tipos de archivo permitidos
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// Ruta para generar documentos legales
router.post(
  '/generate',
  authMiddleware,
  upload.array('files', 5), // 'files' es el nombre del campo en el FormData, máximo 5 archivos
  generateLegalDocument
);

export default router;