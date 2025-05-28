import { Todo, ApiResponse, User } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const TodoService = {
  // Obtener todas las tareas
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_URL}/todos`)
      const data: ApiResponse<Todo[]> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las tareas')
      }
      
      return data.data
    } catch (error) {
      console.error('Error al obtener las tareas:', error)
      return []
    }
  },
  
  // Crear una nueva tarea
  async createTodo(title: string): Promise<Todo | null> {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      })
      
      const data: ApiResponse<Todo> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Error al crear la tarea')
      }
      
      return data.data
    } catch (error) {
      console.error('Error al crear la tarea:', error)
      return null
    }
  },
  
  // Actualizar una tarea
  async updateTodo(id: string, completed: boolean): Promise<Todo | null> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      })
      
      const data: ApiResponse<Todo> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Error al actualizar la tarea')
      }
      
      return data.data
    } catch (error) {
      console.error('Error al actualizar la tarea:', error)
      return null
    }
  },
  
  // Eliminar una tarea
  async deleteTodo(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      })
      
      const data: ApiResponse<Todo> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Error al eliminar la tarea')
      }
      
      return true
    } catch (error) {
      console.error('Error al eliminar la tarea:', error)
      return false
    }
  }
}

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