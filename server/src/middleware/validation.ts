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
