'use client'

import { useState } from 'react'

interface AddTodoProps {
  onAdd: (title: string) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Agregar nueva tarea..."
          className="input-field flex-1"
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={!title.trim()}
        >
          Agregar
        </button>
      </div>
    </form>
  )
}