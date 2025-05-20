import { Request, Response } from 'express';
import User from '../models/user.model';
import { CustomError } from '../middleware/error.handler';

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    if (!email || !googleId) {
      throw new CustomError('Datos de autenticación incompletos', 400);
    }

    // Buscar usuario existente por googleId o email
    let user = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (!user) {
      // Crear nuevo usuario si no existe
      user = await User.create({
        name,
        email,
        googleId,
        avatar
      });
    } else if (!user.googleId) {
      // Actualizar usuario existente con googleId si se registró por email
      user.googleId = googleId;
      user.avatar = avatar || user.avatar;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error en la autenticación con Google', 500);
  }
};