# Estructura del Proyecto Global Agent AI

## Visión General de la Arquitectura

Global Agent AI está construido con una **arquitectura de microservicios** que separa claramente las responsabilidades y permite escalabilidad independiente de cada componente.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Automatización│
│   (Next.js)     │◄──►│   (Express)     │◄──►│                 │
│   Puerto 3000   │    │   Puerto 3001   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    MongoDB      │
                    │   Puerto 27017  │
                    └─────────────────┘
```

## Componentes Principales

### 🎨 Frontend (Client)
**Ubicación**: `/client/`
**Tecnología**: Next.js 15 + TypeScript + Tailwind CSS

#### Estructura del Cliente
```
client/
├── src/
│   ├── app/                    # App Router de Next.js 13+
│   │   ├── page.tsx           # Página principal
│   │   ├── layout.tsx         # Layout global
│   │   ├── dashboard/         # Panel de control
│   │   ├── auth/              # Páginas de autenticación
│   │   └── api/               # API Routes de Next.js
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/                # Componentes base (botones, inputs)
│   │   ├── forms/             # Formularios específicos
│   │   ├── layout/            # Componentes de layout
│   │   └── dashboard/         # Componentes del dashboard
│   ├── context/               # Contextos de React
│   ├── providers/             # Providers (AuthProvider, etc.)
│   ├── services/              # Servicios para llamadas API
│   ├── types/                 # Definiciones de tipos TypeScript
│   ├── images/                # Recursos de imagen
│   └── middleware.ts          # Middleware de Next.js
├── public/                    # Archivos estáticos
├── Dockerfile                 # Configuración Docker
├── next.config.js             # Configuración de Next.js
├── tailwind.config.js         # Configuración de Tailwind
└── package.json               # Dependencias del frontend
```

#### Características del Frontend
- **App Router**: Utiliza el nuevo sistema de rutas de Next.js 13+
- **Server Components**: Renderizado del lado del servidor por defecto
- **Client Components**: Componentes interactivos marcados con 'use client'
- **Autenticación**: NextAuth.js con proveedores sociales
- **Estado Global**: Context API para manejo de estado
- **Estilos**: Tailwind CSS con componentes personalizados
- **Animaciones**: Framer Motion para transiciones fluidas

### ⚙️ Backend (Server)
**Ubicación**: `/server/`
**Tecnología**: Express.js + TypeScript + MongoDB

#### Estructura del Servidor
```
server/
├── src/
│   ├── controllers/           # Lógica de controladores
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── contentGeneration.controller.ts
│   │   ├── legalAssistant.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── payment.controller.ts
│   ├── middleware/            # Middleware personalizado
│   │   ├── auth.middleware.ts
│   │   ├── error.handler.ts
│   │   └── validation.middleware.ts
│   ├── models/                # Modelos de MongoDB
│   │   ├── User.model.ts
│   │   ├── Plan.model.ts
│   │   ├── ContentGeneration.model.ts
│   │   └── ContactMessage.model.ts
│   ├── routes/                # Definición de rutas
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── contentGeneration.routes.ts
│   │   ├── legalAssistant.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── twilio.routes.ts
│   │   └── whatsapp.routes.ts
│   ├── services/              # Lógica de negocio
│   │   ├── auth.service.ts
│   │   ├── n8n.service.ts
│   │   ├── twilio.service.ts
│   │   └── payment.service.ts
│   └── index.ts               # Punto de entrada
├── Dockerfile                 # Configuración Docker
├── tsconfig.json              # Configuración TypeScript
└── package.json               # Dependencias del backend
```

#### APIs Principales

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/login` | POST | Autenticación con email/password |
| `/api/auth/google` | POST | Autenticación con Google |
| `/api/auth/facebook` | POST | Autenticación con Facebook |
| `/api/content/generate` | POST | Generar contenido con IA |
| `/api/content/history` | GET | Historial de contenido generado |
| `/api/legal/consult` | POST | Consulta al asistente legal |
| `/api/dashboard/stats` | GET | Estadísticas del dashboard |
| `/api/twilio/webhook` | POST | Webhook de Twilio |
| `/api/whatsapp/webhook` | POST | Webhook de WhatsApp |
| `/api/payment/create` | POST | Crear pago con MercadoPago |

### 🤖 Automatización 
**Ubicación**: Servicio Docker independiente


