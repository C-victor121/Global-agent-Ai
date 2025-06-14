"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import axiosInstance from '@/services/api';
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
  descripcion_producto?: string;
}

interface WebhookResponse {
  id: string;
  timestamp: string;
  intention: string;
  response: string;
  target?: string;
  product_service?: string;
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
  const [webhookResponses, setWebhookResponses] = useState<WebhookResponse[]>([]); // Aunque no se usa directamente para mostrar, podría ser útil para lógica futura
  const [pendingResponse, setPendingResponse] = useState<WebhookResponse | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedResponseForModal, setSelectedResponseForModal] = useState<WebhookResponse | null>(null);
  const [showHistoryItemModal, setShowHistoryItemModal] = useState(false);
  const [selectedHistoryItemForModal, setSelectedHistoryItemForModal] = useState<GenerationHistoryItem | null>(null);
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
    const toastId = toast.loading('Generando contenido con IA...'); // Guardar ID para dismiss específico

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/content-generation';

    try {
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
      const newGeneratedText = n8nResult.text || (typeof n8nResult === 'string' ? n8nResult : '');

      if (!newGeneratedText && typeof newGeneratedText !== 'string') {
        throw new Error('n8n no devolvió el texto en el formato esperado.');
      }

      setGeneratedText(newGeneratedText);
      toast.success('Contenido generado por IA recibido!', { id: toastId });

      const newWebhookResponse: WebhookResponse = {
        id: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        intention: formData.intencion,
        response: newGeneratedText,
        target: formData.objetivo,
        product_service: formData.producto_servicio,
      };
      setPendingResponse(newWebhookResponse);

    } catch (err: any) {
      toast.error(err.message || 'Error al generar contenido con IA.', { id: toastId });
      setError(err.message);
      setGeneratedText('');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptResponse = async (responseToSave: WebhookResponse) => {
    if (!responseToSave) return;
    const toastId = toast.loading('Guardando contenido...');
    try {
      const payload = {
        intencion: responseToSave.intention,
        tono: formData.tono,
        objetivo: responseToSave.target || formData.objetivo,
        producto_servicio: responseToSave.product_service || formData.producto_servicio,
        audiencia: formData.audiencia,
        palabras_clave: formData.palabras_clave,
        longitud: formData.longitud,
        formato: formData.formato,
        generatedText: responseToSave.response,
        descripcion_producto: responseToSave.product_service || formData.producto_servicio, // Asegurar que se guarda
      };
      await axiosInstance.post('/content/save', payload);
      toast.success('Contenido guardado en el historial.', { id: toastId });
      setPendingResponse(null);
      setGeneratedText('');
      fetchHistory();
      closeResponseModal(); // Cerrar modal si estaba abierto
    } catch (error) {
      toast.error('Error al guardar el contenido.', { id: toastId });
      console.error('Error saving content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento del historial?')) return;
    const toastId = toast.loading('Eliminando elemento...');
    try {
      await axiosInstance.delete(`/content/${id}`);
      toast.success('Elemento eliminado del historial.', { id: toastId });
      fetchHistory();
    } catch (error) {
      toast.error('Error al eliminar el elemento.', { id: toastId });
      console.error('Error deleting content item:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar TODO tu historial de contenido generado? Esta acción no se puede deshacer.')) return;
    const toastId = toast.loading('Eliminando todo el historial...');
    try {
      await axiosInstance.delete('/content/all');
      toast.success('Todo el historial ha sido eliminado.', { id: toastId });
      fetchHistory();
    } catch (error) {
      toast.error('Error al eliminar todo el historial.', { id: toastId });
      console.error('Error deleting all content history:', error);
    }
  };

  const rejectResponse = () => {
    setPendingResponse(null);
    setGeneratedText('');
    toast('Generación descartada.');
    closeResponseModal(); // Cerrar modal si estaba abierto
  };

  const openResponseModal = (response: WebhookResponse) => {
    setSelectedResponseForModal(response);
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSelectedResponseForModal(null);
  };

  const openHistoryItemModal = (item: GenerationHistoryItem) => {
    setSelectedHistoryItemForModal(item);
    setShowHistoryItemModal(true);
  };

  const closeHistoryItemModal = () => {
    setShowHistoryItemModal(false);
    setSelectedHistoryItemForModal(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4 md:p-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Asistente de Contenidos IA
        </h1>
        <p className="mt-2 text-lg text-slate-300">Genera textos impactantes para tu negocio en segundos.</p>
      </header>

      {/* Contenedor principal para el formulario y el historial */} 
      <div className="flex flex-col gap-12 items-start max-w-5xl mx-auto">
        
        {/* Sección Crear Nuevo Contenido */} 
        <div className="w-full bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl ring-1 ring-white/10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Crear Nuevo Contenido</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="intencion" className="block text-sm font-medium text-slate-300 mb-1">Intención del Texto</label>
                <select id="intencion" name="intencion" value={formData.intencion} onChange={handleChange} className="mt-1 block w-full py-2.5 px-3 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                  {intencionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} 
                </select>
              </div>
              <div>
                <label htmlFor="tono" className="block text-sm font-medium text-slate-300 mb-1">Tono del Texto</label>
                <select id="tono" name="tono" value={formData.tono} onChange={handleChange} className="mt-1 block w-full py-2.5 px-3 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                  {tonoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} 
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="objetivo" className="block text-sm font-medium text-slate-300 mb-1">Objetivo Principal (¿Qué quieres lograr?)</label>
              <input type="text" name="objetivo" id="objetivo" value={formData.objetivo} onChange={handleChange} required className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md p-2.5" />
            </div>

            <div>
              <label htmlFor="producto_servicio" className="block text-sm font-medium text-slate-300 mb-1">Descripción del Producto/Servicio</label>
              <textarea name="producto_servicio" id="producto_servicio" value={formData.producto_servicio} onChange={handleChange} rows={3} required className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md p-2.5"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="audiencia" className="block text-sm font-medium text-slate-300 mb-1">Público Objetivo</label>
                <input type="text" name="audiencia" id="audiencia" value={formData.audiencia} onChange={handleChange} required className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md p-2.5" />
              </div>
              <div>
                <label htmlFor="palabras_clave" className="block text-sm font-medium text-slate-300 mb-1">Palabras Clave (separadas por comas)</label>
                <input type="text" name="palabras_clave" id="palabras_clave" value={formData.palabras_clave} onChange={handleChange} required className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md p-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="longitud" className="block text-sm font-medium text-slate-300 mb-1">Longitud del Texto</label>
                <select id="longitud" name="longitud" value={formData.longitud} onChange={handleChange} className="mt-1 block w-full py-2.5 px-3 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                  {longitudOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} 
                </select>
              </div>
              <div>
                <label htmlFor="formato" className="block text-sm font-medium text-slate-300 mb-1">Formato de Salida</label>
                <select id="formato" name="formato" value={formData.formato} onChange={handleChange} className="mt-1 block w-full py-2.5 px-3 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                  {formatoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} 
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center py-2">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : 'Generar Contenido'}
            </button>
          </form>

          {/* Respuesta Pendiente del Webhook (se muestra aquí si existe) */} 
          {pendingResponse && (
            <div className="mt-10 p-6 border border-sky-500/50 rounded-lg bg-slate-700/50 shadow-lg">
              <h3 className="text-xl font-semibold text-sky-300 mb-4">Nueva Sugerencia de Contenido</h3>
              <p className="text-sm text-slate-400 mb-1">Recibido: {new Date(pendingResponse.timestamp).toLocaleString()}</p>
              <p className="font-medium text-slate-200">Intención: <span className="font-normal text-slate-300">{intencionOptions.find(o => o.value === pendingResponse.intention)?.label || pendingResponse.intention}</span></p>
              {pendingResponse.target && <p className="font-medium text-slate-200">Objetivo: <span className="font-normal text-slate-300">{pendingResponse.target}</span></p>}
              {pendingResponse.product_service && <p className="font-medium text-slate-200">Producto/Servicio: <span className="font-normal text-slate-300">{pendingResponse.product_service}</span></p>}
              <p className="font-medium text-slate-200 mt-3">Respuesta (extracto):</p>
              <p className="text-sm text-slate-300 whitespace-pre-line bg-slate-600/50 p-3 rounded-md my-2 max-h-32 overflow-y-auto">{pendingResponse.response.substring(0, 200)}{pendingResponse.response.length > 200 ? '...' : ''}</p>
              <div className="mt-5 flex flex-wrap gap-3 justify-end">
                <button onClick={() => openResponseModal(pendingResponse)} className="py-2 px-4 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-md transition-colors">Ver Completo</button>
                <button onClick={() => acceptResponse(pendingResponse)} className="py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-md transition-colors">Aceptar y Guardar</button>
                <button onClick={rejectResponse} className="py-2 px-4 text-sm font-medium text-slate-800 bg-slate-300 hover:bg-slate-400 rounded-md shadow-md transition-colors">Descartar</button>
              </div>
            </div>
          )}

          {/* Texto generado (si no hay pendiente, o si se quiere mostrar siempre) - Opcional si pendingResponse lo reemplaza */} 
          {generatedText && !pendingResponse && (
            <div className="mt-8 p-4 border border-slate-600 rounded-md bg-slate-700">
              <h3 className="text-xl font-semibold mb-3 text-slate-200">Texto Generado:</h3>
              <textarea value={generatedText} readOnly rows={10} className="w-full p-2 border border-slate-500 rounded-md bg-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <button 
                onClick={() => { navigator.clipboard.writeText(generatedText); toast.success('Texto copiado!'); }}
                className="mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-green-500"
              >
                Copiar Texto
              </button>
            </div>
          )}
        </div>

        {/* Sección Historial de Contenidos Guardados */} 
        <div className="w-full bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl ring-1 ring-white/10 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Historial de Contenidos</h2>
            {history.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-md transition-colors duration-150 ease-in-out"
              >
                Eliminar Todo el Historial
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <p className="text-slate-400 text-center py-5">No hay generaciones guardadas en tu historial.</p>
          ) : (
            <div className="overflow-x-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Fecha y Hora</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Intención</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Producto/Servicio</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Texto (Extracto)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
                    <tr key={item._id} className="hover:bg-slate-700/70 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{intencionOptions.find(o => o.value === item.intencion)?.label || item.intencion}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{item.producto_servicio || item.descripcion_producto || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {item.generatedText ? `${item.generatedText.substring(0, 70)}...` : 'N/A'}
                        <button 
                          onClick={() => openHistoryItemModal(item)} 
                          className="ml-2 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                        >
                          Ver completo
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-3">
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-400 transition-colors duration-150 ease-in-out"
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
        </div>
      </div>

      {/* El modal para mostrar la respuesta completa de PENDING RESPONSE ya no es necesario */}

      {/* Modal para ver item completo del HISTORIAL */} 
      {showHistoryItemModal && selectedHistoryItemForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeHistoryItemModal}>
          <div className="relative bg-slate-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-auto ring-1 ring-white/10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={closeHistoryItemModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-3xl font-light">&times;</button>
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">Detalle del Historial</h3>
            <p className="text-sm text-slate-400 mb-1">Guardado: {new Date(selectedHistoryItemForModal.createdAt).toLocaleString()}</p>
            <p className="font-medium text-slate-300">Intención: <span className="font-normal text-slate-200">{intencionOptions.find(o => o.value === selectedHistoryItemForModal.intencion)?.label || selectedHistoryItemForModal.intencion}</span></p>
            {selectedHistoryItemForModal.objetivo && <p className="font-medium text-slate-300">Objetivo: <span className="font-normal text-slate-200">{selectedHistoryItemForModal.objetivo}</span></p>}
            {(selectedHistoryItemForModal.producto_servicio || selectedHistoryItemForModal.descripcion_producto) && <p className="font-medium text-slate-300">Producto/Servicio: <span className="font-normal text-slate-200">{selectedHistoryItemForModal.producto_servicio || selectedHistoryItemForModal.descripcion_producto}</span></p>}
            <div className="mt-4 mb-6 p-3 border border-slate-700 rounded-md bg-slate-900/50 max-h-[40vh] overflow-y-auto">
              <h4 className="text-lg font-semibold text-slate-200 mb-2">Texto Guardado:</h4>
              <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono">{selectedHistoryItemForModal.generatedText || 'No hay texto generado para este item.'}</pre>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              {selectedHistoryItemForModal.generatedText && (
                <button 
                  onClick={() => { navigator.clipboard.writeText(selectedHistoryItemForModal.generatedText!); toast.success('Texto copiado!'); }}
                  className="py-2 px-4 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-md transition-colors"
                >
                  Copiar Texto
                </button>
              )}
              <button onClick={closeHistoryItemModal} className="py-2 px-4 text-sm font-medium text-slate-800 bg-slate-300 hover:bg-slate-400 rounded-md shadow-md transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Loader Global (opcional, react-hot-toast ya es bastante bueno) */}
      {/* {isLoading && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex flex-col items-center justify-center z-[100]">
          <svg className="animate-spin h-12 w-12 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-sky-300">Generando magia...</p>
        </div>
      )} */} 
    </div>
  );
};

export default ContentGenerationPage;