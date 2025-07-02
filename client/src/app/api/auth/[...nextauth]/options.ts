import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
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
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            console.error('Error de autenticación:', data.message);
            return null;
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
        // Lógica para actualizar el token cuando se llama `update`
        // Por ejemplo, si se actualiza el rol del usuario
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${token.id}`);
        if (response.ok) {
          const updatedUser = await response.json();
          if (updatedUser) {
            token.role = updatedUser.role;
          }
        }
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              googleId: profile.sub,
              avatar: user.image,
            }),
          });

          const data = await response.json();
          if (!response.ok || !data.success) {
            console.error('Fallo en la autenticación de Google:', data.message || response.status);
            return false;
          }
          
          if (data.data && data.data.role) {
            user.role = data.data.role;
          }
          
          return true;
        } catch (error) {
          console.error('Error inesperado durante la autenticación de Google:', error);
          return false;
        }
      } else if (account?.provider === 'facebook') {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              facebookId: profile.id?.toString(),
              avatar: user.image,
            }),
          });

          const data = await response.json();
          if (!response.ok || !data.success) {
            console.error('Fallo en la autenticación de Facebook:', data.message || response.status);
            return false;
          }
          
          if (data.data && data.data.role) {
            user.role = data.data.role;
          }
          
          return true;
        } catch (error) {
          console.error('Error inesperado durante la autenticación de Facebook:', error);
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
      // Redirigir a la página de usuarios después del inicio de sesión
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/usuarios`;
      }
      // Si es una URL externa, mantener la URL original
      else if (url.startsWith('http')) {
        return url;
      }
      // Por defecto, redirigir a la URL base
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Configurar la duración de la sesión para que se actualice con frecuencia
  session: {
    // La estrategia JWT almacena la información de la sesión en una cookie del navegador
    strategy: 'jwt',
    // Establecer un tiempo máximo de sesión para forzar la actualización
    maxAge: 24 * 60 * 60, // 1 día en segundos
  },
  // Configuración de cookies para producción
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.globalsolarco.shop' : undefined
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.globalsolarco.shop' : undefined
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.globalsolarco.shop' : undefined
      }
    }
  },
};

