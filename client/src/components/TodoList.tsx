'use client'

import { Todo } from '../types'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-stone-900 py-8">
        No hay tareas pendientes. ¡Agrega una nueva tarea!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 text-black">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo._id)}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
          </div>
          <button
            onClick={() => onDelete(todo._id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}