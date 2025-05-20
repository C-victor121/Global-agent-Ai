import { Todo, ApiResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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