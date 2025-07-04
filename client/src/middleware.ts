import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Utilidad para centralizar logs del middleware
function logMiddleware(message: string, data?: unknown) {
  if (data !== undefined) {
    console.log(`[Middleware] ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[Middleware] ${message}`);
  }
}

// Utilidad para verificar autenticación
async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) return true;
  const sessionCookie = req.cookies.get('next-auth.session-token');
  return Boolean(sessionCookie);
}

export async function middleware(req: NextRequest) {
    logMiddleware(`Path: ${req.nextUrl.pathname}`);
    const allCookies = req.cookies.getAll();
    logMiddleware('All Cookies:', allCookies);
    if (allCookies.length === 0) {
        logMiddleware('No cookies recibidas en la petición.');
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    logMiddleware('Token:', token);
    if (!token) {
        logMiddleware('Token no encontrado o inválido.');
    }

    const { pathname } = req.nextUrl;

    // Si el usuario está autenticado y trata de acceder a /auth/signin, redirigir a /usuarios
    if ((token || (await isAuthenticated(req))) && pathname.startsWith('/auth/signin')) {
        logMiddleware('User is authenticated, redirecting from /auth/signin to /usuarios');
        return NextResponse.redirect(new URL('/usuarios', req.url));
    }

    // Proteger rutas que comienzan con /usuarios
    if (pathname.startsWith('/usuarios')) {
        if (!(token || (await isAuthenticated(req)))) {
            logMiddleware('No token ni cookie de sesión para /usuarios, redirigiendo a /auth/signin');
            const url = new URL('/auth/signin', req.url);
            url.searchParams.set('callbackUrl', req.url);
            return NextResponse.redirect(url);
        }
    }

    logMiddleware(`Allowing request to ${pathname}`);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/usuarios/:path*',
        '/auth/signin',
    ],
};