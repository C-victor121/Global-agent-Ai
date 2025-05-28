import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

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
        console.log('!!! Authorize callback INICIADO con credenciales:', credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log('!!! Authorize callback: Credenciales incompletas, retornando null.');
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

          console.log('Datos recibidos del backend:', data);
          console.log('Usuario completo del backend:', data.user);
          
          // Asegurarse de que el rol esté presente en la respuesta
          if (!data.user.role) {
            console.error('No se encontró el rol en la respuesta del backend');
          }
          
          const userRole = data.user.role || 'user';
          console.log('Authorize callback - rol del usuario:', userRole);
          
          const user = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.avatar || null,
            role: userRole
          };
          
          console.log('Usuario construido para NextAuth:', user);
          console.log('!!! Authorize callback: Retornando usuario:', user);
          return user;
        } catch (error) {
          console.error('Error al autenticar usuario:', error);
          console.log('!!! Authorize callback: Error en try-catch, retornando null.');
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
    async jwt({ token, user, account, trigger }) {
      console.log('JWT callback - datos recibidos:', { token, user, account, trigger });
      
      // Si es un inicio de sesión, actualizar el token con los datos del usuario
      if (user) {
        console.log('JWT callback - datos del usuario:', user);
        token.role = user.role || 'user';
        console.log('JWT callback - rol asignado al token:', token.role);
      } else {
        console.log('JWT callback - usando rol existente del token:', token.role);
      }
      
      // Si es una actualización de sesión, forzar la recarga del rol desde la base de datos
      if (trigger === 'update') {
        console.log('Actualizando sesión, recargando datos del usuario...');
        try {
          // Obtener el ID del usuario del token
          const userId = token.sub;
          if (userId) {
            // Realizar una solicitud a la API para obtener los datos actualizados del usuario
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token.jti}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              if (userData.success && userData.data) {
                // Actualizar el rol en el token con los datos más recientes
                token.role = userData.data.role || 'user';
                console.log('Rol actualizado en el token:', token.role);
              }
            }
          }
        } catch (error) {
          console.error('Error al recargar datos del usuario:', error);
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

          if (!response.ok) {
            console.error(`Error del servidor durante la autenticación de Google: ${response.status}`);
            return false;
          }

          const data = await response.json();
          if (!data.success) {
            console.error('Fallo en la autenticación de Google:', data);
            return false;
          }
          
          // Asignar el rol del usuario recibido del backend
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

          if (!response.ok) {
            console.error(`Error del servidor durante la autenticación de Facebook: ${response.status}`);
            return false;
          }

          const data = await response.json();
          if (!data.success) {
            console.error('Fallo en la autenticación de Facebook:', data);
            return false;
          }
          
          // Asignar el rol del usuario recibido del backend
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
      console.log('Session callback - token recibido:', token);
      console.log('Session callback - sesión inicial:', session);

      if (session?.user) {
        session.user.id = token.sub;
        
        // Verificar el rol en el token
        console.log('Session callback - rol en el token:', token.role);
        
        // Asegurarse de que el rol siempre tenga un valor por defecto
        if (!token.role) {
          console.warn('Session callback - token sin rol, asignando valor por defecto');
          token.role = 'user';
        }
        
        // Asignar el rol desde el token JWT a la sesión
        session.user.role = token.role as string;
        
        console.log('Session callback - sesión final:', {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role
        });
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
};