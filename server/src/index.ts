import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import todoRoutes from './routes/todo.routes'
import authRoutes from './routes/auth.routes'
import { errorHandler } from './middleware/error.handler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())

// Rutas
app.use('/api/todos', todoRoutes)
app.use('/api/auth', authRoutes)

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