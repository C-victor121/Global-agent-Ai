import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import axios from 'axios';
import crypto from 'crypto';
import ContactMessage, { IContactMessage } from '../models/contactMessage.model';
import User, { IUser } from '../models/user.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Interfaz para el request del plugin de WordPress
interface WordPressContactRequest extends Request {
  body: {
    visitorName: string;
    visitorEmail: string;
    visitorPhone?: string;
    subject?: string;
    message: string;
    wordpressUrl: string;
    formId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

// Función para validar API Key
export const validateApiKey = async (apiKey: string): Promise<IUser | null> => {
  try {
    if (!apiKey) {
      return null;
    }

    const user = await User.findOne({ apiKey }).exec();
    return user;
  } catch (error) {
    console.error('Error validating API key:', error);
    return null;
  }
};

// Descargar el plugin de WordPress como ZIP
export const downloadWordPressPlugin = async (req: Request, res: Response) => {
  try {
    const pluginPath = path.join(__dirname, '..', '..', '..', 'client', 'public', 'wordpress-plugin', 'global-agent-ai-contact-integration', 'global-agent-ai-contact-integration', 'global-agent-ai-contact-integration.php');
    const readmePath = path.join(__dirname, '..', '..', '..', 'client', 'public', 'wordpress-plugin', 'global-agent-ai-contact-integration', 'global-agent-ai-contact-integration', 'readme.txt');

    if (!fs.existsSync(pluginPath)) {
      console.error('Plugin PHP file not found at:', pluginPath);
      return res.status(404).json({ 
        success: false, 
        error: 'Archivo del plugin no encontrado en el servidor.' 
      });
    }

    const output = fs.createWriteStream('global-agent-ai-contact-integration.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('Archiver has been finalized and the output file descriptor has closed.');
      res.download('global-agent-ai-contact-integration.zip', 'global-agent-ai-contact-integration.zip', (err: any) => {
        if (err) {
          console.error('Error sending zip file:', err);
        }
        // Clean up the zip file after sending
        fs.unlinkSync('global-agent-ai-contact-integration.zip');
      });
    });

    archive.on('error', (err: any) => {
      throw err;
    });

    archive.pipe(output);

    // Añadir el archivo PHP del plugin al ZIP
    archive.file(pluginPath, { name: 'global-agent-ai-contact-integration/global-agent-ai-contact-integration.php' });
    
    // Añadir el archivo readme.txt si existe
    if (fs.existsSync(readmePath)) {
      archive.file(readmePath, { name: 'global-agent-ai-contact-integration/readme.txt' });
    } else {
        // Crear un readme.txt básico si no existe
        const basicReadmeContent = `=== Global Agent AI Contact Integration ===\nContributors: Your Name\nTags: contact form, ai, global agent\nRequires at least: 5.0\nTested up to: 6.0\nStable tag: 1.0.0\nLicense: GPLv2 or later\nLicense URI: https://www.gnu.org/licenses/gpl-2.0.html\n\nIntegrate Global Agent AI with your WordPress contact forms.`;
        archive.append(basicReadmeContent, { name: 'global-agent-ai-contact-integration/readme.txt' });
    }

    await archive.finalize();

  } catch (error) {
    console.error('Error generating WordPress plugin ZIP:', error);
    // Asegurarse de que no se envíe una respuesta parcial si ya se envió una
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor al generar el ZIP del plugin.' 
      });
    }
  }
};

