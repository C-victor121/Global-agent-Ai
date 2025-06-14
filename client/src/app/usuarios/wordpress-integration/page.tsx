'use client';

import React, { useState, useEffect } from 'react';
import { FaWordpress, FaKey, FaCopy, FaCheck, FaDownload, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

interface ApiInfo {
  apiKey: string;
  messageCount: number;
  messageLimit: number;
  wordpressUrl?: string;
}

export default function WordPressIntegrationPage() {
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);
  const [wordpressUrl, setWordpressUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiInfo();
  }, []);

  const fetchApiInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api-info');
      if (response.ok) {
        const data = await response.json();
        setApiInfo(data);
        setWordpressUrl(data.wordpressUrl || '');
      } else {
        throw new Error('Error al cargar información de API');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/generate-api-key', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setApiInfo(prev => prev ? { ...prev, apiKey: data.apiKey } : null);
      } else {
        throw new Error('Error al generar API Key');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al generar API Key');
    }
  };

  const updateWordPressUrl = async () => {
    try {
      const response = await fetch('/api/wordpress-url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wordpressUrl })
      });
      if (response.ok) {
        setApiInfo(prev => prev ? { ...prev, wordpressUrl } : null);
        alert('URL de WordPress actualizada correctamente');
      } else {
        throw new Error('Error al actualizar URL');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar URL');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  // El código del plugin ahora se encuentra en client/public/wordpress-plugin/global-agent-ai-contact-integration.php
  // y se descarga como un archivo ZIP.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-lg">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center space-x-3">
        <FaWordpress className="text-4xl text-blue-500" />
        <h1 className="text-3xl font-bold">Integración con WordPress</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Configuración de API */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaKey className="mr-2" />
          Configuración de API Key
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tu API Key</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={apiInfo?.apiKey || 'No generada'}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(apiInfo?.apiKey || '')}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
                disabled={!apiInfo?.apiKey}
              >
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              </button>
              <button
                onClick={generateApiKey}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Generar Nueva
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Usa esta API Key en tu plugin de WordPress
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL de tu sitio WordPress</label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={wordpressUrl}
                onChange={(e) => setWordpressUrl(e.target.value)}
                placeholder="https://tu-sitio-wordpress.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={updateWordPressUrl}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas de uso */}
        {apiInfo && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="font-medium mb-2">Estadísticas de Uso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Mensajes procesados:</span>
                <span className="ml-2 font-medium">{apiInfo.messageCount}</span>
              </div>
              <div>
                <span className="text-gray-400">Límite mensual:</span>
                <span className="ml-2 font-medium">{apiInfo.messageLimit}</span>
              </div>
              <div>
                <span className="text-gray-400">Restantes:</span>
                <span className="ml-2 font-medium text-green-400">
                  {apiInfo.messageLimit - apiInfo.messageCount}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((apiInfo.messageCount / apiInfo.messageLimit) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instrucciones de instalación */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaDownload className="mr-2" />
          Instalación del Plugin
        </h2>
        
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-400 mb-1">Instrucciones de Instalación</h3>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Descarga el archivo ZIP del plugin.</li>
                  <li>En tu panel de WordPress, ve a "Plugins" → "Añadir nuevo" → "Subir plugin".</li>
                  <li>Selecciona el archivo ZIP descargado y haz clic en "Instalar ahora".</li>
                  <li>Activa el plugin.</li>
                  <li>Una vez activado, el plugin te guiará para conectar tu cuenta de Global Agent AI.</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <a
              href="/api/download-wordpress-plugin"
              download
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <FaDownload className="mr-2" />
              Descargar Plugin (ZIP)
            </a>
          </div>
        </div>
      </div>

      {/* Formularios compatibles */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Formularios Compatibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-medium mb-2">Contact Form 7</h3>
            <p className="text-sm text-gray-400">Integración automática con formularios CF7</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-medium mb-2">WPForms</h3>
            <p className="text-sm text-gray-400">Compatible con formularios WPForms</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-medium mb-2">Gravity Forms</h3>
            <p className="text-sm text-gray-400">Soporte para Gravity Forms</p>
          </div>
        </div>
      </div>

      {/* Enlaces útiles */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Enlaces Útiles</h2>
        <div className="space-y-2">
          <a
            href="/usuarios/mensajes"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FaExternalLinkAlt className="text-sm" />
            <span>Ver mensajes recibidos</span>
          </a>
          <a
            href="https://docs.wordpress.org/plugins/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FaExternalLinkAlt className="text-sm" />
            <span>Documentación de plugins de WordPress</span>
          </a>
        </div>
      </div>
    </div>
  );
}