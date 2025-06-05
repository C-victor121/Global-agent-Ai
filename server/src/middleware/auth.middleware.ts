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
    console.log('🔐 Auth middleware iniciado');
    console.log('📋 Headers disponibles:', Object.keys(req.headers));
    console.log('🍪 Cookies disponibles:', req.headers.cookie);
    
    // Usar getToken de next-auth/jwt para descifrar el token JWE
    const token = await getToken({ 
      req: req as any, 
      secret: process.env.NEXTAUTH_SECRET!,
      cookieName: 'next-auth.session-token'
    });

    if (!token) {
      console.log('❌ No se encontró token de autenticación válido');
      res.status(401).json({ 
        success: false, 
        message: 'Token de autenticación requerido' 
      });
      return;
    }

    console.log('✅ Token descifrado exitosamente');
    console.log('📄 Payload del token:', token);

    // Adjuntar la información del usuario al objeto de solicitud
    req.user = {
      id: token.sub || token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: (token.role as string) || 'user'
    };

    console.log('👤 Usuario autenticado:', req.user);
    next();
  } catch (error: any) {
    console.error('❌ Error en auth middleware:', error.message);
    
    res.status(401).json({ 
      success: false, 
      message: 'Error de autenticación: ' + error.message
    });
  }
};
