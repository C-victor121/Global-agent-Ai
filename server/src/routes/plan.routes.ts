import { Router } from 'express';
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} from '../controllers/plan.controller';
import { authRequired } from '../middleware/auth.middleware';
// import { validateSchema } from '../middleware/validator.middleware'; // Si tienes esquemas de validación
// import { createPlanSchema } from '../validations/plan.schema'; // Ejemplo de esquema de validación

const router = Router();

// Rutas públicas (si alguna)
router.get('/plans', getPlans); // Ruta para que los usuarios vean los planes disponibles
router.get('/plans/:id', getPlanById); // Ruta para ver un plan específico

// Rutas protegidas (para administradores)
router.post('/plans', authRequired, /* validateSchema(createPlanSchema), */ createPlan); // Crear un nuevo plan
router.put('/plans/:id', authRequired, /* validateSchema(createPlanSchema), */ updatePlan); // Actualizar un plan existente
router.delete('/plans/:id', authRequired, deletePlan); // Eliminar un plan
router.patch('/plans/:id/toggle', authRequired, togglePlanStatus); // Activar/desactivar un plan

export default router;