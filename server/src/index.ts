import express from 'express'
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
import { errorHandler } from './middleware/error.handler';
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
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000' // Desarrollo local
    ].filter((o): o is string => !!o);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Montamos las rutas de usuarios en /api/users
app.use('/api', planRoutes); // Montamos las rutas de planes en /api/plans
app.use('/api/twilio', twilioRoutes); // Montamos las rutas de Twilio para webhooks
app.use('/api/whatsapp', whatsappRoutes); // Montamos las rutas de WhatsApp
app.use('/api/content', contentGenerationRoutes); // Montamos las rutas de generación de contenido
app.use('/api/dashboard', dashboardRoutes); // Montamos las rutas del dashboard
app.use('/api', contactMessageRoutes); // Montamos las rutas de mensajes de contacto
app.use('/api/legal', legalAssistantRoutes); // Montamos las rutas del asistente legal

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