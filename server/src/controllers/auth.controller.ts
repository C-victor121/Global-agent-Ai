import { Request, Response } from 'express';
import User from '../models/user.model';
import { CustomError } from '../middleware/error.handler';
import bcrypt from 'bcrypt';

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

export const facebookAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, facebookId, avatar } = req.body;

    if (!email || !facebookId) {
      throw new CustomError('Datos de autenticación incompletos', 400);
    }

    // Buscar usuario existente por facebookId o email
    let user = await User.findOne({
      $or: [{ facebookId }, { email }]
    });

    if (!user) {
      // Crear nuevo usuario si no existe
      user = await User.create({
        name,
        email,
        facebookId,
        avatar
      });
    } else if (!user.facebookId) {
      // Actualizar usuario existente con facebookId si se registró por email
      user.facebookId = facebookId;
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
    throw new CustomError('Error en la autenticación con Facebook', 500);
  }
};

// Registro de usuario con email y contraseña
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new CustomError('Todos los campos son requeridos', 400);
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('El correo electrónico ya está registrado', 400);
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error en el registro de usuario', 500);
  }
};

// Inicio de sesión con email y contraseña
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError('Email y contraseña son requeridos', 400);
    }

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('Credenciales inválidas', 401);
    }

    // Verificar si el usuario tiene contraseña (podría haberse registrado con Google/Facebook)
    if (!user.password) {
      throw new CustomError('Este usuario debe iniciar sesión con Google o Facebook', 400);
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError('Credenciales inválidas', 401);
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
    throw new CustomError('Error en el inicio de sesión', 500);
  }
};

// Endpoint para NextAuth (signin)
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario tiene contraseña (podría haberse registrado con Google/Facebook)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Este usuario debe iniciar sesión con Google o Facebook'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en signin:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};