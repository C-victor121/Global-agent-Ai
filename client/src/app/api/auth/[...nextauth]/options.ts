import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Error de autenticación');
          }

          const userRole = data.user.role || 'user';

          const user = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.avatar || null,
            role: userRole
          };

          return user;
        } catch (error) {
          console.error('Error al autenticar usuario:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }

      if (trigger === 'update' && session?.user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${token.id}`);
          if (res.ok) {
            const updatedUser = await res.json();
            if (updatedUser) {
              token.role = updatedUser.role;
            }
          }
        } catch (error) {
          console.error('Error actualizando rol del usuario:', error);
        }
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const provider = account.provider;
        let providerId;

        if (provider === 'google') {
          providerId = profile.sub;
        } else if (provider === 'facebook') {
          providerId = profile.id?.toString();
        }

        try {
          console.log(`[NextAuth] Iniciando autenticación con ${provider}`, { 
            name: user.name,
            email: user.email,
            providerId,
            avatar: user.image
          });

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}` , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              [`${provider}Id`]: providerId,
              avatar: user.image,
            }),
          });

          const data = await res.json();
          console.log(`[NextAuth] Respuesta del servidor para ${provider}:`, data);

          if (!res.ok || !data.success) {
            console.error(`[NextAuth] Error en la autenticación con ${provider}:`, data.message || 'Error desconocido');
            return false;
          }

          if (data.data) {
            user.id = data.data.id;
            user.role = data.data.role;
            console.log(`[NextAuth] Usuario autenticado con ${provider}:`, { id: user.id, role: user.role });
          }

          return true;
        } catch (error) {
          console.error(`[NextAuth] Error inesperado en la autenticación con ${provider}:`, error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth] Redirect callback:', { url, baseUrl });
      
      // Decodificar la URL si está codificada
      let decodedUrl = url;
      try {
        // Verificar si la URL parece estar codificada
        if (url.includes('%2F')) {
          decodedUrl = decodeURIComponent(url);
          console.log('[NextAuth] URL decodificada:', decodedUrl);
        }
      } catch (error) {
        console.error('[NextAuth] Error al decodificar URL:', error);
      }
      
      // Permite redirecciones relativas
      if (decodedUrl.startsWith('/')) {
        const redirectUrl = `${baseUrl}${decodedUrl}`;
        console.log('[NextAuth] Redirigiendo a URL relativa:', redirectUrl);
        return redirectUrl;
      }
      
      // Permite redirecciones a otros orígenes si son del mismo dominio
      try {
        const urlOrigin = new URL(decodedUrl).origin;
        const baseUrlOrigin = new URL(baseUrl).origin;
        
        if (urlOrigin === baseUrlOrigin) {
          console.log('[NextAuth] Redirigiendo a URL del mismo origen:', decodedUrl);
          return decodedUrl;
        }
      } catch (error) {
        console.error('[NextAuth] Error al analizar URL:', error);
      }
      
      // Por defecto, redirigir a la URL base
      console.log('[NextAuth] Redirigiendo a URL base:', baseUrl);
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 24 * 30, // 30 días
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.globalsolarco.shop' : undefined,
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.globalsolarco.shop' : undefined,
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.csrf-token' // Cambiado de __Host- a __Secure-
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.globalsolarco.shop' : undefined,
      },
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export { authOptions };
