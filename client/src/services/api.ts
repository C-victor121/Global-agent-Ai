import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  withCredentials: true, // Asegura que las cookies (incluyendo el token JWT) se envíen con las solicitudes
  baseURL: `${API_URL}/api`, // Asegúrate que la URL base del API sea correcta, especialmente si el backend está en un puerto diferente o ruta.
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

// Re-agregando TodoService y UserService como exportaciones nombradas
// Asegúrate de que los tipos Todo, ApiResponse, User estén importados desde ../types
import { Todo, ApiResponse, User } from '../types'; // Asegúrate que esta línea exista y sea correcta

export const TodoService = {
  // Obtener todas las tareas
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_URL}/todos`); // Asumiendo que esta URL es correcta o ajústala
      const data: ApiResponse<Todo[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las tareas');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      return [];
    }
  },
  
  // Crear una nueva tarea
  async createTodo(title: string): Promise<Todo | null> {
    try {
      const response = await fetch(`${API_URL}/todos`, { // Asumiendo que esta URL es correcta o ajústala
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      
      const data: ApiResponse<Todo> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al crear la tarea');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      return null;
    }
  },
  
  // Actualizar una tarea
  async updateTodo(id: string, completed: boolean): Promise<Todo | null> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, { // Asumiendo que esta URL es correcta o ajústala
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      });
      
      const data: ApiResponse<Todo> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al actualizar la tarea');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      return null;
    }
  },
  
  // Eliminar una tarea
  async deleteTodo(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, { // Asumiendo que esta URL es correcta o ajústala
        method: 'DELETE'
      });
      
      const data: ApiResponse<Todo> = await response.json(); // Asumiendo que no devuelve datos en el delete exitoso
      
      if (!data.success) {
        throw new Error(data.message || 'Error al eliminar la tarea');
      }
      
      return true;
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      return false;
    }
  }
};

const USER_API_BASE_URL = `${API_URL}/api/users`;

export const UserService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(USER_API_BASE_URL);
      const data: ApiResponse<User[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener los usuarios');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  },

  // Crear un nuevo usuario
  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(USER_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data: ApiResponse<User> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al crear el usuario');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return null;
    }
  },

  // Actualizar un usuario
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
        method: 'PUT', // O 'PATCH' dependiendo de tu API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data: ApiResponse<User> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al actualizar el usuario');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return null;
    }
  },

  // Eliminar un usuario
  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      const data: ApiResponse<null> = await response.json(); // Asumiendo que no devuelve datos en el delete exitoso
      
      if (!data.success) {
        throw new Error(data.message || 'Error al eliminar el usuario');
      }
      
      return true;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return false;
    }
  },
};