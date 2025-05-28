import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      role: string;
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    }
  }

  interface Profile {
    id?: string;
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
    picture?: string;
    role: string;
  }
}

const handler = NextAuth({
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
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/signin`, {
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

          if (!data.success) {
            console.error('Error de autenticación:', data.message);
            return null;
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.avatar || null,
            role: data.user.role
          };
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

          if (!response.ok) {
            console.error(`Error del servidor durante la autenticación de Google: ${response.status}`);
            return false;
          }

          const data = await response.json();
          if (!data.success) {
            console.error('Fallo en la autenticación de Google:', data);
            return false;
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

          if (!response.ok) {
            console.error(`Error del servidor durante la autenticación de Facebook: ${response.status}`);
            return false;
          }

          const data = await response.json();
          if (!data.success) {
            console.error('Fallo en la autenticación de Facebook:', data);
            return false;
          }

          return true;
        } catch (error) {
          console.error('Error inesperado durante la autenticación de Facebook:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile, trigger }) {
      console.log('!!! JWT callback - INICIO', { token: {...token}, user, account, trigger });
      // Cuando el usuario inicia sesión (con credenciales o OAuth), el objeto `user` está presente.
      if (user) {
        console.log('!!! JWT callback - Usuario presente (signIn o OAuth)', { user });
        token.id = user.id;
        // Aseguramos que el rol se tome del objeto user si existe, sino se mantiene el del token o se pone 'user'
        token.role = user.role || token.role || 'user'; 
        token.picture = user.image; // Para consistencia con OAuth
      }
      console.log('!!! JWT callback - FIN, token a retornar:', {...token});
      return token;
    },
    async session({ session, token }) {
      console.log('!!! Session callback - INICIO', { session: {...session}, token: {...token} });
      if (session?.user) {
        // El `id` del usuario usualmente viene de `token.sub` o `token.id` que asignamos en `jwt`
        session.user.id = token.id as string || token.sub;
        // El `role` del usuario viene de `token.role` que asignamos en `jwt`
        session.user.role = token.role as string || 'user'; // Default a 'user' si no está
        session.user.image = token.picture as string || session.user.image; // Mantener imagen si existe
      }
      console.log('!!! Session callback - FIN, sesión a retornar:', {...session});
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
});

export { handler as GET, handler as POST };