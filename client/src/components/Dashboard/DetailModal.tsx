'use client';

import { useState, useEffect } from 'react';
import { dashboardService, GenerationDetail, HistoricalDataPoint } from '@/services/dashboardService';
import { FaTimes, FaSpinner, FaCalendar, FaUser,FaChartLine, FaBrain, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'users' | 'generations';
  data?: any;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, type, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generations, setGenerations] = useState<GenerationDetail[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (isOpen && type === 'generations') {
      loadGenerationDetails();
    } else if (isOpen && type === 'users') {
      loadHistoricalData();
    }
  }, [isOpen, type, currentPage, selectedPeriod]);

  const loadGenerationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getGenerationDetails(currentPage, 10);
      if (response.success) {
        setGenerations(response.data.generations);
        setTotalPages(response.data.pagination.total);
      } else {
        setError('Error al cargar los detalles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoricalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getHistoricalData(selectedPeriod);
      if (response.success) {
        setHistoricalData(response.data);
      } else {
        setError('Error al cargar los datos históricos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModalTitle = () => {
    if (type === 'users') {
      return `Datos Históricos de Usuarios - ${data?.type || 'General'}`;
    }
    return `Detalles de Generaciones - ${data?.type || 'General'}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <FaSpinner className="animate-spin text-2xl text-purple-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              <p>{error}</p>
              <button
                onClick={type === 'generations' ? loadGenerationDetails : loadHistoricalData}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div>
              {type === 'users' && historicalData && (
                <div>
                  {/* Period Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Período de tiempo:
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="7d">Últimos 7 días</option>
                      <option value="30d">Últimos 30 días</option>
                      <option value="90d">Últimos 90 días</option>
                    </select>
                  </div>

                  {/* Historical Charts Data */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FaChartLine className="w-5 h-5 mr-2" />
                      Datos Históricos (Usuarios y Generaciones)
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {historicalData.map((item) => (
                        <div key={item.date} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white/5 rounded mb-2">
                          <span className="text-gray-300 font-medium mb-1 sm:mb-0">{new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <div className="flex space-x-4">
                            <span className="text-white"><FaUser className="inline mr-1" /> Usuarios: {item.userCount}</span>
                            <span className="text-white"><FaBrain className="inline mr-1" /> Generaciones: {item.generationCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {type === 'generations' && (
                <div>
                  {/* Generations List */}
                  <div className="space-y-4">
                    {generations.map((generation) => (
                      <div key={generation._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white capitalize">
                              {generation.formato} - {generation.intencion}
                            </h3>
                            <p className="text-gray-400 text-sm flex items-center mt-1">
                              <FaUser className="w-4 h-4 mr-1" />
                              {generation.userId.name} ({generation.userId.email})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm flex items-center">
                              <FaCalendar className="w-4 h-4 mr-1" />
                              {formatDate(generation.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><span className="text-gray-400">Tono:</span> <span className="text-white">{generation.tono}</span></p>
                            <p><span className="text-gray-400">Objetivo:</span> <span className="text-white">{generation.objetivo}</span></p>
                            <p><span className="text-gray-400">Audiencia:</span> <span className="text-white">{generation.audiencia}</span></p>
                          </div>
                          <div>
                            <p><span className="text-gray-400">Producto/Servicio:</span> <span className="text-white">{generation.producto_servicio}</span></p>
                            <p><span className="text-gray-400">Palabras clave:</span> <span className="text-white">{generation.palabras_clave}</span></p>
                            <p><span className="text-gray-400">Longitud:</span> <span className="text-white">{generation.longitud}</span></p>
                          </div>
                        </div>

                        {generation.generatedText && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-gray-400 text-sm mb-2">Texto generado:</p>
                            <p className="text-white text-sm leading-relaxed">
                              {generation.generatedText.length > 200 
                                ? `${generation.generatedText.substring(0, 200)}...` 
                                : generation.generatedText
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                      >
                        <FaChevronLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </button>
                      
                      <span className="text-white">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                      >
                        <span>Siguiente</span>
                        <FaChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;