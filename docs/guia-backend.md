# Guía del Backend - Global Agent AI

## Tecnologías y Dependencias Principales

### Core Framework
- **Node.js**: Runtime de JavaScript
- **Express.js 4.18.2**: Framework web minimalista
- **TypeScript 5.0.4**: Tipado estático para JavaScript
- **ts-node-dev 2.0.0**: Desarrollo con hot reload

### Base de Datos
- **MongoDB**: Base de datos NoSQL
- **Mongoose 7.1.1**: ODM (Object Document Mapper)

### Autenticación y Seguridad
- **jsonwebtoken 9.0.2**: Manejo de tokens JWT
- **bcrypt 6.0.0**: Encriptación de contraseñas
- **NextAuth.js 4.24.7**: Integración con frontend
- **JOSE 6.0.11**: Estándares de seguridad JWT
- **cookie-parser 1.4.7**: Manejo de cookies

### Comunicaciones
- **Twilio 5.7.0**: SMS y llamadas telefónicas
- **cors 2.8.5**: Cross-Origin Resource Sharing

### Pagos
- **MercadoPago 2.7.0**: Procesamiento de pagos

### Utilidades
- **dotenv 16.0.3**: Variables de entorno
- **multer 2.0.1**: Subida de archivos
- **archiver 7.0.1**: Compresión de archivos

## Estructura del Proyecto

```
server/
├── src/
│   ├── controllers/           # Lógica de controladores
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── contentGeneration.controller.ts
│   │   ├── legalAssistant.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── twilio.controller.ts
│   │   └── whatsapp.controller.ts
│   ├── middleware/            # Middleware personalizado
│   │   ├── auth.middleware.ts
│   │   ├── error.handler.ts
│   │   ├── validation.middleware.ts
│   │   └── cors.middleware.ts
│   ├── models/                # Modelos de MongoDB
│   │   ├── User.model.ts
│   │   ├── Plan.model.ts
│   │   ├── ContentGeneration.model.ts
│   │   ├── LegalConsultation.model.ts
│   │   ├── ContactMessage.model.ts
│   │   └── Payment.model.ts
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
│   │   ├── payment.service.ts
│   │   └── email.service.ts
│   ├── utils/                 # Utilidades
│   │   ├── database.ts
│   │   ├── jwt.utils.ts
│   │   └── validation.utils.ts
│   └── index.ts               # Punto de entrada
├── dist/                      # Código compilado (generado)
├── Dockerfile                 # Configuración Docker
├── package.json               # Dependencias y scripts
└── tsconfig.json              # Configuración TypeScript
```

## Configuración del Servidor Principal

### Archivo Principal

**Archivo**: `src/index.ts`

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

// Importar rutas
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import planRoutes from './routes/plan.routes'
import twilioRoutes from './routes/twilio.routes'
import whatsappRoutes from './routes/whatsapp.routes'
import contentGenerationRoutes from './routes/contentGeneration.routes'
import dashboardRoutes from './routes/dashboard.routes'
import contactMessageRoutes from './routes/contactMessage.routes'
import legalAssistantRoutes from './routes/legalAssistant.routes'
import paymentRoutes from './routes/payment.routes'

// Importar middleware
import { errorHandler } from './middleware/error.handler'

// Configuración
const app = express()
const PORT = process.env.PORT || 3001

// Middleware global
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://192.168.101.6:3000',
    'http://107.20.220.167',
    'http://107.20.220.167:3000'
  ],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api', userRoutes)
app.use('/api', planRoutes)
app.use('/api/twilio', twilioRoutes)
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/content', contentGenerationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api', contactMessageRoutes)
app.use('/api/legal', legalAssistantRoutes)
app.use('/api/payment', paymentRoutes)

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler)

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/global-agent-ai')
  .then(() => {
    console.log('✅ Conectado a MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error)
    process.exit(1)
  })
```

## Modelos de Base de Datos

### Modelo de Usuario

**Archivo**: `src/models/User.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password?: string
  provider: 'credentials' | 'google' | 'facebook'
  providerId?: string
  avatar?: string
  plan: 'free' | 'basic' | 'premium' | 'enterprise'
  planExpiry?: Date
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 8,
    select: false // No incluir en consultas por defecto
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'facebook'],
    default: 'credentials'
  },
  providerId: {
    type: String,
    sparse: true // Permite múltiples documentos con valor null
  },
  avatar: {
    type: String,
    default: null
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  planExpiry: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.__v
      return ret
    }
  }
})

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password!, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Índices
userSchema.index({ email: 1 })
userSchema.index({ provider: 1, providerId: 1 })

