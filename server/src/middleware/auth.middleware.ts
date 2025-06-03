import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = process.env.NEXTAUTH_SECRET;

interface CustomUserPayload extends JwtPayload {
  sub?: string; 
  id?: string; 
  email?: string;
  name?: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CustomUserPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Intentar obtener el token de la cabecera Authorization (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Si no está en la cabecera, intentar obtenerlo de las cookies (ajusta el nombre de la cookie si es necesario)
  // Esta es una forma común si NextAuth en el cliente lo establece como una cookie httpOnly.
  // El nombre exacto de la cookie puede variar según tu configuración de NextAuth.
  if (!token) {
    const cookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token';
    token = req.cookies?.[cookieName];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  if (!secret) {
    console.error('JWT secret is not configured.');
    return res.status(500).json({ message: 'Internal server error: JWT secret missing' });
  }

  try {
    const decoded = jwt.verify(token, secret) as CustomUserPayload;
    
    req.user = {
      id: decoded.sub || decoded.id, // 'sub' es el estándar para el ID de usuario en JWT
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      ...decoded // Incluye cualquier otro campo del token
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    // Diferenciar errores de token inválido/expirado de otros errores
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token is not valid' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};