'use client';

import { useState } from 'react';
import { FaUpload, FaSpinner, FaTrash } from 'react-icons/fa';

interface DocumentType {
  id: string;
  name: string;
  description: string;
}

const documentTypes: DocumentType[] = [
  {
    id: 'tutela',
    name: 'Acción de Tutela',
    description: 'Mecanismo de protección de derechos fundamentales'
  },
  {
    id: 'derecho-peticion',
    name: 'Derecho de Petición',
    description: 'Solicitud formal ante entidades públicas o privadas'
  },
  {
    id: 'contrato-arrendamiento',
    name: 'Contrato de Arrendamiento',
    description: 'Acuerdo legal para el alquiler de inmuebles'
  },
  {
    id: 'poder-especial',
    name: 'Poder Especial',
    description: 'Autorización legal para actuar en nombre de otra persona'
  }
];

export default function AsistenteLegal() {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocument) {
      setError('Por favor selecciona un tipo de documento');
      return;
    }
    if (files.length === 0) {
      setError('Por favor adjunta al menos un archivo');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('documentType', selectedDocument);
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/legal-assistant/generate', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      // Procesar respuesta
      const data = await response.json();
      console.log(data);

    } catch (err) {
      setError('Error al procesar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
          Asistente Legal IA
        </h2>
        <p className="text-gray-400 mt-2">
          Selecciona el tipo de documento que necesitas y adjunta los archivos relevantes para contexto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de tipo de documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypes.map((docType) => (
            <div
              key={docType.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedDocument === docType.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'
              }`}
              onClick={() => setSelectedDocument(docType.id)}
            >
              <h3 className="font-semibold text-white">{docType.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{docType.description}</p>
            </div>
          ))}
        </div>

        {/* Carga de archivos */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              className="w-full flex flex-col items-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-colors border-white/10 hover:border-purple-500/50"
            >
              <FaUpload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-base text-gray-400">Arrastra archivos aquí o haz clic para seleccionar</span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </label>
          </div>

          {/* Lista de archivos */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
              Procesando...
            </span>
          ) : (
            'Generar Documento'
          )}
        </button>
      </form>
    </div>
  );
}