export const User = mongoose.model<IUser>('User', userSchema)
```

### Modelo de Generación de Contenido

**Archivo**: `src/models/ContentGeneration.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose'

export interface IContentGeneration extends Document {
  _id: string
  userId: string
  type: 'blog' | 'social' | 'email' | 'ad' | 'product'
  prompt: string
  generatedContent: string
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'creative'
  length: 'short' | 'medium' | 'long'
  language: string
  status: 'pending' | 'completed' | 'failed' | 'saved'
  metadata?: {
    wordCount?: number
    readingTime?: number
    keywords?: string[]
  }
  n8nWorkflowId?: string
  createdAt: Date
  updatedAt: Date
}

const contentGenerationSchema = new Schema<IContentGeneration>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['blog', 'social', 'email', 'ad', 'product'],
    required: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 1000
  },
  generatedContent: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    enum: ['professional', 'casual', 'friendly', 'formal', 'creative'],
    default: 'professional'
  },
  length: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium'
  },
  language: {
    type: String,
    default: 'es'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'saved'],
    default: 'pending'
  },
  metadata: {
    wordCount: Number,
    readingTime: Number,
    keywords: [String]
  },
  n8nWorkflowId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

// Índices
contentGenerationSchema.index({ userId: 1, createdAt: -1 })
contentGenerationSchema.index({ status: 1 })
contentGenerationSchema.index({ type: 1 })

export const ContentGeneration = mongoose.model<IContentGeneration>('ContentGeneration', contentGenerationSchema)
```

## Controladores

### Controlador de Autenticación

**Archivo**: `src/controllers/auth.controller.ts`

```typescript
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model'
import { loginSchema, registerSchema } from '../../shared/validations/auth.schema'

// Registro con email y contraseña
export const signup = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const validatedData = registerSchema.parse(req.body)
    const { name, email, password } = validatedData

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe con este email'
      })
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
      provider: 'credentials'
    })

    await user.save()

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    })

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      },
      token
    })
  } catch (error) {
    console.error('Error en signup:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Inicio de sesión con email y contraseña
export const login = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    // Buscar usuario e incluir contraseña
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Actualizar último login
    user.lastLogin = new Date()
    await user.save()

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      },
      token
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Autenticación con Google
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { googleId, email, name, avatar } = req.body

    // Buscar o crear usuario
    let user = await User.findOne({ 
      $or: [
        { email },
        { provider: 'google', providerId: googleId }
      ]
    })

    if (!user) {
      user = new User({
        name,
        email,
        provider: 'google',
        providerId: googleId,
        avatar
      })
      await user.save()
    } else {
      // Actualizar información si es necesario
      user.lastLogin = new Date()
      if (!user.avatar && avatar) user.avatar = avatar
      await user.save()
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      },
      token
    })
  } catch (error) {
    console.error('Error en Google auth:', error)
    res.status(500).json({
      success: false,
      message: 'Error en autenticación con Google'
    })
  }
}

// Cerrar sesión
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token')
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión'
    })
  }
}
```

### Controlador de Generación de Contenido

**Archivo**: `src/controllers/contentGeneration.controller.ts`

```typescript
import { Request, Response } from 'express'
import { ContentGeneration } from '../models/ContentGeneration.model'
import { n8nService } from '../services/n8n.service'

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

