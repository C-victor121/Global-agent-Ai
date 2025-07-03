import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Definir rutas públicas que no requieren autenticación
  const publicPaths = ['/', '/auth/signin', '/auth/error', '/api/auth', '/como-funciona', '/contacto', '/planes', '/servicios', '/testimonios'];
  
  // Verificar si la ruta actual es pública
  const isPublicPath = publicPaths.some(publicPath => {
    if (publicPath === '/') {
      return path === publicPath;
    }
    return path.startsWith(publicPath);
  });

  // Obtener el token de autenticación
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Redirigir a la página de inicio si intenta acceder a una ruta protegida sin autenticación
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirigir a la página de usuarios si intenta acceder a la página de inicio de sesión estando autenticado
  if (token && (path === '/auth/signin')) {
    return NextResponse.redirect(new URL('/usuarios', request.url));
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