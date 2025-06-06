import { Request, Response } from 'express';
import axios from 'axios';
import ContentGeneration, { IContentGeneration } from '../models/contentGeneration.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware'; // Asumiendo que tienes un middleware de autenticación

// Asegúrate de tener una variable de entorno para la URL del webhook de n8n

export const generateContent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const N8N_WEBHOOK_URL = process.env.N8N_CONTENT_GENERATION_WEBHOOK_URL;
  console.log('N8N_CONTENT_GENERATION_WEBHOOK_URL from env:', N8N_WEBHOOK_URL);
  console.log('generateContent - req.user:', req.user);
  const { intencion, tono, objetivo, producto_servicio, audiencia, palabras_clave, longitud, formato } = req.body;
  const userId = req.user?.id;
  // console.log('getContentGenerationHistory - userId:', userId); // Comentado para reducir ruido en logs, ya se loguea en la otra función
  console.log('generateContent - userId:', userId);

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_CONTENT_GENERATION_WEBHOOK_URL no está configurada en las variables de entorno.');
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  // Validación básica (puedes expandirla con una librería como Joi o Zod)
  if (!intencion || !tono || !objetivo || !producto_servicio || !audiencia || !palabras_clave || !longitud || !formato) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  const newGenerationData = {
    userId,
    intencion,
    tono,
    objetivo,
    producto_servicio,
    audiencia,
    palabras_clave,
    longitud,
    formato,
  };

  try {
    // 1. Guardar la solicitud inicial en la base de datos (sin el texto generado aún)
    const initialGeneration = new ContentGeneration(newGenerationData);
    await initialGeneration.save();

    // 2. Enviar datos al webhook de n8n
    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, {
      intencion,
      tono,
      objetivo,
      producto_servicio,
      audiencia,
      palabras_clave,
      longitud,
      formato,
      // Puedes añadir el ID de la generación para que n8n lo devuelva y facilitar la actualización
      generationId: initialGeneration._id 
    });

    // Asumiendo que n8n responde con un JSON que contiene el texto generado, por ejemplo: { generatedText: "..." }
    const generatedText = n8nResponse.data.generatedText;

    if (!generatedText) {
        // Si n8n no devuelve el texto, guardamos la respuesta de n8n para debug y notificamos
        initialGeneration.n8nWebhookResponse = n8nResponse.data;
        await initialGeneration.save();
        console.error('n8n no devolvió el texto generado. Respuesta de n8n:', n8nResponse.data);
        return res.status(500).json({ message: 'Error al generar contenido: n8n no devolvió el texto.' });
    }

    // 3. Actualizar el registro en la base de datos con el texto generado y la respuesta de n8n
    initialGeneration.generatedText = generatedText;
    initialGeneration.n8nWebhookResponse = n8nResponse.data; // Guardar la respuesta completa para referencia
    const updatedGeneration = await initialGeneration.save();

    return res.status(200).json({ 
        message: 'Contenido generado exitosamente.', 
        data: updatedGeneration 
    });

  } catch (error: any) {
    console.error('Error en la generación de contenido:', error);
    // Si el error es de Axios (n8n no disponible, etc.)
    if (axios.isAxiosError(error)) {
        // Podrías intentar guardar el error de n8n en la BD si tienes un campo para ello
        return res.status(error.response?.status || 500).json({ 
            message: 'Error al comunicarse con el servicio de generación de contenido.', 
            error: error.response?.data || error.message 
        });
    }
    return res.status(500).json({ message: 'Error interno del servidor al generar contenido.', error: error.message });
  }
};

// Nueva función para guardar contenido generado aceptado desde el frontend
export const saveGeneratedContent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { intencion, tono, objetivo, producto_servicio, audiencia, palabras_clave, longitud, formato, generatedText, descripcion_producto } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  // Validación básica
  if (!intencion || !generatedText) { // intencion y generatedText son mínimos
    return res.status(400).json({ message: 'Faltan campos requeridos para guardar (intención, texto generado).' });
  }

  const newContentData: Partial<IContentGeneration> = {
    userId,
    intencion,
    tono,
    objetivo,
    producto_servicio,
    audiencia,
    palabras_clave,
    longitud,
    formato,
    generatedText,
     // Añadido para la descripción del producto
    // n8nWebhookResponse podría ser opcional aquí o se podría enviar desde el frontend si se tiene
  };

  try {
    const savedContent = new ContentGeneration(newContentData);
    await savedContent.save();
    return res.status(201).json({ message: 'Contenido guardado exitosamente.', data: savedContent });
  } catch (error: any) {
    console.error('Error al guardar el contenido generado:', error);
    return res.status(500).json({ message: 'Error interno del servidor al guardar el contenido.', error: error.message });
  }
};

export const getContentGenerationHistory = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  console.log('getContentGenerationHistory - req.user:', req.user);
  const userId = req.user?.id;
  console.log('getContentGenerationHistory - userId:', userId);

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    const history = await ContentGeneration.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (error: any) {
    console.error('Error al obtener el historial de generación de contenido:', error);
    return res.status(500).json({ message: 'Error al obtener el historial.', error: error.message });
  }
};

export const deleteContentGeneration = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    const result = await ContentGeneration.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({ message: 'Elemento del historial no encontrado o no pertenece al usuario.' });
    }
    return res.status(200).json({ message: 'Elemento del historial eliminado exitosamente.' });
  } catch (error: any) {
    console.error('Error al eliminar elemento del historial:', error);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar el elemento.', error: error.message });
  }
};

export const deleteAllContentGenerations = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    await ContentGeneration.deleteMany({ userId });
    return res.status(200).json({ message: 'Todo el historial de generación de contenido ha sido eliminado.' });
  } catch (error: any) {
    console.error('Error al eliminar todo el historial:', error);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar el historial.', error: error.message });
  }
};