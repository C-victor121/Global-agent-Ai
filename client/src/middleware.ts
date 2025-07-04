import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    console.log(`[Middleware] Path: ${req.nextUrl.pathname}`);
    const allCookies = req.cookies.getAll();
    console.log('[Middleware] All Cookies:', JSON.stringify(allCookies, null, 2));

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('[Middleware] Token:', JSON.stringify(token, null, 2));

    const { pathname } = req.nextUrl;

    // Si el usuario está autenticado y trata de acceder a /auth/signin, redirigir a /usuarios
    if (token && pathname.startsWith('/auth/signin')) {
        console.log('[Middleware] User is authenticated, redirecting from /auth/signin to /usuarios');
        return NextResponse.redirect(new URL('/usuarios', req.url));
    }

    // Proteger rutas que comienzan con /usuarios
    if (pathname.startsWith('/usuarios')) {
        if (!token) {
            console.log('[Middleware] No token found for /usuarios, redirecting to /auth/signin');
            const url = new URL('/auth/signin', req.url);
            url.searchParams.set('callbackUrl', req.url);
            return NextResponse.redirect(url);
        }
    }

    console.log(`[Middleware] Allowing request to ${pathname}`);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/usuarios/:path*',
        '/auth/signin',
    ],
};