// Función para generar API Key
export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Endpoint principal para recibir mensajes de contacto desde WordPress
export const receiveContactMessage = async (req: WordPressContactRequest, res: Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({ 
        success: false, 
        error: 'API Key requerida en el header X-API-KEY' 
      });
    }

    // Validar API Key
    const user = await validateApiKey(apiKey);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'API Key inválida o expirada' 
      });
    }

    // Verificar límite de mensajes
    if (user.messageCount >= user.messageLimit) {
      return res.status(429).json({ 
        success: false, 
        error: 'Límite de mensajes alcanzado. Actualiza tu plan para continuar.' 
      });
    }

    // Validar datos requeridos
    const { visitorName, visitorEmail, message, wordpressUrl } = req.body;
    if (!visitorName || !visitorEmail || !message || !wordpressUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campos requeridos: visitorName, visitorEmail, message, wordpressUrl' 
      });
    }

    // Crear el mensaje en la base de datos
    const contactMessage = new ContactMessage({
      userId: user._id,
      visitorName,
      visitorEmail,
      visitorPhone: req.body.visitorPhone,
      subject: req.body.subject,
      message,
      wordpressUrl,
      formId: req.body.formId,
      ipAddress: req.body.ipAddress || req.ip,
      userAgent: req.body.userAgent || req.get('User-Agent'),
      responseStatus: 'pending'
    });

    await contactMessage.save();

    // Incrementar contador de mensajes del usuario
    await User.findByIdAndUpdate(user._id, { 
      $inc: { messageCount: 1 } 
    });

    // Enviar a n8n para procesamiento con IA
    try {
      await sendToN8nForProcessing(contactMessage, user);
    } catch (n8nError) {
      console.error('Error enviando a n8n:', n8nError);
      // No fallar la request si n8n falla, pero marcar como failed
      await ContactMessage.findByIdAndUpdate(contactMessage._id, {
        responseStatus: 'failed'
      });
    }

    return res.status(200).json({ 
      success: true, 
      messageId: contactMessage._id.toString(),
      remainingMessages: user.messageLimit - (user.messageCount + 1)
    });

  } catch (error) {
    console.error('Error processing contact message:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Función para enviar datos a n8n
const sendToN8nForProcessing = async (contactMessage: IContactMessage, user: IUser): Promise<void> => {
  const N8N_WEBHOOK_URL = process.env.N8N_CONTACT_RESPONSE_WEBHOOK_URL || 'http://n8n:5678/webhook/contact-response';
  
  const payload = {
    messageId: contactMessage._id.toString(),
    userId: user._id.toString(),
    userEmail: user.email,
    userName: user.name,
    wordpressUrl: user.wordpressUrl || contactMessage.wordpressUrl,
    visitor: {
      name: contactMessage.visitorName,
      email: contactMessage.visitorEmail,
      phone: contactMessage.visitorPhone
    },
    message: {
      subject: contactMessage.subject,
      content: contactMessage.message,
      formId: contactMessage.formId
    },
    metadata: {
      ipAddress: contactMessage.ipAddress,
      userAgent: contactMessage.userAgent,
      timestamp: contactMessage.createdAt
    }
  };

  await axios.post(N8N_WEBHOOK_URL, payload, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 segundos timeout
  });

  // Actualizar estado a 'generated' (n8n se encargará de actualizar a 'sent')
  await ContactMessage.findByIdAndUpdate(contactMessage._id, {
    responseStatus: 'generated'
  });
};

// Endpoint para que n8n notifique cuando la respuesta fue enviada
export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { messageId, status, aiResponse } = req.body;

    if (!messageId || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'messageId y status son requeridos' 
      });
    }

    const updateData: any = { responseStatus: status };
    if (aiResponse) {
      updateData.aiResponse = aiResponse;
    }

    await ContactMessage.findByIdAndUpdate(messageId, updateData);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Obtener historial de mensajes para el usuario autenticado
export const getContactMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await ContactMessage.countDocuments({ userId });
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Generar nueva API Key para el usuario
export const generateUserApiKey = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const newApiKey = generateApiKey();
    
    await User.findByIdAndUpdate(userId, { apiKey: newApiKey });

    return res.status(200).json({
      success: true,
      apiKey: newApiKey
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Obtener información de la API Key del usuario
export const getUserApiInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const user = await User.findById(userId).select('apiKey messageCount messageLimit wordpressUrl');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      success: true,
      data: {
        apiKey: user.apiKey,
        messageCount: user.messageCount,
        messageLimit: user.messageLimit,
        remainingMessages: user.messageLimit - user.messageCount,
        wordpressUrl: user.wordpressUrl
      }
    });
  } catch (error) {
    console.error('Error fetching user API info:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Actualizar URL de WordPress del usuario
export const updateWordPressUrl = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { wordpressUrl } = req.body;
    if (!wordpressUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL de WordPress es requerida' 
      });
    }

    await User.findByIdAndUpdate(userId, { wordpressUrl });

    return res.status(200).json({
      success: true,
      message: 'URL de WordPress actualizada correctamente'
    });
  } catch (error) {
    console.error('Error updating WordPress URL:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};