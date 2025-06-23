# Guía del Frontend - Global Agent AI

## Tecnologías y Dependencias Principales

### Core Framework
- **Next.js 15.3.2**: Framework React con App Router
- **React 18.2.0**: Biblioteca de interfaz de usuario
- **TypeScript 5.0.4**: Tipado estático para JavaScript

### Estilos y UI
- **Tailwind CSS 3.3.2**: Framework de utilidades CSS
- **Framer Motion 12.12.1**: Biblioteca de animaciones
- **React Icons 5.5.0**: Iconos como componentes React
- **PostCSS 8.4.23**: Procesador de CSS

### Autenticación y Estado
- **NextAuth.js 4.24.11**: Autenticación completa
- **React Context**: Manejo de estado global
- **React Hot Toast 2.5.2**: Notificaciones

### Comunicación y Datos
- **Axios 1.9.0**: Cliente HTTP
- **Zod 3.25.7**: Validación de esquemas
- **Recharts 2.15.3**: Gráficos y visualizaciones

### Utilidades
- **Archiver 7.0.1**: Compresión de archivos
- **MongoDB 6.16.0**: Driver de MongoDB (para NextAuth)
- **bcrypt 6.0.0**: Encriptación de contraseñas

## Estructura de Directorios

```
client/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── page.tsx           # Página principal
│   │   ├── layout.tsx         # Layout raíz
│   │   ├── globals.css        # Estilos globales
│   │   ├── dashboard/         # Panel de control
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── auth/              # Autenticación
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── content/           # Generación de contenido
│   │   ├── legal/             # Asistente legal
│   │   └── api/               # API Routes
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/                # Componentes base
│   │   ├── forms/             # Formularios
│   │   ├── layout/            # Layout components
│   │   └── dashboard/         # Dashboard específicos
│   ├── context/               # Contextos React
│   ├── providers/             # Providers
│   ├── services/              # Servicios API
│   ├── types/                 # Tipos TypeScript
│   ├── images/                # Recursos de imagen
│   └── middleware.ts          # Middleware Next.js
├── public/                    # Archivos estáticos
├── .next/                     # Build output (generado)
├── Dockerfile                 # Configuración Docker
├── next.config.js             # Configuración Next.js
├── tailwind.config.js         # Configuración Tailwind
├── postcss.config.js          # Configuración PostCSS
└── tsconfig.json              # Configuración TypeScript
```

## App Router de Next.js

### Configuración del Layout Principal

**Archivo**: `src/app/layout.tsx`

```typescript
import { Inter } from 'next/font/google'
import { AuthProvider } from "../providers/AuthProvider"
import type { Session } from "next-auth"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Global Agent AI',
  description: 'Una aplicación de agentes AI moderna y eficiente',
}

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider session={session}>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Página Principal

**Archivo**: `src/app/page.tsx`

La página principal incluye:
- **Hero Section**: Presentación principal con animaciones
- **Características**: Grid de funcionalidades
- **Call to Action**: Botones de acción principales
- **Animaciones**: Transiciones con Framer Motion

## Sistema de Rutas

### Rutas Principales

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `app/page.tsx` | Página de inicio |
| `/dashboard` | `app/dashboard/page.tsx` | Panel de control |
| `/auth/signin` | `app/auth/signin/page.tsx` | Inicio de sesión |
| `/auth/signup` | `app/auth/signup/page.tsx` | Registro |
| `/content` | `app/content/page.tsx` | Generación de contenido |
| `/legal` | `app/legal/page.tsx` | Asistente legal |

### Rutas Protegidas

Utilizamos middleware para proteger rutas que requieren autenticación:

**Archivo**: `src/middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Lógica adicional de middleware
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/content/:path*", "/legal/:path*"]
}
```

## Componentes Reutilizables

### Estructura de Componentes

```
components/
├── ui/                        # Componentes base
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── Loading.tsx
├── forms/                     # Formularios específicos
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   ├── ContentForm.tsx
│   └── ContactForm.tsx
├── layout/                    # Componentes de layout
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Header.tsx
└── dashboard/                 # Dashboard específicos
    ├── StatsCard.tsx
    ├── Chart.tsx
    ├── UserTable.tsx
    └── ActivityFeed.tsx
```

### Ejemplo de Componente Base

**Archivo**: `src/components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90': variant === 'primary',
            'bg-gray-800 text-white hover:bg-gray-700': variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
            'hover:bg-gray-100': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

