import { Router } from 'express';
import { googleAuth, facebookAuth } from '../controllers/auth.controller';

const router = Router();

// Ruta para autenticación con Google
router.post('/google', googleAuth);

// Ruta para autenticación con Facebook
router.post('/facebook', facebookAuth);

export default router;