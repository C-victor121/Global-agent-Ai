'use client';

import { useState, useEffect } from 'react';
import { dashboardService, DashboardMetrics } from '@/services/dashboardService';
import { FaUsers, FaUserShield, FaBrain, FaChartLine, FaEye, FaSpinner } from 'react-icons/fa';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, onClick, subtitle }) => {
  return (
    <div 
      className={`bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {onClick && (
          <FaEye className="text-gray-400 hover:text-white transition-colors" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-300 text-sm">{title}</p>
      {subtitle && (
        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
};

interface DashboardMetricsProps {
  onCardClick?: (type: string, data?: any) => void;
}

const DashboardMetricsComponent: React.FC<DashboardMetricsProps> = ({ onCardClick }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardMetrics();
      if (response.success) {
        setMetrics(response.data);
      } else {
        setError('Error al cargar las métricas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-300 mb-4">{error}</p>
        <button 
          onClick={loadMetrics}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-gray-400 py-8">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard de Métricas</h2>
        <button 
          onClick={loadMetrics}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <FaChartLine className="w-4 h-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Métricas de Usuarios */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Usuarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Usuarios"
            value={metrics.users.total}
            icon={<FaUsers className="w-6 h-6 text-white" />}
            color="bg-blue-600"
            onClick={() => onCardClick?.('users', { type: 'total' })}
          />
          <MetricCard
            title="Usuarios Activos"
            value={metrics.users.active}
            icon={<FaUsers className="w-6 h-6 text-white" />}
            color="bg-green-600"
            onClick={() => onCardClick?.('users', { type: 'active' })}
            subtitle="Con autenticación configurada"
          />
          <MetricCard
            title="Administradores"
            value={metrics.users.admin}
            icon={<FaUserShield className="w-6 h-6 text-white" />}
            color="bg-purple-600"
            onClick={() => onCardClick?.('users', { type: 'admin' })}
          />
          <MetricCard
            title="Usuarios Regulares"
            value={metrics.users.regular}
            icon={<FaUsers className="w-6 h-6 text-white" />}
            color="bg-gray-600"
            onClick={() => onCardClick?.('users', { type: 'regular' })}
          />
        </div>
      </div>

      {/* Métricas de Generaciones */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Generaciones con n8n</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Generaciones"
            value={metrics.generations.total}
            icon={<FaBrain className="w-6 h-6 text-white" />}
            color="bg-indigo-600"
            onClick={() => onCardClick?.('generations', { type: 'total' })}
          />
          <MetricCard
            title="Generaciones Hoy"
            value={metrics.generations.today}
            icon={<FaBrain className="w-6 h-6 text-white" />}
            color="bg-yellow-600"
            onClick={() => onCardClick?.('generations', { type: 'today' })}
          />
          <MetricCard
            title="Esta Semana"
            value={metrics.generations.thisWeek}
            icon={<FaBrain className="w-6 h-6 text-white" />}
            color="bg-orange-600"
            onClick={() => onCardClick?.('generations', { type: 'week' })}
          />
          <MetricCard
            title="Este Mes"
            value={metrics.generations.thisMonth}
            icon={<FaBrain className="w-6 h-6 text-white" />}
            color="bg-red-600"
            onClick={() => onCardClick?.('generations', { type: 'month' })}
          />
        </div>
      </div>

      {/* Top Usuarios */}
      {metrics.topUsers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Usuarios Más Activos</h3>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="space-y-3">
              {metrics.topUsers.slice(0, 5).map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.userName}</p>
                      <p className="text-gray-400 text-sm">{user.userEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{user.generationCount}</p>
                    <p className="text-gray-400 text-xs">generaciones</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas por Formato */}
      {metrics.formatStats.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Formatos Más Populares</h3>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.formatStats.slice(0, 6).map((format) => (
                <div key={format._id} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-medium capitalize">{format._id}</p>
                  <p className="text-2xl font-bold text-purple-400">{format.count}</p>
                  <p className="text-gray-400 text-sm">generaciones</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMetricsComponent;