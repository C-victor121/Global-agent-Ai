import axios from 'axios';
import { ApiResponse, User } from '../types'; // Asegúrate que los tipos existan y estén bien definidos

// URL base del backend (usualmente definida en .env como NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Cliente Axios configurado para todo el backend
const apiClient = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true, // Incluye cookies como JWT httpOnly en las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

// Servicio de usuarios
export const UserService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>('/users');
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  },

  // Crear un nuevo usuario
  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/users', userData);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return null;
    }
  },

  // Actualizar un usuario
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return null;
    }
  },

  // Eliminar un usuario
  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
      if (!response.data.success) throw new Error(response.data.message);
      return true;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return false;
    }
  },
};
