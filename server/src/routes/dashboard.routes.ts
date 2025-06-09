import { Router } from 'express';
import { getDashboardMetrics, getHistoricalData, getGenerationDetails } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener métricas generales del dashboard
router.get('/metrics', getDashboardMetrics);

// Obtener datos históricos para gráficos
router.get('/historical', getHistoricalData);

// Obtener detalles de generaciones
router.get('/generations', getGenerationDetails);

export default router;