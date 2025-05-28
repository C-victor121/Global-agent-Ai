import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
// Aquí podrías añadir middlewares de autenticación o validación si son necesarios
// import { authRequired } from '../middleware/auth.middleware'; 

const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser); // Placeholder
router.put('/users/:id', updateUser); // Placeholder
router.delete('/users/:id', deleteUser); // Placeholder

export default router;