import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import todoRoutes from './routes/todo.routes'
import { errorHandler } from './middleware/error.handler'

// Configuración de variables de entorno
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Rutas
app.use('/api/todos', todoRoutes)

// Manejador de errores global
app.use(errorHandler)

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/global-agent-ai')
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB')
    // Iniciar servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('❌ Error al conectar con MongoDB:', error)
    process.exit(1)
  })