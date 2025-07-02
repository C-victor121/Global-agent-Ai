import { getToken } from 'next-auth/jwt';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    // Usar getToken de next-auth/jwt para descifrar el token JWE
    const token = await getToken({ 
      req: req as any, 
      secret: process.env.NEXTAUTH_SECRET!,
      cookieName: 'next-auth.session-token'
    });

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Token de autenticación requerido' 
      });
      return;
    }

    // Adjuntar la información del usuario al objeto de solicitud
    req.user = {
      id: token.sub || token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: (token.role as string) || 'user'
    };

    next();
  } catch (error: any) {
    console.error('❌ Error en auth middleware:', error.message);
    
    res.status(401).json({ 
      success: false, 
      message: 'Error de autenticación: ' + error.message
    });
  }
};

// Alias para compatibilidad con las rutas del dashboard
export const authenticateToken = authMiddleware;
