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
            console.error('Error de autenticación desde el backend:', data.message);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${token.id}`);
        if (res.ok) {
          const updatedUser = await res.json();
          if (updatedUser) {
            token.role = updatedUser.role;
          }
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
          if (!res.ok || !data.success) {
            console.error(`Fallo en la autenticación de ${provider}:`, data.message || res.status);
            return false;
          }

          if (data.data) {
            user.id = data.data.id;
            user.role = data.data.role;
          }

          return true;
        } catch (error) {
          console.error(`Error inesperado durante la autenticación de ${provider}:`, error);
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
      // Si el inicio de sesión es exitoso (la URL es la base), redirige a /usuarios.
      if (url === baseUrl || url.startsWith(`${baseUrl}/#`)) {
        return `${baseUrl}/usuarios`;
      }
      // Si la URL es relativa, la resuelve.
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Permite redirecciones a otros orígenes.
      if (new URL(url).origin !== new URL(baseUrl).origin) {
        return url;
      }
      // Por defecto, redirige a la URL base.
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
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
