# Global Agent AI 🤖

## Descripción del Proyecto

Global Agent AI es una plataforma avanzada de agentes de inteligencia artificial diseñada para transformar las ventas y atención al cliente de los negocios. Nuestros agentes de IA pueden entender, procesar y responder mensajes automáticamente como si fueran personas reales, atendiendo a los clientes las 24 horas del día, los 7 días de la semana a través de texto, audio e incluso llamadas telefónicas.

## 🚀 Características Principales

- **Agentes de IA Conversacionales**: Respuestas automáticas inteligentes y naturales
- **Múltiples Canales**: WhatsApp, llamadas telefónicas, chat web
- **Generación de Contenido**: Creación automática de contenido para marketing
- **Asistente Legal**: Asesoramiento legal automatizado
- **Dashboard Analytics**: Métricas y análisis en tiempo real
- **Autenticación Social**: Login con Google y Facebook
- **Pagos Integrados**: Procesamiento de pagos con MercadoPago
- **Arquitectura Escalable**: Microservicios con Docker

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.3.2** - Framework React con SSR/SSG
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **NextAuth.js** - Autenticación
- **React Hot Toast** - Notificaciones
- **Recharts** - Gráficos y visualizaciones

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas

### Integraciones
- **n8n** - Automatización de workflows
- **Twilio** - Comunicaciones (SMS, llamadas)
- **MercadoPago** - Procesamiento de pagos
- **WhatsApp Business API** - Mensajería

### DevOps
- **Docker & Docker Compose** - Containerización
- **Nginx** - Proxy reverso y balanceador de carga
- **Let's Encrypt** - Certificados SSL automáticos
- **Ubuntu Server** - Sistema operativo de producción

## 📋 Requisitos del Sistema

### Desarrollo
- Node.js 18+ 
- npm 9+
- Docker 20+
- Docker Compose 2+
- Git

### Producción
- Ubuntu Server 20.04+
- Docker 20+
- Docker Compose 2+
- Dominio configurado
- Puertos 80, 443 abiertos

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Global-agent-Ai
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# URLs de la aplicación
CLIENT_URL=https://tu-dominio.com
NEXTAUTH_URL=https://tu-dominio.com
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api

# Secretos de autenticación
NEXTAUTH_SECRET=tu-secret-muy-seguro
JWT_SECRET=tu-jwt-secret

# Autenticación social
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
FACEBOOK_CLIENT_ID=tu-facebook-client-id
FACEBOOK_CLIENT_SECRET=tu-facebook-client-secret

# n8n Configuration
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=tu-password-seguro
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://tu-dominio.com/webhook/content-generation
NEXT_PUBLIC_N8N_LEGAL_ASSISTANT_WEBHOOK_URL=https://tu-dominio.com/webhook/legal-assistant

# Twilio
TWILIO_ACCOUNT_SID=tu-twilio-sid
TWILIO_AUTH_TOKEN=tu-twilio-token
TWILIO_PHONE_NUMBER=tu-numero-twilio

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu-mp-access-token
MERCADOPAGO_PUBLIC_KEY=tu-mp-public-key
MERCADOPAGO_WEBHOOK_SECRET=tu-mp-webhook-secret

# Meta/Facebook
META_APP_SECRET=tu-meta-app-secret
```

### 3. Desarrollo Local

#### Opción A: Con Docker (Recomendado)
```bash
# Construir y ejecutar todos los servicios
cd docker
docker-compose up --build
```

#### Opción B: Desarrollo Nativo
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- n8n: http://localhost:5678

## 🌐 Despliegue en Producción

### 1. Preparar el Servidor
```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configurar el Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Desplegar la Aplicación
```bash
# Clonar el repositorio
git clone <repository-url>
cd Global-agent-Ai

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con tus valores

# Ejecutar el script de configuración SSL
cd docker
chmod +x setup-ssl.sh
./setup-ssl.sh
```

## 📁 Estructura del Proyecto

```
Global-agent-Ai/
├── 📄 README.md                 # Este archivo
├── 📄 package.json              # Configuración del workspace
├── 📁 client/                   # Aplicación frontend (Next.js)
│   ├── 📁 src/
│   │   ├── 📁 app/              # App Router de Next.js
│   │   ├── 📁 components/       # Componentes reutilizables
│   │   ├── 📁 context/          # Contextos de React
│   │   ├── 📁 providers/        # Providers (Auth, etc.)
│   │   ├── 📁 services/         # Servicios API
│   │   └── 📁 types/            # Tipos TypeScript
│   ├── 📄 Dockerfile            # Imagen Docker del cliente
│   └── 📄 package.json          # Dependencias del frontend
├── 📁 server/                   # API backend (Express)
│   ├── 📁 src/
│   │   ├── 📁 controllers/      # Controladores de rutas
│   │   ├── 📁 middleware/       # Middleware personalizado
│   │   ├── 📁 models/           # Modelos de MongoDB
│   │   ├── 📁 routes/           # Definición de rutas
│   │   └── 📁 services/         # Lógica de negocio
│   ├── 📄 Dockerfile            # Imagen Docker del servidor
│   └── 📄 package.json          # Dependencias del backend
├── 📁 docker/                   # Configuración de Docker
│   ├── 📄 docker-compose.yml    # Orquestación de servicios
│   ├── 📄 nginx.conf            # Configuración de Nginx
│   ├── 📄 nginx.Dockerfile      # Imagen Docker de Nginx
│   └── 📄 setup-ssl.sh          # Script de configuración SSL
├── 📁 shared/                   # Código compartido
│   └── 📁 validations/          # Esquemas de validación
└── 📁 docs/                     # Documentación adicional
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar cliente y servidor en desarrollo
npm run dev:client   # Solo cliente
npm run dev:server   # Solo servidor

# Producción
npm run build        # Construir para producción
npm run start        # Ejecutar en producción
npm run start:client # Solo cliente en producción
npm run start:server # Solo servidor en producción
```

## 🔐 Seguridad

- **HTTPS**: Certificados SSL automáticos con Let's Encrypt
- **CORS**: Configurado para dominios específicos
- **Headers de Seguridad**: HSTS, X-Frame-Options, CSP
- **Autenticación JWT**: Tokens seguros para API
- **Encriptación**: Contraseñas hasheadas con bcrypt
- **Validación**: Esquemas Zod para validación de datos

## 📊 Monitoreo y Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f nginx
docker-compose logs -f client
docker-compose logs -f server

# Estado de los servicios
docker-compose ps
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Equipo Global Agent AI** - *Desarrollo inicial*

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación completa](./docs/)
2. Busca en los [issues existentes](../../issues)
3. Crea un [nuevo issue](../../issues/new) si es necesario

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de n8n](https://docs.n8n.io/)

---

**¡Transforma tu negocio con Global Agent AI! 🚀**