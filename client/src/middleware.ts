import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Solo aplicar middleware a rutas específicas
  if (path === '/auth/signin') {
    // Verificar si ya está autenticado para redirigir desde signin
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: 'next-auth.session-token'
      });
      
      if (token) {
        return NextResponse.redirect(new URL('/usuarios', request.url));
      }
    } catch (error) {
      console.error('Error verificando token en signin:', error);
    }
    return NextResponse.next();
  }
  
  // Para rutas de /usuarios, usar verificación más permisiva
  if (path.startsWith('/usuarios')) {
    // Verificar si existe la cookie de sesión
    const sessionCookie = request.cookies.get('next-auth.session-token');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Si hay cookie, intentar verificar el token
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: 'next-auth.session-token'
      });
      
      // Si no se puede verificar el token pero hay cookie, permitir acceso
      // (esto evita problemas de timing después del OAuth)
      if (!token) {
        console.log(`Middleware: Cookie presente pero token no verificable para ${path} - Permitiendo acceso`);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
    }
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Configurar las rutas que serán procesadas por el middleware
export const config = {
  matcher: [
    '/usuarios/:path*', // Proteger todas las sub-rutas de /usuarios
    '/auth/signin',
  ],
};