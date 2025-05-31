import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import todoRoutes from './routes/todo.routes'
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import planRoutes from './routes/plan.routes';
import twilioRoutes from './routes/twilio.routes';
import whatsappRoutes from './routes/whatsapp.routes'; // Añadir importación de rutas de WhatsApp
import contentGenerationRoutes from './routes/contentGeneration.routes'; // Importar rutas de generación de contenido
import { errorHandler } from './middleware/error.handler';
import cookieParser from 'cookie-parser';


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/todos', todoRoutes)
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Montamos las rutas de usuarios en /api/users
app.use('/api', planRoutes); // Montamos las rutas de planes en /api/plans
app.use('/api/twilio', twilioRoutes); // Montamos las rutas de Twilio para webhooks
app.use('/api/whatsapp', whatsappRoutes); // Montamos las rutas de WhatsApp
app.use('/api/content', contentGenerationRoutes); // Montamos las rutas de generación de contenido

// Middleware de manejo de errores
app.use(errorHandler)

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/global-agent-ai')
  .then(() => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err)
  })