import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

// Validación de ID de MongoDB
export const validateMongoId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    })
  }
  next()
}

// Validación para crear una tarea
export const validateCreateTodo = (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'El título es requerido y debe ser una cadena de texto no vacía'
    })
  }
  next()
}

// Validación para actualizar una tarea
export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction) => {
  const { completed } = req.body
  if (typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'El campo completed debe ser un valor booleano'
    })
  }
  next()
}