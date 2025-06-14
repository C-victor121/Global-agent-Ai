'use client';

import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEye, FaReply, FaCheck, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface ContactMessage {
  _id: string;
  visitorName: string;
  visitorEmail: string;
  subject: string;
  message: string;
  wordpressSiteUrl: string;
  wordpressSiteName: string;
  aiResponse?: string;
  responseStatus: 'pending' | 'processing' | 'sent' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface ApiInfo {
  apiKey: string;
  messageCount: number;
  messageLimit: number;
  wordpressUrl?: string;
}

export default function MensajesWordPressPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messagesPerPage = 10;

  // Cargar información de API y mensajes
  useEffect(() => {
    fetchApiInfo();
    fetchMessages();
  }, [currentPage]);

  const fetchApiInfo = async () => {
    try {
      const response = await fetch('/api/api-info');
      if (response.ok) {
        const data = await response.json();
        setApiInfo(data);
      }
    } catch (error) {
      console.error('Error fetching API info:', error);
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/messages?page=${currentPage}&limit=${messagesPerPage}`);
      if (!response.ok) {
        throw new Error('Error al cargar mensajes');
      }
      const data = await response.json();
      setMessages(data.messages);
      setTotalPages(Math.ceil(data.total / messagesPerPage));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch('/api/generate-api-key', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setApiInfo(prev => prev ? { ...prev, apiKey: data.apiKey } : null);
      }
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  const updateWordPressUrl = async (url: string) => {
    try {
      const response = await fetch('/api/wordpress-url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wordpressUrl: url })
      });
      if (response.ok) {
        setApiInfo(prev => prev ? { ...prev, wordpressUrl: url } : null);
      }
    } catch (error) {
      console.error('Error updating WordPress URL:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaSpinner className="animate-spin text-yellow-500" />;
      case 'processing':
        return <FaSpinner className="animate-spin text-blue-500" />;
      case 'sent':
        return <FaCheck className="text-green-500" />;
      case 'failed':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'sent':
        return 'Enviado';
      case 'failed':
        return 'Fallido';
      default:
        return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2 text-lg">Cargando mensajes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mensajes de WordPress</h1>
        <div className="text-sm text-gray-400">
          {apiInfo && (
            <span>
              Mensajes usados: {apiInfo.messageCount}/{apiInfo.messageLimit}
            </span>
          )}
        </div>
      </div>

      {/* Información de API Key */}
      {apiInfo && (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Configuración de API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={apiInfo.apiKey || 'No generada'}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={generateApiKey}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Generar Nueva
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL de WordPress</label>
              <input
                type="url"
                value={apiInfo.wordpressUrl || ''}
                onChange={(e) => updateWordPressUrl(e.target.value)}
                placeholder="https://tu-sitio-wordpress.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Lista de mensajes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel izquierdo - Lista de mensajes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mensajes Recibidos</h2>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FaEnvelope className="mx-auto text-4xl mb-4" />
              <p>No hay mensajes aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMessage?._id === message._id
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{message.visitorName}</h3>
                        {getStatusIcon(message.responseStatus)}
                      </div>
                      <p className="text-sm text-gray-400 mb-1">{message.visitorEmail}</p>
                      <p className="text-sm font-medium mb-2">{message.subject}</p>
                      <p className="text-xs text-gray-500 truncate">{message.message}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white/10 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-white/10 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Panel derecho - Detalle del mensaje */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Detalle del Mensaje</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedMessage.responseStatus)}
                  <span className="text-sm">{getStatusText(selectedMessage.responseStatus)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">De:</label>
                  <p>{selectedMessage.visitorName} ({selectedMessage.visitorEmail})</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Asunto:</label>
                  <p>{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sitio WordPress:</label>
                  <p>{selectedMessage.wordpressSiteName}</p>
                  <p className="text-sm text-gray-500">{selectedMessage.wordpressSiteUrl}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mensaje:</label>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {selectedMessage.aiResponse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Respuesta de IA:</label>
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                      <p className="whitespace-pre-wrap">{selectedMessage.aiResponse}</p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>Recibido: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  {selectedMessage.updatedAt !== selectedMessage.createdAt && (
                    <p>Actualizado: {new Date(selectedMessage.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FaEye className="mx-auto text-4xl mb-4" />
              <p>Selecciona un mensaje para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}