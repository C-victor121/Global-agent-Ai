import { Router } from 'express';
import { googleAuth, facebookAuth, signup, login, signin } from '../controllers/auth.controller';

const router = Router();

// Ruta para autenticación con Google
router.post('/google', googleAuth);

// Ruta para autenticación con Facebook
router.post('/facebook', facebookAuth);

// Ruta para registro de usuario con email y contraseña
router.post('/signup', signup);

// Ruta para inicio de sesión con email y contraseña
router.post('/login', login);

// Ruta para autenticación con NextAuth
router.post('/signin', signin);

export default router;