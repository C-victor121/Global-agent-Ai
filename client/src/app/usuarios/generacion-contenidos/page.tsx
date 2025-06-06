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
  descripcion_producto?: string; // Añadido para la descripción del producto
}

interface WebhookResponse {
  id: string;
  timestamp: string;
  intention: string;
  response: string; // Texto completo de la respuesta de n8n
  target?: string; // Objetivo, si se envía a n8n
  product_service?: string; // Producto/Servicio, si se envía a n8n
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
  const [webhookResponses, setWebhookResponses] = useState<WebhookResponse[]>([]);
  const [pendingResponse, setPendingResponse] = useState<WebhookResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<WebhookResponse | null>(null);
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
    setPendingResponse(null);
    toast.loading('Generando contenido con IA...');

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/content-generation';

    try {
      // Primero, enviamos la solicitud al webhook de n8n
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!n8nResponse.ok) {
        const errorData = await n8nResponse.text();
        throw new Error(`Error del webhook de n8n: ${n8nResponse.status} - ${errorData}`);
      }

      const n8nResult = await n8nResponse.json();
      console.log('Respuesta de n8n:', n8nResult);

      // Asegurarse de que n8nResult.text exista y sea una cadena
      const newGeneratedText = n8nResult.text || (typeof n8nResult === 'string' ? n8nResult : '');

      if (!newGeneratedText && typeof newGeneratedText !== 'string') {
        console.error('n8n no devolvió el texto generado correctamente. Respuesta:', n8nResult);
        throw new Error('n8n no devolvió el texto en el formato esperado.');
      }

      setGeneratedText(newGeneratedText);
      toast.dismiss();
      toast.success('Contenido generado por IA recibido!');

