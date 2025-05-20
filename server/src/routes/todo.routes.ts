import { Router } from 'express'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller'
import { validateCreateTodo, validateUpdateTodo, validateMongoId } from '../middleware/validation'

const router = Router()

// Rutas para tareas (todos)
router.get('/', getTodos)
router.post('/', validateCreateTodo, createTodo)
router.patch('/:id', validateMongoId, validateUpdateTodo, updateTodo)
router.delete('/:id', validateMongoId, deleteTodo)

export default router