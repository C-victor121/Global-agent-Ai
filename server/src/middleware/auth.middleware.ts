import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// IMPORTANTE: Mueve este secreto a tus variables de entorno (.env)
// y cárgalo usando un paquete como dotenv.
// Ejemplo: const TOKEN_SECRET = process.env.TOKEN_SECRET || 'tu_secreto_por_defecto';
const TOKEN_SECRET = 'someSecretKey'; // ¡CAMBIA ESTO POR UN SECRETO SEGURO Y GUÁRDALO EN .env!

interface UserPayload {
  id: string;
  // Agrega aquí otros campos que esperas en el payload del token
  // email?: string;
  // role?: string;
}

// Extiende la interfaz Request de Express para incluir la propiedad 'user'
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authRequired = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as UserPayload;
    req.user = decoded; // Adjunta el payload del usuario al objeto request
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};