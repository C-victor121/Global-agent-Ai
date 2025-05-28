import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password'); // Excluir contraseñas
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: 'Error al obtener los usuarios', error: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error al obtener los usuarios', error: 'Unknown error' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, avatar } = req.body;
    // Validación básica (se pueden añadir esquemas de validación más robustos)
    if (!name || !email) {
      return res.status(400).json({ message: 'Nombre y correo electrónico son requeridos.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const newUser = new User({
      name,
      email,
      password, // Considerar hashear la contraseña si se va a guardar directamente
      role: role || 'user',
      avatar
    });

    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password; // No devolver la contraseña
    res.status(201).json({ success: true, data: userResponse, message: 'Usuario creado correctamente' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: 'Error al crear el usuario', error: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error al crear el usuario', error: 'Unknown error' });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatar, password } = req.body;

    const updateData: any = { name, email, role, avatar };

    // Solo actualizar la contraseña si se proporciona una nueva
    // Considerar la lógica de hasheo aquí también si es necesario
    if (password) {
      updateData.password = password; 
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: updatedUser, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: 'Error al actualizar el usuario', error: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error al actualizar el usuario', error: 'Unknown error' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id).select('-password');

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    // Para deleteUser, el frontend espera `ApiResponse<null>` en caso de éxito, así que solo enviamos success y message.
    res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: 'Error al eliminar el usuario', error: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error al eliminar el usuario', error: 'Unknown error' });
    }
  }
};