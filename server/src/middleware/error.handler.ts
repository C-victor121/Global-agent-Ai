import { Request, Response, NextFunction } from 'express'

// Interfaz para errores personalizados de la aplicación
export interface AppError extends Error {
  statusCode: number
  status: string
}

// Middleware para manejo centralizado de errores
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as AppError
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
}

// Clase para crear errores personalizados
export class CustomError extends Error implements AppError {
  statusCode: number
  status: string

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    Error.captureStackTrace(this, this.constructor)
  }
}