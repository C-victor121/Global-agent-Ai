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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signin`, {
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
      if (account?.provider === 'google') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google`, {
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

          const data = await res.json();
          if (!res.ok || !data.success) {
            console.error('Fallo en la autenticación de Google:', data.message || res.status);
            return false;
          }

          if (data.data) {
            user.id = data.data.id;
            user.role = data.data.role;
          }

          return true;
        } catch (error) {
          console.error('Error inesperado durante la autenticación de Google:', error);
          return false;
        }
      } else if (account?.provider === 'facebook') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facebook`, {
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

          const data = await res.json();
          if (!res.ok || !data.success) {
            console.error('Fallo en la autenticación de Facebook:', data.message || res.status);
            return false;
          }

          if (data.data) {
            user.id = data.data.id;
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
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/usuarios`;
      } else if (url.startsWith('http')) {
        return url;
      }
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