// Generar nuevo contenido
export const generateContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, prompt, tone, length, language = 'es' } = req.body
    const userId = req.user!.userId

    // Validar datos de entrada
    if (!type || !prompt) {
      return res.status(400).json({
        success: false,
        message: 'Tipo y prompt son requeridos'
      })
    }

    // Crear registro en base de datos
    const contentGeneration = new ContentGeneration({
      userId,
      type,
      prompt,
      tone: tone || 'professional',
      length: length || 'medium',
      language,
      status: 'pending',
      generatedContent: '' // Se llenará cuando n8n responda
    })

    await contentGeneration.save()

    // Enviar solicitud a n8n
    try {
      const n8nResponse = await n8nService.generateContent({
        id: contentGeneration._id,
        type,
        prompt,
        tone,
        length,
        language
      })

      // Actualizar con el contenido generado
      contentGeneration.generatedContent = n8nResponse.content
      contentGeneration.status = 'completed'
      contentGeneration.metadata = {
        wordCount: n8nResponse.content.split(' ').length,
        readingTime: Math.ceil(n8nResponse.content.split(' ').length / 200),
        keywords: n8nResponse.keywords || []
      }
      contentGeneration.n8nWorkflowId = n8nResponse.workflowId

      await contentGeneration.save()

      res.json({
        success: true,
        message: 'Contenido generado exitosamente',
        data: contentGeneration
      })
    } catch (n8nError) {
      console.error('Error en n8n:', n8nError)
      
      contentGeneration.status = 'failed'
      await contentGeneration.save()

      res.status(500).json({
        success: false,
        message: 'Error al generar contenido con IA'
      })
    }
  } catch (error) {
    console.error('Error en generateContent:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Obtener historial de generaciones
export const getContentGenerationHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const { page = 1, limit = 10, type, status } = req.query

    // Construir filtros
    const filters: any = { userId }
    if (type) filters.type = type
    if (status) filters.status = status

    // Paginación
    const skip = (Number(page) - 1) * Number(limit)

    const [content, total] = await Promise.all([
      ContentGeneration.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContentGeneration.countDocuments(filters)
    ])

    res.json({
      success: true,
      data: content,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Error en getContentGenerationHistory:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial'
    })
  }
}

// Guardar contenido generado
export const saveGeneratedContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.body
    const userId = req.user!.userId

    const content = await ContentGeneration.findOne({ _id: id, userId })
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      })
    }

    content.status = 'saved'
    await content.save()

    res.json({
      success: true,
      message: 'Contenido guardado exitosamente'
    })
  } catch (error) {
    console.error('Error en saveGeneratedContent:', error)
    res.status(500).json({
      success: false,
      message: 'Error al guardar contenido'
    })
  }
}

// Eliminar contenido específico
export const deleteContentGeneration = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user!.userId

    const result = await ContentGeneration.findOneAndDelete({ _id: id, userId })
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Contenido eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error en deleteContentGeneration:', error)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar contenido'
    })
  }
}

// Eliminar todo el historial
export const deleteAllContentGenerations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId

    const result = await ContentGeneration.deleteMany({ userId })

    res.json({
      success: true,
      message: `${result.deletedCount} elementos eliminados exitosamente`
    })
  } catch (error) {
    console.error('Error en deleteAllContentGenerations:', error)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar historial'
    })
  }
}
```

## Middleware

### Middleware de Autenticación

**Archivo**: `src/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model'

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Obtener token del header Authorization o de las cookies
    let token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      })
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId)
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      })
    }

    // Agregar información del usuario a la request
    req.user = {
      userId: user._id.toString(),
      email: user.email
    }

    next()
  } catch (error) {
    console.error('Error en authMiddleware:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      })
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      token = req.cookies.token
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      const user = await User.findById(decoded.userId)
      
      if (user && user.isActive) {
        req.user = {
          userId: user._id.toString(),
          email: user.email
        }
      }
    }

    next()
  } catch (error) {
    // En caso de error, continuar sin autenticación
    next()
  }
}
```

### Middleware de Manejo de Errores

**Archivo**: `src/middleware/error.handler.ts`

```typescript
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import mongoose from 'mongoose'

interface CustomError extends Error {
  statusCode?: number
  code?: number
  keyValue?: any
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Error interno del servidor'

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body
  })

  // Error de validación de Zod
  if (error instanceof ZodError) {
    statusCode = 400
    message = 'Datos de entrada inválidos'
    const errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
    
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    })
  }

  // Error de validación de Mongoose
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Error de validación'
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }))
    
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    })
  }

  // Error de duplicado de MongoDB
  if (error.code === 11000) {
    statusCode = 400
    const field = Object.keys(error.keyValue)[0]
    message = `${field} ya existe`
    
    return res.status(statusCode).json({
      success: false,
      message
    })
  }

  // Error de ObjectId inválido de MongoDB
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = 'ID inválido'
    
    return res.status(statusCode).json({
      success: false,
      message
    })
  }

  // Error genérico
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}
```

## Servicios

### Servicio de n8n

**Archivo**: `src/services/n8n.service.ts`

```typescript
import axios from 'axios'

