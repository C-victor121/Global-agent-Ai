import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log(`[Middleware] Path: ${pathname}`);

    // Proteger rutas que comienzan con /usuarios
    if (pathname.startsWith('/usuarios')) {
        console.log('[Middleware] Verifying token for /usuarios...');
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            console.log('[Middleware] No token found. Redirecting to /auth/signin.');
            const url = new URL('/auth/signin', req.url);
            url.searchParams.set('callbackUrl', req.nextUrl.href); // Guardar la URL completa a la que se intentaba acceder
            return NextResponse.redirect(url, { status: 302 }); // Redirección explícita con 302
        }

        console.log('[Middleware] Token found. Allowing access to /usuarios.');
        console.log('[Middleware] Token details:', JSON.stringify(token, null, 2));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/usuarios/:path*',
    ],
};