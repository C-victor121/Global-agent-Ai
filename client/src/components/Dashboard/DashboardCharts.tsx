'use client';

import { HistoricalDataPoint, FormatStat } from '@/services/dashboardService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardChartsProps {
  historicalData: HistoricalDataPoint[];
  formatStats: FormatStat[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ historicalData, formatStats }) => {
  const chartData = historicalData.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    usuarios: item.userCount,
    generaciones: item.generationCount,
  }));

  const formatChartData = formatStats.map(stat => ({
    name: stat._id,
    cantidad: stat.count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Actividad en el Tiempo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#e5e7eb' }}
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#d1d5db' }} />
            <Line type="monotone" dataKey="usuarios" stroke="#8b5cf6" strokeWidth={2} name="Nuevos Usuarios" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="generaciones" stroke="#34d399" strokeWidth={2} name="Generaciones Creadas" dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Estadísticas por Formato</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formatChartData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#e5e7eb' }}
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#d1d5db' }} />
            <Bar dataKey="cantidad" fill="#f7e94f" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;