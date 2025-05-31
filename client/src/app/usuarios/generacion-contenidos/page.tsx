"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import axiosInstance from '@/services/api'; // Asumiendo que tienes una instancia de axios configurada
import { toast, Toaster } from 'react-hot-toast';

interface FormData {
  intencion: string;
  tono: string;
  objetivo: string;
  producto_servicio: string;
  audiencia: string;
  palabras_clave: string;
  longitud: string;
  formato: string;
}

interface GenerationHistoryItem extends FormData {
  _id: string;
  generatedText?: string;
  createdAt: string;
}

const ContentGenerationPage = () => {
  const [formData, setFormData] = useState<FormData>({
    intencion: 'titulo_producto',
    tono: 'formal',
    objetivo: '',
    producto_servicio: '',
    audiencia: '',
    palabras_clave: '',
    longitud: 'corto',
    formato: 'titulo',
  });
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get<GenerationHistoryItem[]>('/content/history');
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      toast.error('Error al cargar el historial.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedText('');
    setError(null);
    toast.loading('Generando contenido...');

    try {
      const response = await axiosInstance.post<{ message: string; data: GenerationHistoryItem }>('/content/generate', formData);
      setGeneratedText(response.data.data.generatedText || 'No se pudo generar el texto.');
      toast.dismiss();
      toast.success(response.data.message);
      fetchHistory(); // Actualizar historial
    } catch (err: any) {
      console.error('Error generating content:', err);
      toast.dismiss();
      const errorMessage = err.response?.data?.message || 'Error al generar contenido.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const intencionOptions = [
    { value: 'titulo_producto', label: 'Título de Producto' },
    { value: 'descripcion_producto', label: 'Descripción de Producto' },
    { value: 'email', label: 'Email' },
    { value: 'terminos_legales', label: 'Términos Legales' },
    { value: 'mensaje_cliente', label: 'Mensaje para Cliente' },
  ];

  const tonoOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'persuasivo', label: 'Persuasivo' },
    { value: 'amigable', label: 'Amigable' },
    { value: 'profesional', label: 'Profesional' },
    { value: 'divertido', label: 'Divertido' },
  ];

  const longitudOptions = [
    { value: 'corto', label: 'Corto' },
    { value: 'mediano', label: 'Mediano' },
    { value: 'largo', label: 'Largo' },
  ];

  const formatoOptions = [
    { value: 'titulo', label: 'Título' },
    { value: 'descripcion', label: 'Descripción' },
    { value: 'email', label: 'Email' },
    { value: 'terminos_legales', label: 'Términos Legales (Bloque de texto)' },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Generación de Contenidos con IA</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de Generación */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Crear Nuevo Contenido</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="intencion" className="block text-sm font-medium text-gray-700 mb-1">Intención del Texto</label>
              <select id="intencion" name="intencion" value={formData.intencion} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {intencionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="tono" className="block text-sm font-medium text-gray-700 mb-1">Tono del Texto</label>
              <select id="tono" name="tono" value={formData.tono} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {tonoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-1">Objetivo Principal (¿Qué quieres lograr?)</label>
              <input type="text" name="objetivo" id="objetivo" value={formData.objetivo} onChange={handleChange} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" />
            </div>

            <div>
              <label htmlFor="producto_servicio" className="block text-sm font-medium text-gray-700 mb-1">Descripción del Producto/Servicio</label>
              <textarea name="producto_servicio" id="producto_servicio" value={formData.producto_servicio} onChange={handleChange} rows={3} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"></textarea>
            </div>

            <div>
              <label htmlFor="audiencia" className="block text-sm font-medium text-gray-700 mb-1">Público Objetivo</label>
              <input type="text" name="audiencia" id="audiencia" value={formData.audiencia} onChange={handleChange} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" />
            </div>

            <div>
              <label htmlFor="palabras_clave" className="block text-sm font-medium text-gray-700 mb-1">Palabras Clave (separadas por comas)</label>
              <input type="text" name="palabras_clave" id="palabras_clave" value={formData.palabras_clave} onChange={handleChange} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" />
            </div>

            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-1">Longitud del Texto</label>
              <select id="longitud" name="longitud" value={formData.longitud} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {longitudOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="formato" className="block text-sm font-medium text-gray-700 mb-1">Formato de Salida</label>
              <select id="formato" name="formato" value={formData.formato} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {formatoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {isLoading ? 'Generando...' : 'Generar Contenido'}
            </button>
          </form>

          {generatedText && (
            <div className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Texto Generado:</h3>
              <textarea value={generatedText} readOnly rows={10} className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <button 
                onClick={() => { navigator.clipboard.writeText(generatedText); toast.success('Texto copiado!'); }}
                className="mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Copiar Texto
              </button>
            </div>
          )}
        </div>

        {/* Historial de Generaciones */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Historial de Generaciones</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">No hay generaciones previas.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {history.map(item => (
                <div key={item._id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-500 mb-1">{new Date(item.createdAt).toLocaleString()}</p>
                  <p className="font-semibold text-gray-700">Intención: <span className="font-normal">{intencionOptions.find(o => o.value === item.intencion)?.label || item.intencion}</span></p>
                  <p className="font-semibold text-gray-700">Objetivo: <span className="font-normal">{item.objetivo}</span></p>
                  {item.generatedText && (
                    <details className="mt-2">
                      <summary className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">Ver texto generado</summary>
                      <textarea readOnly value={item.generatedText} rows={5} className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none"></textarea>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationPage;