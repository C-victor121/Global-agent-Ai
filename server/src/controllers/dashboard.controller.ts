import { Request, Response } from 'express';
import User from '../models/user.model';
import ContentGeneration from '../models/contentGeneration.model';
import { CustomError } from '../middleware/error.handler';

// Obtener métricas generales del dashboard
export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    // Verificar que el usuario sea admin
    const userRole = (req as any).user?.role;
    if (userRole !== 'admin') {
      throw new CustomError('No tienes permisos para acceder a estas métricas', 403);
    }

    // Obtener métricas de usuarios
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      $or: [
        { googleId: { $exists: true } },
        { facebookId: { $exists: true } },
        { password: { $exists: true } }
      ]
    });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Obtener métricas de generaciones de contenido
    const totalGenerations = await ContentGeneration.countDocuments();
    const generationsToday = await ContentGeneration.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });
    const generationsThisWeek = await ContentGeneration.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });
    const generationsThisMonth = await ContentGeneration.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    // Obtener usuarios más activos
    const topUsers = await ContentGeneration.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          lastGeneration: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          generationCount: '$count',
          lastGeneration: '$lastGeneration'
        }
      },
      {
        $sort: { generationCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Obtener estadísticas por formato de contenido
    const formatStats = await ContentGeneration.aggregate([
      {
        $group: {
          _id: '$formato',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const metrics = {
      users: {
        total: totalUsers,
        active: activeUsers,
        admin: adminUsers,
        regular: regularUsers
      },
      generations: {
        total: totalGenerations,
        today: generationsToday,
        thisWeek: generationsThisWeek,
        thisMonth: generationsThisMonth
      },
      topUsers,
      formatStats
    };

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener las métricas del dashboard',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error desconocido al obtener las métricas'
      });
    }
  }
};

// Obtener datos históricos para gráficos
export const getHistoricalData = async (req: Request, res: Response) => {
  try {
    // Verificar que el usuario sea admin
    const userRole = (req as any).user?.role;
    if (userRole !== 'admin') {
      throw new CustomError('No tienes permisos para acceder a estos datos', 403);
    }

    const { period = '30d' } = req.query;
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Obtener registros de usuarios por día
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Obtener generaciones por día
    const dailyGenerations = await ContentGeneration.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userRegistrations,
        dailyGenerations,
        period
      }
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener los datos históricos',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error desconocido al obtener los datos históricos'
      });
    }
  }
};

// Obtener detalles específicos de generaciones
export const getGenerationDetails = async (req: Request, res: Response) => {
  try {
    // Verificar que el usuario sea admin
    const userRole = (req as any).user?.role;
    if (userRole !== 'admin') {
      throw new CustomError('No tienes permisos para acceder a estos datos', 403);
    }

    const { page = 1, limit = 20, userId, formato } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Construir filtros
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (formato) filters.formato = formato;

    const generations = await ContentGeneration.find(filters)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ContentGeneration.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: {
        generations,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: total
        }
      }
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener los detalles de generaciones',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error desconocido al obtener los detalles'
      });
    }
  }
};