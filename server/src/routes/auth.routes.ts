import { Router } from 'express';
import { googleAuth } from '../controllers/auth.controller';

const router = Router();

// Ruta para autenticación con Google
router.post('/google', googleAuth);

export default router;