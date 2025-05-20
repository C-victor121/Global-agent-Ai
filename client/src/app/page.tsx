'use client'

import { useState, useEffect } from 'react'
import { TodoList } from '../components/TodoList'
import { AddTodo } from '../components/AddTodo'
import { Todo } from '../types'
import { TodoService } from '../services/api'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar tareas al iniciar
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await TodoService.getTodos()
        setTodos(data)
      } catch (error) {
        console.error('Error al cargar tareas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  const addTodo = async (title: string) => {
    const newTodo = await TodoService.createTodo(title)
    if (newTodo) {
      setTodos([...todos, newTodo])
    }
  }

  const toggleTodo = async (id: string) => {
    const todoToUpdate = todos.find(todo => todo._id === id)
    if (!todoToUpdate) return

    const updatedTodo = await TodoService.updateTodo(id, !todoToUpdate.completed)
    if (updatedTodo) {
      setTodos(todos.map(todo =>
        todo._id === id ? updatedTodo : todo
      ))
    }
  }

  const deleteTodo = async (id: string) => {
    const success = await TodoService.deleteTodo(id)
    if (success) {
      setTodos(todos.filter(todo => todo._id !== id))
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">Global Agent AI</h1>
      <div className="card max-w-2xl mx-auto space-y-6">
        <AddTodo onAdd={addTodo} />
        {loading ? (
          <div className="text-center py-8">Cargando tareas...</div>
        ) : (
          <TodoList 
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
      </div>
    </div>
  )
}