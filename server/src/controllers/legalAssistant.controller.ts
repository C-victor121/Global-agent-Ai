import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const generateLegalDocument = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const N8N_WEBHOOK_URL = process.env.N8N_LEGAL_ASSISTANT_WEBHOOK_URL;
  console.log('generateLegalDocument - req.user:', req.user);
  
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_LEGAL_ASSISTANT_WEBHOOK_URL no está configurada en las variables de entorno.');
      return res.status(500).json({ message: 'Error de configuración del servidor.' });
    }

    // Obtener el tipo de documento y los archivos del FormData
    const files = req.files as Express.Multer.File[];
    const documentType = req.body.documentType;

    if (!documentType) {
      return res.status(400).json({ message: 'El tipo de documento es requerido.' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos un archivo de contexto.' });
    }

    // Preparar los archivos para enviar a N8N
    const filesData = files.map(file => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      content: file.buffer.toString('base64')
    }));

    // Enviar datos a N8N
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        userEmail: req.user?.email,
        documentType,
        files: filesData
      })
    });

    if (!response.ok) {
      throw new Error('Error al procesar la solicitud en N8N');
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Documento en proceso de generación',
      data
    });

  } catch (error) {
    console.error('Error en generateLegalDocument:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};