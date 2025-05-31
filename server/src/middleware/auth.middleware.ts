import { Request, Response, NextFunction } from 'express';
import { getToken } from 'next-auth/jwt';

// Asegúrate de que NEXTAUTH_SECRET esté configurada en tus variables de entorno (.env)
// y que coincida con la usada en la configuración de NextAuth en el cliente.
const secret = process.env.NEXTAUTH_SECRET;

interface UserPayload {
  sub?: string; // 'sub' es comúnmente usado por next-auth para el id del usuario
  id?: string; // Mantenemos 'id' por si se usa en otras partes o se prefiere
  email?: string;
  name?: string;
  role?: string;
  // Agrega aquí otros campos que esperas en el payload del token
}

// Extiende la interfaz Request de Express para incluir la propiedad 'user'
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Intenta obtener el token de la cookie 'next-auth.session-token' o '__Secure-next-auth.session-token'
  const token = await getToken({ req, secret, cookieName: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token' });

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // El token ya está verificado y decodificado por getToken
    // El payload del token (que puede incluir id, email, role, etc.) está en 'token'
    // Puedes ajustar UserPayload según lo que necesites y lo que devuelva tu configuración de NextAuth
    req.user = {
      id: token.sub || token.id, // Usa 'sub' o 'id' según esté disponible
      email: token.email,
      name: token.name,
      role: token.role as string | undefined, // Asegúrate de que 'role' esté en tu token si lo necesitas
      ...token // Incluye cualquier otro campo del token
    } as UserPayload;
    next();
  } catch (error) {
    console.error('Token processing error:', error);
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};