interface ContentGenerationRequest {
  id: string
  type: string
  prompt: string
  tone: string
  length: string
  language: string
}

interface ContentGenerationResponse {
  content: string
  workflowId: string
  keywords?: string[]
}

class N8nService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.N8N_CONTENT_GENERATION_WEBHOOK_URL || 'http://n8n:5678'
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/webhook-test/content-generation`, {
        ...request,
        timestamp: new Date().toISOString()
      }, {
        timeout: 30000, // 30 segundos
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (error) {
      console.error('Error en n8n service:', error)
      throw new Error('Error al comunicarse con el servicio de generación de contenido')
    }
  }

  async generateLegalConsultation(request: any): Promise<any> {
    try {
      const response = await axios.post(`${process.env.N8N_LEGAL_ASSISTANT_WEBHOOK_URL}/webhook-test/legal-assistant`, {
        ...request,
        timestamp: new Date().toISOString()
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (error) {
      console.error('Error en legal assistant service:', error)
      throw new Error('Error al comunicarse con el asistente legal')
    }
  }
}

export const n8nService = new N8nService()
```

## Rutas

### Rutas de Autenticación

**Archivo**: `src/routes/auth.routes.ts`

```typescript
import { Router } from 'express'
import { 
  googleAuth, 
  facebookAuth, 
  signup, 
  login, 
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Rutas públicas
router.post('/google', googleAuth)
router.post('/facebook', facebookAuth)
router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Rutas protegidas
router.post('/logout', authMiddleware, logout)
router.post('/refresh', authMiddleware, refreshToken)

export default router
```

### Rutas de Generación de Contenido

**Archivo**: `src/routes/contentGeneration.routes.ts`

```typescript
import { Router } from 'express'
import {
  generateContent,
  getContentGenerationHistory,
  saveGeneratedContent,
  deleteContentGeneration,
  deleteAllContentGenerations
} from '../controllers/contentGeneration.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authMiddleware)

// Rutas de generación de contenido
router.post('/generate', generateContent)
router.get('/history', getContentGenerationHistory)
router.post('/save', saveGeneratedContent)
router.delete('/:id', deleteContentGeneration)
router.delete('/all', deleteAllContentGenerations)

export default router
```

## Variables de Entorno

### Archivo de Configuración

**Archivo**: `.env`

```env
# Configuración del servidor
PORT=3001
NODE_ENV=production

# Base de datos
MONGODB_URI=mongodb://mongo:27017/global-agent-ai

# JWT
JWT_SECRET=tu-jwt-secret-muy-seguro-aqui
JWT_EXPIRES_IN=7d

# URLs
CLIENT_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-nextauth-secret

# n8n Webhooks
N8N_CONTENT_GENERATION_WEBHOOK_URL=http://n8n:5678/webhook-test/content-generation
N8N_LEGAL_ASSISTANT_WEBHOOK_URL=http://n8n:5678/webhook-test/legal-assistant

# Twilio
TWILIO_ACCOUNT_SID=tu-twilio-account-sid
TWILIO_AUTH_TOKEN=tu-twilio-auth-token
TWILIO_PHONE_NUMBER=tu-numero-twilio

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu-mp-access-token
MERCADOPAGO_PUBLIC_KEY=tu-mp-public-key
MERCADOPAGO_WEBHOOK_SECRET=tu-mp-webhook-secret

# Meta/Facebook
META_APP_SECRET=tu-meta-app-secret

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app
```

## Scripts de Desarrollo

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  }
}
```

## Configuración de TypeScript

**Archivo**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

## Testing (Recomendado)

### Configuración de Jest

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### Ejemplo de Test

```typescript
import request from 'supertest'
import app from '../src/index'
import { User } from '../src/models/User.model'

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.user.email).toBe(userData.email)
    })
  })
})
```

Esta guía proporciona una base completa para entender y trabajar con el backend de Global Agent AI, implementando las mejores prácticas de Node.js, Express y MongoDB.