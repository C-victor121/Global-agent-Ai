import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import planRoutes from './routes/plan.routes';
import twilioRoutes from './routes/twilio.routes';
import whatsappRoutes from './routes/whatsapp.routes'; // Añadir importación de rutas de WhatsApp
import contentGenerationRoutes from './routes/contentGeneration.routes'; // Importar rutas de generación de contenido
import dashboardRoutes from './routes/dashboard.routes'; // Importar rutas del dashboard
import contactMessageRoutes from './routes/contactMessage.routes'; // Importar rutas de mensajes de contacto
import legalAssistantRoutes from './routes/legalAssistant.routes'; // Importar rutas del asistente legal
import paymentRoutes from './routes/payment.routes'; // Importar rutas de pago
import { errorHandler } from './middleware/error.handler';
import { authMiddleware } from './middleware/auth.middleware'; // Importar authMiddleware
import cookieParser from 'cookie-parser';


// Cargar variables de entorno
dotenv.config()

// Verificar la carga de variables críticas al inicio
console.log('Verificando configuración del servidor...');
console.log('URLs configuradas:', {
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://globalsolarco.shop',
  BACKEND_URL: process.env.BACKEND_URL || 'https://globalsolarco.shop/api'
});
console.log('Puerto configurado:', process.env.PORT);
console.log('MongoDB URI configurada:', process.env.MONGODB_URI ? '✓ Presente' : '✗ Faltante');
console.log('JWT Secret configurado:', process.env.JWT_SECRET ? '✓ Presente' : '✗ Faltante');
console.log('NextAuth Secret configurado:', process.env.NEXTAUTH_SECRET ? '✓ Presente' : '✗ Faltante');

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 CORS - Origen de la solicitud:', origin);
    const allowedOrigins = [
      'https://globalsolarco.shop',
      'http://localhost:3000',
      'https://www.globalsolarco.shop'
    ];
    
    // Permitir solicitudes sin origen (como desde aplicaciones móviles o Postman)
    if (!origin) {
      console.log('✅ CORS - Permitiendo solicitud sin origen');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS - Origen permitido:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS - Origen no permitido:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); // Rutas de pago (incluye webhooks públicos y rutas protegidas)

// Middleware de autenticación para rutas protegidas
app.use('/api', authMiddleware);

// Rutas protegidas
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/twilio', twilioRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/content', contentGenerationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactMessageRoutes);
app.use('/api/legal', legalAssistantRoutes);

// Middleware de manejo de errores
app.use(errorHandler)

// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Error: MONGODB_URI no está configurado en las variables de entorno.');
  process.exit(1); // Salir si MONGODB_URI no está definida
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err)
  })