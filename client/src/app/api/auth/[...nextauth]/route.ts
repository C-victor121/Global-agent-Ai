import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    }
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
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
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
});

export { handler as GET, handler as POST };