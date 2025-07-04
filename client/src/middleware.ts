import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware para manejar la autenticación y protección de rutas
 */
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log(`[Middleware] Path: ${pathname}`);

    // Obtener el token de autenticación
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production'
    });

    // Limpiar el fragmento #_=_ que Facebook añade a la URL
    if (req.nextUrl.hash === '#_=_') {
        const cleanUrl = req.nextUrl.clone();
        cleanUrl.hash = '';
        return NextResponse.redirect(cleanUrl);
    }

    // Proteger rutas que comienzan con /usuarios
    if (pathname.startsWith('/usuarios')) {
        console.log('[Middleware] Verifying token for /usuarios...');

        if (!token) {
            console.log('[Middleware] No token found. Redirecting to /auth/signin.');
            const url = new URL('/auth/signin', req.url);
            // Guardar la URL completa a la que se intentaba acceder para redirigir después del login
            url.searchParams.set('callbackUrl', encodeURIComponent(req.nextUrl.href));
            return NextResponse.redirect(url, { status: 302 }); // Redirección explícita con 302
        }

        console.log('[Middleware] Token found. Allowing access to /usuarios.');
        console.log('[Middleware] Token details:', JSON.stringify(token, null, 2));
    }

    // Redirigir a /usuarios si un usuario autenticado intenta acceder a /auth/signin
    if (pathname.startsWith('/auth/signin') && token) {
        console.log('[Middleware] User already authenticated. Redirecting to /usuarios.');
        return NextResponse.redirect(new URL('/usuarios', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/usuarios/:path*',
        '/auth/signin',
    ],
};