      // Crear una respuesta pendiente para mostrar al usuario
      const newWebhookResponse: WebhookResponse = {
        id: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        intention: formData.intencion,
        response: newGeneratedText,
        target: formData.objetivo,
        product_service: formData.producto_servicio,
      };
      setPendingResponse(newWebhookResponse);
      // No añadir a webhookResponses aquí, solo a pendingResponse

    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      toast.dismiss();
      const errorMessage = err.message || 'Error al generar contenido con IA.';
      setError(errorMessage);
      setGeneratedText(''); // Limpiar texto generado si hay error
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptResponse = async (responseToSave: WebhookResponse) => {
    if (!responseToSave) return;
    toast.loading('Guardando contenido...');
    try {
      // Construir el payload con todos los campos relevantes del formulario y la respuesta de n8n
      const payload = {
        intencion: responseToSave.intention,
        tono: formData.tono, // Tomar de formData actual
        objetivo: responseToSave.target || formData.objetivo,
        producto_servicio: responseToSave.product_service || formData.producto_servicio,
        audiencia: formData.audiencia, // Tomar de formData actual
        palabras_clave: formData.palabras_clave, // Tomar de formData actual
        longitud: formData.longitud, // Tomar de formData actual
        formato: formData.formato, // Tomar de formData actual
        generatedText: responseToSave.response,
      };
      // Llamada al nuevo endpoint del backend
      await axiosInstance.post('/content/save', payload);
      toast.dismiss();
      toast.success('Contenido guardado en el historial.');
      setPendingResponse(null); // Limpiar respuesta pendiente
      setGeneratedText(''); // Limpiar el área de texto principal también
      fetchHistory(); // Recargar historial
    } catch (error) {
      toast.dismiss();
      console.error('Error saving content:', error);
      toast.error('Error al guardar el contenido.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento del historial?')) return;
    toast.loading('Eliminando elemento...');
    try {
      await axiosInstance.delete(`/content/${id}`);
      toast.dismiss();
      toast.success('Elemento eliminado del historial.');
      fetchHistory();
    } catch (error) {
      toast.dismiss();
      console.error('Error deleting content item:', error);
      toast.error('Error al eliminar el elemento.');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar TODO tu historial de contenido generado? Esta acción no se puede deshacer.')) return;
    toast.loading('Eliminando todo el historial...');
    try {
      await axiosInstance.delete('/content/all');
      toast.dismiss();
      toast.success('Todo el historial ha sido eliminado.');
      fetchHistory();
    } catch (error) {
      toast.dismiss();
      console.error('Error deleting all content history:', error);
      toast.error('Error al eliminar todo el historial.');
    }
  };

  const rejectResponse = () => {
    setPendingResponse(null);
    setGeneratedText(''); // También limpiar el área de texto principal si se rechaza
    toast('Generación descartada.'); // Cambiado de toast.info a toast()
  };

  const openModal = (response: WebhookResponse) => {
    setSelectedResponse(response);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResponse(null);
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

      {/* Layout principal: Formulario y Texto Generado a la izquierda, Historial a la derecha (desktop) o abajo (móvil) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna Izquierda: Formulario y Texto Generado */}
        <div className="lg:w-1/2 flex flex-col gap-8">
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
        </div> {/* Fin Formulario y Texto Generado */}
        </div> {/* Fin Columna Izquierda */}

        {/* Columna Derecha: Historial (Desktop) / Abajo (Móvil) */}
        <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-lg mt-8 lg:mt-0">
          {/* Respuesta Pendiente del Webhook */}
          {pendingResponse && (
            <div className="mb-8 p-4 border border-blue-300 rounded-md bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Nueva Sugerencia de Contenido</h3>
              <p className="text-sm text-gray-600 mb-1">Recibido: {new Date(pendingResponse.timestamp).toLocaleString()}</p>
              <p className="font-medium text-gray-800">Intención: <span className="font-normal">{intencionOptions.find(o => o.value === pendingResponse.intention)?.label || pendingResponse.intention}</span></p>
              {pendingResponse.target && <p className="font-medium text-gray-800">Objetivo: <span className="font-normal">{pendingResponse.target}</span></p>}
              {pendingResponse.product_service && <p className="font-medium text-gray-800">Producto/Servicio: <span className="font-normal">{pendingResponse.product_service}</span></p>}
              <p className="font-medium text-gray-800 mt-2">Respuesta (primeras líneas):</p>
              <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-100 p-2 rounded-md">{pendingResponse.response.substring(0, 150)}{pendingResponse.response.length > 150 ? '...' : ''}</p>
              <div className="mt-4 flex space-x-3">
                <button onClick={() => openModal(pendingResponse)} className="py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Ver Completo</button>
                <button onClick={() => acceptResponse(pendingResponse)} className="py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">Aceptar y Guardar</button>
                <button onClick={rejectResponse} className="py-2 px-4 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">Descartar</button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Historial de Contenidos Guardados</h2>
            {history.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition duration-150 ease-in-out"
              >
                Eliminar Todo el Historial
              </button>
            )}
          </div>
          
          {history.length === 0 && !pendingResponse ? (
            <p className="text-gray-500">No hay generaciones previas ni sugerencias pendientes.</p>
          ) : history.length === 0 && pendingResponse ? (
            <p className="text-gray-500">No hay generaciones guardadas. Revisa la sugerencia de arriba.</p>
          ) : (
            <div className="overflow-x-auto max-h-[500px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intención</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto/Servicio</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texto (Extracto)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{intencionOptions.find(o => o.value === item.intencion)?.label || item.intencion}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.producto_servicio}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.generatedText ? `${item.generatedText.substring(0, 50)}...` : 'N/A'}
                        <details className="mt-1 text-xs">
                          <summary className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Ver completo</summary>
                          <textarea readOnly value={item.generatedText || ''} rows={5} className="mt-1 w-full p-1 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none"></textarea>
                        </details>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div> {/* Fin Historial */}
      </div> {/* Fin Layout Principal */}

      {/* Modal para ver respuesta completa */}
      {showModal && selectedResponse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-black" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Respuesta Completa de IA</h3>
            <p className="text-sm text-gray-500 mb-1">Generado: {new Date(selectedResponse.timestamp).toLocaleString()}</p>
            <p className="font-medium text-gray-700">Intención: <span className="font-normal">{intencionOptions.find(o => o.value === selectedResponse.intention)?.label || selectedResponse.intention}</span></p>
            {selectedResponse.target && <p className="font-medium text-gray-700">Objetivo: <span className="font-normal">{selectedResponse.target}</span></p>}
            {selectedResponse.product_service && <p className="font-medium text-gray-700">Producto/Servicio: <span className="font-normal">{selectedResponse.product_service}</span></p>}
            <div className="mt-4 mb-6 p-3 border border-gray-200 rounded-md bg-gray-50 max-h-[40vh] overflow-y-auto">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Texto:</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{selectedResponse.response}</pre>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <button 
                onClick={() => { navigator.clipboard.writeText(selectedResponse.response); toast.success('Texto copiado!'); }}
                className="py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Copiar Texto
              </button>
              {!history.find(h => h.generatedText === selectedResponse.response && new Date(h.createdAt).toISOString().split('T')[0] === selectedResponse.timestamp.split('T')[0]) && pendingResponse?.id === selectedResponse.id && (
                 // Solo mostrar Aceptar y Guardar si es la respuesta pendiente actual y no está ya en el historial (comparación simple)
                <button onClick={() => { acceptResponse(selectedResponse); closeModal(); }} className="py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">Aceptar y Guardar</button>
              )}
              <button onClick={closeModal} className="py-2 px-4 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationPage;