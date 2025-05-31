import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { Message, IMessage } from '../models/message.model';
import { Conversation, IConversation } from '../models/conversation.model';
import User, { IUser } from '../models/user.model';

// Asegúrate de que las variables de entorno estén configuradas
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Tu número de Twilio principal o uno específico

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('Twilio environment variables are not set!');
  // Considera lanzar un error o manejar esto de forma más robusta
}

// const client = new Twilio(accountSid, authToken);

export const handleWebhook = async (req: Request, res: Response) => {
  const { From, To, Body, MessageSid, NumMedia, MediaUrl0, MediaContentType0 } = req.body;

  console.log('Webhook received:', req.body);

  // Validar que el webhook provenga de Twilio (opcional pero recomendado)
  // const twilioSignature = req.headers['x-twilio-signature'] as string;
  // const params = req.body;
  // const url = `https://YOUR_DOMAIN.com/api/twilio/webhook`; // Reemplaza con tu URL
  // if (!client.validateRequest(twilioSignature, url, params)) {
  //   return res.status(403).send('Forbidden: Invalid Twilio Signature');
  // }

  try {
    // 1. Identificar al usuario de la plataforma basado en el número de Twilio receptor (To)
    // Esta lógica puede variar. Aquí asumimos que cada usuario tiene un número de Twilio asignado
    // o que hay una forma de mapear `To` (tu número de Twilio) a un `userId`.
    // Por simplicidad, buscaremos un usuario que tenga este `platformPhoneNumber`.
    // En un escenario real, podrías tener una tabla de mapeo o una lógica más compleja.
    let user: IUser | null = await User.findOne({ twilioPhoneNumber: To });

    if (!user) {
      // Si no se encuentra un usuario para este número de Twilio, ¿cómo proceder?
      // Podrías asignar a un usuario por defecto, crear un ticket, o rechazar.
      // Por ahora, vamos a asumir que esto es un error de configuración o un número no asignado.
      console.error(`No user found for Twilio number: ${To}`);
      // Intentaremos encontrar un usuario administrador como fallback o crear una conversación "sin asignar"
      // Esto es una simplificación y debería manejarse según la lógica de negocio.
      user = await User.findOne({ role: 'admin' }); // Intenta encontrar un admin
      if (!user) {
        console.error('No admin user found as fallback for Twilio webhook.');
        return res.status(404).send('User configuration error for Twilio number.');
      }
      console.warn(`Webhook for ${To} assigned to admin user ${user._id} as fallback.`);
    }

    // 2. Buscar o crear una conversación
    let conversation: IConversation | null = await Conversation.findOne({
      userId: user._id,
      contactPhoneNumber: From, // El número del remitente externo
      platformPhoneNumber: To,   // Tu número de Twilio que recibió el mensaje
    });

    if (!conversation) {
      conversation = new Conversation({
        userId: user._id,
        contactPhoneNumber: From,
        platformPhoneNumber: To,
        status: 'open',
        unreadCount: 0, // Se incrementará al guardar el mensaje
      });
    }

    // 3. Crear y guardar el nuevo mensaje
    const newMessageData: Partial<IMessage> = {
      conversationId: conversation._id,
      senderId: `twilio:${From}`, // Identificador del remitente (externo)
      receiverId: `user:${user._id}`, // Identificador del receptor (usuario de la plataforma)
      twilioMessageSid: MessageSid,
      body: Body,
      timestamp: new Date(),
      status: 'received', // Mensaje entrante
    };

    if (NumMedia && parseInt(NumMedia) > 0 && MediaUrl0) {
      newMessageData.mediaUrl = MediaUrl0;
      newMessageData.mediaContentType = MediaContentType0;
    }

    const newMessage = new Message(newMessageData);
    await newMessage.save();

    // 4. Actualizar la conversación
    conversation.lastMessage = newMessage._id;
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    conversation.status = 'open'; // Asegurarse de que esté abierta
    await conversation.save();

    console.log(`Message from ${From} to ${To} saved for user ${user._id}, conversation ${conversation._id}`);

    // Responder a Twilio con TwiML vacío para acusar recibo
    // o puedes enviar una respuesta automática si lo deseas.
    // const twiml = new Twilio.twiml.MessagingResponse();
    // res.type('text/xml').send(twiml.toString());
    res.status(204).send(); // No Content - Acuse de recibo simple

  } catch (error) {
    console.error('Error handling Twilio webhook:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Podrías añadir aquí funciones para enviar mensajes salientes si es necesario

export const sendMessage = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { conversationId, body } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  if (!conversationId || !body) {
    return res.status(400).json({ message: 'Faltan conversationId o body en la solicitud.' });
  }

  try {
    const conversation = await Conversation.findOne({ _id: conversationId, userId });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada o no pertenece al usuario.' });
    }

    // Lógica para enviar el mensaje a través de Twilio (si es necesario)
    // const client = new Twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: body,
    //   from: conversation.platformPhoneNumber, // El número de Twilio del usuario
    //   to: conversation.contactPhoneNumber,   // El número del contacto
    // });

    // Crear y guardar el mensaje en la base de datos
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: `user:${userId}`, // El usuario de la plataforma es el remitente
      receiverId: `twilio:${conversation.contactPhoneNumber}`, // El contacto externo es el destinatario
      body: body,
      timestamp: new Date(),
      status: 'sent', // Estado inicial del mensaje enviado
      // twilioMessageSid: twilioMsg.sid, // Si se envía por Twilio, guardar el SID
    });

    await newMessage.save();

    // Actualizar la conversación con el último mensaje
    conversation.lastMessage = newMessage._id;
    // conversation.unreadCount = 0; // Opcional: resetear si la conversación se considera activa
    await conversation.save();

    res.status(201).json(newMessage);

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje.' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  // @ts-ignore // TODO: Definir el tipo para req.user o asegurar que exista
  const userId = req.user?.id; // Asumiendo que el ID del usuario está en req.user.id (p.ej. desde un middleware de autenticación)

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    const conversations = await Conversation.find({ userId })
      .populate('lastMessage') // Popula el último mensaje para mostrar un preview
      .sort({ updatedAt: -1 }); // Ordena por la más reciente

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error al obtener las conversaciones.' });
  }
};

export const getMessagesByConversation = async (req: Request, res: Response) => {
  // @ts-ignore // TODO: Definir el tipo para req.user o asegurar que exista
  const userId = req.user?.id;
  const { conversationId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  if (!conversationId) {
    return res.status(400).json({ message: 'ID de conversación no proporcionado.' });
  }

  try {
    // Verificar que la conversación pertenece al usuario (opcional pero recomendado)
    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada o no pertenece al usuario.' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 }); // Ordena por los más antiguos primero

    // Opcional: Marcar mensajes como leídos aquí si es necesario
    // await Message.updateMany({ conversationId, receiverId: `user:${userId}`, status: 'received' }, { $set: { status: 'read' } });
    // conversation.unreadCount = 0;
    // await conversation.save();

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error al obtener los mensajes.' });
  }
};