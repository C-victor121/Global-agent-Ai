'use client';

import { useState } from 'react';
import { FaUpload, FaSpinner, FaTrash } from 'react-icons/fa';

interface DocumentType {
  id: string;
  name: string;
  description: string;
}

interface Party {
  name: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
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
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  interface ValidationErrors {
    documentType?: string;
    description?: string;
    files?: string;
    [key: string]: string | undefined;
  }

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [includeParties, setIncludeParties] = useState(false);
  const [parties, setParties] = useState<Party[]>([{ name: '', documentType: '', documentNumber: '', address: '', phone: '' }]);

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
    // Limpiar errores previos
    setErrors({});
    setGeneralError('');
    
    // Validaciones del lado del cliente
    const newErrors: ValidationErrors = {};
    if (!selectedDocument) newErrors.documentType = 'Por favor selecciona un tipo de documento';
    if (!description) newErrors.description = 'Por favor ingresa una descripción';
    if (files.length === 0) newErrors.files = 'Por favor adjunta al menos un archivo';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('documentType', selectedDocument);
      formData.append('description', description);
      files.forEach(file => formData.append('files', file));
      
      if (includeParties) {
        formData.append('parties', JSON.stringify(parties));
      }

      const response = await fetch('/api/legal-assistant/generate', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          setErrors(data.details);
        } else {
          throw new Error(data.error || 'Error al procesar la solicitud');
        }
        return;
      }

      // Limpiar el formulario después de un envío exitoso
      setSelectedDocument('');
      setDescription('');
      setFiles([]);
      setIncludeParties(false);
      setParties([{ name: '', documentType: '', documentNumber: '', address: '', phone: '' }]);
      
      // Mostrar mensaje de éxito
      alert('Documento generado exitosamente');

    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : 'Error al procesar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const addParty = () => {
    setParties([...parties, { name: '', documentType: '', documentNumber: '', address: '', phone: '' }]);
  };

  const removeParty = (index: number) => {
    setParties(parties.filter((_, i) => i !== index));
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    const newParties = [...parties];
    newParties[index] = { ...newParties[index], [field]: value };
    setParties(newParties);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
          Asistente Legal IA
        </h2>
        <p className="text-gray-400 mt-2">
          Selecciona el tipo de documento que necesitas y proporciona la información requerida.
        </p>
      </div>

      {generalError && (
        <div className="p-4 mb-4 text-sm text-red-400 bg-red-900/50 rounded-lg" role="alert">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-300">
            Tipo de Documento
          </label>
          <select
            id="documentType"
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.documentType ? 'border-red-500' : 'border-gray-300'} bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          >
            <option value="">Selecciona un tipo de documento</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.documentType && (
            <p className="mt-1 text-sm text-red-400">{errors.documentType}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Descripción del Caso
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            placeholder="Describe los detalles específicos de tu caso..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeParties"
            checked={includeParties}
            onChange={(e) => setIncludeParties(e.target.checked)}
            className="rounded border-gray-300 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="includeParties" className="text-sm font-medium text-gray-300">
            Incluir datos de las partes
          </label>
        </div>

        {includeParties && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-200">Datos de las Partes</h3>
              <button
                type="button"
                onClick={addParty}
                className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Agregar Parte
              </button>
            </div>
            {parties.map((party, index) => (
              <div key={index} className="space-y-4 p-4 border border-gray-600 rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-300">Parte {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeParty(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Nombre</label>
                    <input
                      type="text"
                      value={party.name}
                      onChange={(e) => updateParty(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Tipo de Documento</label>
                    <select
                      value={party.documentType}
                      onChange={(e) => updateParty(index, 'documentType', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Seleccione tipo de documento</option>
                      <option value="cc">Cédula de Ciudadanía</option>
                      <option value="ti">Tarjeta de Identidad</option>
                      <option value="ce">Cédula de Extranjería</option>
                      <option value="passport">Pasaporte</option>
                      <option value="nit">NIT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Número de Documento</label>
                    <input
                      type="text"
                      value={party.documentNumber}
                      onChange={(e) => updateParty(index, 'documentNumber', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Dirección</label>
                    <input
                      type="text"
                      value={party.address}
                      onChange={(e) => updateParty(index, 'address', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Teléfono</label>
                    <input
                      type="tel"
                      value={party.phone}
                      onChange={(e) => updateParty(index, 'phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Archivos de Contexto (opcional)
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.files ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md hover:border-blue-500 transition-colors`}>
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-600">
                    <span>Subir archivos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1 text-gray-400">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-400">PDF, DOC, DOCX hasta 10MB</p>
            </div>
          </div>
          {errors.files && (
            <p className="mt-1 text-sm text-red-400">{errors.files}</p>
          )}
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300">Archivos seleccionados:</h4>
              <ul className="mt-2 divide-y divide-gray-600">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span className="text-sm text-gray-400">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Generar Documento</span>
            )}
          </button>
        </div>


      </form>
    </div>
  );
}
