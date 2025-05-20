import { Request, Response } from 'express'
import Todo from '../models/todo.model'

export const getTodos = async (_req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json({ success: true, data: todos })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    const newTodo = await Todo.create({ title })
    res.status(201).json({ success: true, data: newTodo })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { completed } = req.body
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    )
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      })
    }
    res.json({ success: true, data: updatedTodo })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedTodo = await Todo.findByIdAndDelete(id)
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      })
    }
    res.json({ success: true, data: deletedTodo })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}