## Autenticación con NextAuth.js

### Configuración del Provider

**Archivo**: `src/providers/AuthProvider.tsx`

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface AuthProviderProps {
  children: React.ReactNode
  session: Session | null
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
```

### Configuración de NextAuth

**Archivo**: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Lógica de autenticación personalizada
        const res = await fetch(`${process.env.INTERNAL_API_URL}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        })
        
        const user = await res.json()
        
        if (res.ok && user) {
          return user
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

## Servicios API

### Estructura de Servicios

```
services/
├── api.ts                     # Cliente HTTP base
├── auth.service.ts            # Servicios de autenticación
├── content.service.ts         # Servicios de contenido
├── legal.service.ts           # Servicios legales
├── dashboard.service.ts       # Servicios del dashboard
└── user.service.ts            # Servicios de usuario
```

### Cliente HTTP Base

**Archivo**: `src/services/api.ts`

```typescript
import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login si no está autenticado
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Servicio de Contenido

**Archivo**: `src/services/content.service.ts`

```typescript
import api from './api'

export interface ContentRequest {
  type: 'blog' | 'social' | 'email'
  topic: string
  tone: 'professional' | 'casual' | 'friendly'
  length: 'short' | 'medium' | 'long'
}

export interface ContentResponse {
  id: string
  content: string
  type: string
  createdAt: string
}

export const contentService = {
  async generateContent(request: ContentRequest): Promise<ContentResponse> {
    const response = await api.post('/content/generate', request)
    return response.data
  },

  async getHistory(): Promise<ContentResponse[]> {
    const response = await api.get('/content/history')
    return response.data
  },

  async saveContent(id: string): Promise<void> {
    await api.post('/content/save', { id })
  },

  async deleteContent(id: string): Promise<void> {
    await api.delete(`/content/${id}`)
  },

  async deleteAllContent(): Promise<void> {
    await api.delete('/content/all')
  }
}
```

## Manejo de Estado

### Context API para Estado Global

**Archivo**: `src/context/AppContext.tsx`

```typescript
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

interface AppState {
  user: User | null
  loading: boolean
  notifications: Notification[]
}

interface AppAction {
  type: 'SET_USER' | 'SET_LOADING' | 'ADD_NOTIFICATION' | 'REMOVE_NOTIFICATION'
  payload?: any
}

const initialState: AppState = {
  user: null,
  loading: false,
  notifications: []
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
```

## Estilos con Tailwind CSS

### Configuración de Tailwind

**Archivo**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#faf5ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
```

### Estilos Globales

**Archivo**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-black text-white;
  }
}

@layer components {
  .btn-primary {
    @apply bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity;
  }
  
  .card {
    @apply bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20;
  }
  
  .input {
    @apply w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent;
  }
}
```

## Animaciones con Framer Motion

### Componente Animado de Ejemplo

```typescript
import { motion } from 'framer-motion'

const AnimatedCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      {children}
    </motion.div>
  )
}
```

## Conexión con el Backend

### Variables de Entorno del Frontend

```env
# URLs de la aplicación
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
NEXTAUTH_URL=https://tu-dominio.com
INTERNAL_API_URL=http://server:3001

# Webhooks de n8n
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://tu-dominio.com/webhook/content-generation
NEXT_PUBLIC_N8N_LEGAL_ASSISTANT_WEBHOOK_URL=https://tu-dominio.com/webhook/legal-assistant

# Autenticación
NEXTAUTH_SECRET=tu-secret-muy-seguro
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
FACEBOOK_CLIENT_ID=tu-facebook-client-id
FACEBOOK_CLIENT_SECRET=tu-facebook-client-secret
```

### Configuración de Next.js

**Archivo**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'tu-dominio.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
```

## Optimización y Performance

### Técnicas Implementadas

1. **Server Components**: Renderizado del lado del servidor por defecto
2. **Code Splitting**: Carga lazy de componentes pesados
3. **Image Optimization**: Componente Image de Next.js
4. **Font Optimization**: Google Fonts optimizadas
5. **Bundle Analysis**: Análisis del tamaño del bundle

### Ejemplo de Lazy Loading

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Cargando...</div>,
  ssr: false
})
```

## Testing (Recomendado)

### Configuración Sugerida

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### Ejemplo de Test

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

Esta guía proporciona una base sólida para entender y trabajar con el frontend de Global Agent AI, aprovechando las mejores prácticas de Next.js y React.