#### Workflows Disponibles
- **Generación de Contenido**: Procesa solicitudes de contenido con IA
- **Asistente Legal**: Maneja consultas legales automatizadas
- **Notificaciones**: Envío de notificaciones por email/SMS
- **Integración WhatsApp**: Procesamiento de mensajes de WhatsApp

### 🗄️ Base de Datos (MongoDB)
**Ubicación**: Servicio Docker independiente
**Puerto**: 27017

#### Colecciones Principales
- **users**: Información de usuarios y autenticación
- **plans**: Planes de suscripción disponibles
- **contentgenerations**: Historial de contenido generado
- **contactmessages**: Mensajes de contacto
- **legalconsultations**: Consultas legales realizadas

### 🌐 Proxy Reverso (Nginx)
**Ubicación**: `/docker/nginx.conf`
**Puertos**: 80 (HTTP) → 443 (HTTPS)

#### Configuración de Rutas
- `/` → Frontend (Next.js en puerto 3000)
- `/api/` → Backend (Express en puerto 3001)
- `/n8n/` → n8n (puerto 5678)
- Certificados SSL automáticos con Let's Encrypt

## 📁 Directorio Shared
**Ubicación**: `/shared/`

Contiene código compartido entre frontend y backend:

```
shared/
└── validations/
    └── auth.schema.ts         # Esquemas de validación Zod
```

## 🐳 Configuración Docker
**Ubicación**: `/docker/`

### Servicios Definidos

| Servicio | Imagen | Puerto | Descripción |
|----------|--------|--------|-------------|
| `nginx` | Custom | 80, 443 | Proxy reverso con SSL |
| `client` | Custom | 3000 | Aplicación Next.js |
| `server` | Custom | 3001 | API Express |
| `mongo` | mongo:latest | 27017 | Base de datos MongoDB |
| Plataforma de automatización |

### Red Docker
Todos los servicios están conectados a la red `global_network` que permite comunicación interna entre contenedores.

### Volúmenes Persistentes
- `mongo_data`: Datos de MongoDB
- `./certbot`: Certificados SSL
- `./certbot-webroot`: Webroot para validación SSL
- ` Datos y workflows de n8n

## 🔄 Flujos de Datos Principales

### 1. Autenticación de Usuario
```
Usuario → Frontend → Backend → MongoDB
                  ↓
              JWT Token
                  ↓
            Almacenado en Cookie
```

### 2. Generación de Contenido
```
Usuario → Frontend → Backend → n8n Webhook → IA → Respuesta
                              ↓
                          MongoDB (Historial)
```

### 3. Procesamiento de WhatsApp
```
WhatsApp → Twilio → Backend Webhook → n8n → Respuesta Automática
```

## 🔧 Variables de Entorno

### Frontend (Client)
- `NEXT_PUBLIC_API_URL`: URL de la API backend
- `NEXTAUTH_URL`: URL base de la aplicación
- `NEXTAUTH_SECRET`: Secreto para NextAuth
- `GOOGLE_CLIENT_ID/SECRET`: Credenciales de Google OAuth
- `FACEBOOK_CLIENT_ID/SECRET`: Credenciales de Facebook OAuth

### Backend (Server)
- `PORT`: Puerto del servidor (3001)
- `MONGODB_URI`: URI de conexión a MongoDB
- `JWT_SECRET`: Secreto para tokens JWT
- `CLIENT_URL`: URL del frontend
- `TWILIO_*`: Credenciales de Twilio
- `MERCADOPAGO_*`: Credenciales de MercadoPago

### n8n
- `N8N_BASIC_AUTH_USER/PASSWORD`: Credenciales de acceso
- `N8N_HOST`: Host del servicio
- `WEBHOOK_URL`: URL base para webhooks

## 🚀 Escalabilidad

### Horizontal
- Cada servicio puede escalarse independientemente
- Load balancer con Nginx
- Base de datos MongoDB con replica sets

### Vertical
- Recursos ajustables por servicio en Docker Compose
- Optimización de memoria y CPU por contenedor

## 🔐 Seguridad

### Autenticación
- JWT tokens con expiración
- OAuth2 con Google y Facebook
- Middleware de autenticación en rutas protegidas

### Comunicación
- HTTPS obligatorio en producción
- CORS configurado para dominios específicos
- Headers de seguridad en Nginx

### Datos
- Contraseñas hasheadas con bcrypt
- Validación de entrada con Zod
- Sanitización de datos en MongoDB

Esta arquitectura modular permite un desarrollo ágil, mantenimiento sencillo y escalabilidad eficiente del sistema Global Agent AI.