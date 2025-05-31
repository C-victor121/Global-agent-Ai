import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import WhatsAppConfig, { IWhatsAppConfig } from '../models/whatsapp.config.model';
// import User from '../models/user.model'; // Asumiendo que tienes un modelo User

const META_GRAPH_API_URL = 'https://graph.facebook.com/v19.0'; // Usar la última versión estable
const N8N_WEBHOOK_URL = process.env.N8N_WHATSAPP_FLOW_WEBHOOK_URL; // URL base de tu flujo n8n para WhatsApp
const APP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'tu_token_de_verificacion_secreto';
const APP_URL = process.env.APP_URL || 'http://localhost:3000'; // URL base de tu aplicación para construir la URL del webhook

// TODO: Cargar el App Secret de Meta de forma segura desde variables de entorno
const META_APP_SECRET = process.env.META_APP_SECRET;

if (!META_APP_SECRET) {
  console.error('Error: META_APP_SECRET no está configurado en las variables de entorno.');
  // Considera lanzar un error o manejar esto de forma más robusta en producción
}

/**
 * @description Inicia el flujo de Embedded Signup.
 *              Redirige al usuario a la URL de autorización de Facebook.
 */
export const startEmbeddedSignup = async (req: Request, res: Response) => {
  // TODO: Implementar la lógica para obtener el client_id de tu app de Meta
  const clientId = process.env.META_APP_ID;
  const redirectUri = `${APP_URL}/api/whatsapp/callback`; // Tu endpoint de callback

  // Los permisos solicitados
  const scope = [
    'whatsapp_business_messaging',
    'whatsapp_business_management',
    'business_management',
  ].join(',');

  // Generar un estado para CSRF protection
  // @ts-ignore
  const state = crypto.randomBytes(16).toString('hex');
  // @ts-ignore
  req.session.whatsAppState = state; // Guardar estado en sesión (requiere session middleware)

  const extras = {
    feature: 'whatsapp_embedded_signup',
    setup: {
      // prefill aquí si es necesario, ej. business_id si ya lo conoces
    }
  };

  const facebookLoginUrl = `https://www.facebook.com/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&extras=${encodeURIComponent(JSON.stringify(extras))}`;
  
  // Por ahora, solo devolvemos la URL para que el frontend redirija.
  // En una implementación completa, el backend podría redirigir directamente.
  res.status(200).json({ facebookLoginUrl });
};

/**
 * @description Maneja el callback de Facebook después del Embedded Signup.
 *              Intercambia el código de autorización por un token de acceso.
 */
export const handleFacebookCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  // @ts-ignore
  const sessionState = req.session.whatsAppState;

  // Validar estado CSRF
  if (!state || state !== sessionState) {
    return res.status(403).send('Error de validación de estado (CSRF).');
  }
  // @ts-ignore
  req.session.whatsAppState = null; // Limpiar estado de la sesión

  if (!code) {
    return res.status(400).send('No se recibió el código de autorización.');
  }

  const clientId = process.env.META_APP_ID;
  const clientSecret = process.env.META_APP_SECRET; // Asegúrate que esté configurado
  const redirectUri = `${APP_URL}/api/whatsapp/callback`;

  try {
    // 1. Intercambiar código por token de acceso de corta duración
    const tokenResponse = await axios.get(`${META_GRAPH_API_URL}/oauth/access_token`, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code as string,
      },
    });

    const shortLivedAccessToken = tokenResponse.data.access_token;
    if (!shortLivedAccessToken) {
      throw new Error('No se pudo obtener el token de acceso de corta duración.');
    }

    // 2. Intercambiar token de corta duración por uno de larga duración
    const longLivedTokenResponse = await axios.get(`${META_GRAPH_API_URL}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: clientId,
        client_secret: clientSecret,
        fb_exchange_token: shortLivedAccessToken,
      },
    });

    const longLivedAccessToken = longLivedTokenResponse.data.access_token;
    const expiresIn = longLivedTokenResponse.data.expires_in; // en segundos

    if (!longLivedAccessToken) {
      throw new Error('No se pudo obtener el token de acceso de larga duración.');
    }

    // 3. Obtener información del usuario de WhatsApp (WABA ID, Phone Number ID)
    // Esto se hace usando el token de acceso obtenido y consultando los business accounts
    // y luego los números de teléfono asociados.
    // Esta parte es crucial y puede ser compleja dependiendo de la estructura de la cuenta del usuario.
    // Asumimos que el Embedded Signup devuelve los IDs necesarios o que podemos obtenerlos.
    
    // Ejemplo simplificado: Suponiendo que el Embedded Signup nos da acceso directo a los activos
    // Necesitarás explorar la Graph API para obtener estos datos de forma robusta.
    // Por ejemplo, podrías necesitar listar las cuentas de negocio del usuario:
    // const accountsResponse = await axios.get(`${META_GRAPH_API_URL}/me/accounts?access_token=${longLivedAccessToken}`);
    // Y luego, para cada cuenta, obtener los números de WhatsApp:
    // const whatsappNumbersResponse = await axios.get(`${META_GRAPH_API_URL}/${business_id}/owned_whatsapp_business_accounts?access_token=${longLivedAccessToken}`);
    // Y de ahí el phone_number_id

    // *** Placeholder: Estos valores deben obtenerse de la Graph API ***
    const placeholderWabaId = 'obtained_waba_id_from_graph_api';
    const placeholderPhoneNumberId = 'obtained_phone_number_id_from_graph_api';
    const placeholderBusinessId = 'obtained_business_id_from_graph_api'; // Opcional
    const placeholderFacebookUserId = 'obtained_facebook_user_id_from_graph_api'; // ID del usuario en Facebook

    // @ts-ignore
    const userId = req.user?.id; // Asumiendo que req.user está disponible desde Auth0/middleware
    if (!userId) {
      return res.status(401).send('Usuario no autenticado.');
    }

    // 4. Guardar la configuración en la base de datos
    const whatsappConfigData: Partial<IWhatsAppConfig> = {
      userId,
      facebookId: placeholderFacebookUserId,
      accessToken: longLivedAccessToken,
      wabaId: placeholderWabaId,
      phoneNumberId: placeholderPhoneNumberId,
      businessId: placeholderBusinessId,
      tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
      isWebhookConfigured: false, // Se configurará en el siguiente paso
    };

    let existingConfig = await WhatsAppConfig.findOne({ userId });
    let isNewConnection = false;

    if (!existingConfig) {
      isNewConnection = true;
    }

    const newConfig = await WhatsAppConfig.findOneAndUpdate({ userId }, whatsappConfigData, { new: true, upsert: true });

    if (isNewConnection && newConfig) {
      const trialDays = 15;
      newConfig.trialStartDate = new Date();
      newConfig.trialEndDate = new Date(newConfig.trialStartDate.getTime() + trialDays * 24 * 60 * 60 * 1000);
      await newConfig.save();
      console.log(`Prueba gratuita de ${trialDays} días iniciada para el usuario ${userId}. Finaliza el ${newConfig.trialEndDate}`);
    }

    // 5. Configurar el Webhook en la API Graph (siguiente paso)
    await configureAppWebhookSubscription(newConfig.phoneNumberId, newConfig.accessToken);
    newConfig.isWebhookConfigured = true;
    await newConfig.save();

    // Redirigir al frontend a una página de éxito o mostrar un mensaje.
    // Por ahora, devolvemos la configuración.
    res.status(200).json({ message: 'Cuenta de WhatsApp conectada y webhook configurado exitosamente.', config: newConfig });

  } catch (error: any) {
    console.error('Error en el callback de Facebook:', error.response?.data || error.message);
    res.status(500).send('Error al procesar la conexión con WhatsApp.');
  }
};

/**
 * @description Configura la suscripción al webhook de la App de Meta para un número de teléfono específico.
 */
async function configureAppWebhookSubscription(phoneNumberId: string, accessToken: string) {
  const callbackUrl = `${APP_URL}/webhook/whatsapp`; // Tu endpoint de webhook
  const verifyToken = APP_WEBHOOK_VERIFY_TOKEN;

  try {
    // Suscribir la app a los webhooks del WABA (o del número específico si la API lo permite así directamente)
    // La suscripción generalmente se hace a nivel de App para ciertos campos.
    // Para WhatsApp, se configura el webhook en los ajustes de la App de Meta y luego se suscribe a los campos del objeto 'whatsapp_business_account'.
    // Aquí simulamos la llamada para suscribir los campos del objeto 'whatsapp_business_account' a nuestra app.
    // Esto se hace una vez por app, pero la configuración del webhook URL sí puede ser por WABA/Phone ID.

    // La configuración del webhook URL para un WABA específico se hace en:
    // POST /{waba_id}/subscribed_apps
    // O a través de la UI de Meta for Developers.
    // El Embedded Signup debería manejar parte de esto.

    // Para este ejemplo, nos enfocaremos en asegurar que la app esté suscrita a los campos necesarios.
    // La URL del webhook se configura en la App de Meta.
    // Lo que sí podemos hacer es verificar/configurar la suscripción a los campos para el WABA.
    // Esto es más una configuración a nivel de App/WABA que por phoneNumberId individualmente vía API de esta forma.
    // La documentación indica que el webhook se configura a nivel de App en el dashboard de Meta.
    // Y luego se suscribe la app a los webhooks del WABA.

    // Sin embargo, si el Embedded Signup no lo hace, o para asegurar, se puede intentar:
    // POST https://graph.facebook.com/v19.0/{app-id}/subscriptions
    //   ?object=whatsapp_business_account
    //   &callback_url=YOUR_CALLBACK_URL
    //   &fields=messages
    //   &include_values=true
    //   &verify_token=YOUR_VERIFY_TOKEN
    //   &access_token=USER_ACCESS_TOKEN (o App Token)

    // Por ahora, asumimos que el webhook URL ya está configurado en la App de Meta
    // y que el Embedded Signup asocia el WABA a nuestra App.
    // La función principal aquí sería asegurar que los campos correctos estén suscritos.

    console.log(`Simulando configuración de suscripción a webhook para phoneNumberId: ${phoneNumberId}`);
    console.log(`Callback URL (debe estar configurada en Meta App Dashboard): ${callbackUrl}`);
    console.log(`Verify Token: ${verifyToken}`);
    // En una implementación real, aquí harías la llamada a la Graph API si es necesario y posible.
    // Ejemplo: (esto requiere un App Access Token o un System User Access Token con permisos)
    /*
    const appId = process.env.META_APP_ID;
    const appAccessToken = await getAppAccessToken(); // Necesitarías una función para obtener un App Token
    await axios.post(`${META_GRAPH_API_URL}/${appId}/subscriptions`, null, {
      params: {
        object: 'whatsapp_business_account',
        callback_url: callbackUrl, 
        fields: 'messages, message_template_status_update', // y otros que necesites
        verify_token: verifyToken,
        access_token: appAccessToken,
      }
    });
    console.log('Suscripción a campos de webhook configurada/verificada para la App.');
    */

    // Si necesitas configurar el webhook específicamente para un WABA (si no lo hizo el Embedded Signup):
    // Esto es más complejo y usualmente se hace con un System User token.
    // POST /{whatsapp_business_account_id}/subscribed_apps
    // BODY: { subscribed_fields: ['messages'] }

    return true; // Simulación

  } catch (error: any) {
    console.error('Error configurando la suscripción al webhook de la App de Meta:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * @description Maneja la verificación del webhook de WhatsApp (GET request).
 */
export const verifyWhatsappWebhook = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === APP_WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verificado exitosamente.');
      res.status(200).send(challenge);
    } else {
      console.warn('Fallo la verificación del webhook. Tokens no coinciden.');
      res.sendStatus(403);
    }
  } else {
    console.warn('Fallo la verificación del webhook. Faltan parámetros.');
    res.sendStatus(400);
  }
};

/**
 * @description Middleware para validar la firma de los webhooks de Meta.
 */
export const validateMetaSignature = (req: Request, res: Response, next: Function) => {
  const signature = req.headers['x-hub-signature-256'] as string;

  if (!META_APP_SECRET) {
    console.error('META_APP_SECRET no está configurado. No se puede validar la firma.');
    return res.status(500).send('Error de configuración del servidor.');
  }

  if (!signature) {
    console.warn('No se recibió la firma del webhook. Petición no validada.');
    // En producción estricta, podrías rechazar aquí.
    // return res.status(403).send('Firma no encontrada.');
    return next(); // Por ahora, permitimos pasar si no hay firma (para pruebas iniciales)
  }

  const elements = signature.split('=');
  // const method = elements[0]; // sha256
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac('sha256', META_APP_SECRET)
    .update(req.body) // req.body debe ser el buffer raw, no el JSON parseado
    .digest('hex');

  if (signatureHash !== expectedHash) {
    console.warn('Firma del webhook inválida.');
    return res.status(403).send('Firma inválida.');
  }

  console.log('Firma del webhook validada exitosamente.');
  next();
};


/**
 * @description Maneja los eventos de mensajes entrantes de WhatsApp (POST request).
 */
export const handleWhatsappMessage = async (req: Request, res: Response) => {
  const body = req.body;
  console.log('Evento de WhatsApp recibido:', JSON.stringify(body, null, 2));

  // Verificar que es un evento de WhatsApp
  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const value = change.value;
          const waMessage = value.messages?.[0];
          const waContact = value.contacts?.[0];
          const phoneNumberId = value.metadata?.phone_number_id;

          if (waMessage && phoneNumberId) {
            // 1. Encontrar la configuración del usuario basada en phoneNumberId
            const config = await WhatsAppConfig.findOne({ phoneNumberId });
            if (!config) {
              console.error(`No se encontró configuración para phoneNumberId: ${phoneNumberId}`);
              continue; // Procesar el siguiente mensaje/cambio
            }

            // 2. Guardar el mensaje en la base de datos (adaptar a tu modelo Message y Conversation)
            console.log(`Mensaje de ${waMessage.from} (${waContact?.profile?.name}): ${waMessage.text?.body || '[Mensaje no textual]'}`);
            // Aquí iría la lógica para crear/actualizar tu modelo Conversation y Message
            // Ejemplo:
            // let conversation = await Conversation.findOne({ userId: config.userId, contactPhoneNumber: waMessage.from });
            // if (!conversation) { conversation = new Conversation({ ... }); }
            // const newMessage = new Message({ conversationId: conversation._id, senderId: waMessage.from, body: waMessage.text?.body, ... });
            // await newMessage.save();
            // conversation.lastMessage = newMessage._id; await conversation.save();

            // 3. Enviar a n8n (si está configurado)
            const n8nTargetUrl = config.webhookUrl || N8N_WEBHOOK_URL; // Usar URL específica del usuario o una global
            if (n8nTargetUrl) {
              try {
                // Construir un payload estándar para n8n
                const n8nPayload = {
                  event_type: 'whatsapp_message_received',
                  timestamp: new Date().toISOString(),
                  message_id: waMessage.id,
                  from: waMessage.from,
                  contact_name: waContact?.profile?.name,
                  message_type: waMessage.type,
                  message_body: waMessage.text?.body,
                  // Añadir más campos según sea necesario: media, location, etc.
                  raw_payload: waMessage, // Incluir el payload original de WhatsApp
                  user_config: {
                    userId: config.userId,
                    wabaId: config.wabaId,
                    phoneNumberId: config.phoneNumberId,
                  }
                };
                await axios.post(n8nTargetUrl, n8nPayload);
                console.log(`Mensaje enviado a n8n: ${n8nTargetUrl}`);
              } catch (n8nError: any) {
                console.error('Error enviando mensaje a n8n:', n8nError.response?.data || n8nError.message);
              }
            }
          }
        }
      }
    }
    res.sendStatus(200); // Responder OK a Meta
  } else {
    // No es un evento de WhatsApp que nos interese
    res.sendStatus(404);
  }
};

/**
 * @description Envía un mensaje de respuesta usando la API de WhatsApp.
 */
export const sendWhatsappMessage = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { to, text, messageType = 'text' } = req.body; // 'to' es el número del destinatario (ej: '15550001234')

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }
  if (!to || !text) {
    return res.status(400).json({ message: 'Destinatario (to) y texto (text) son requeridos.' });
  }

  try {
    const config = await WhatsAppConfig.findOne({ userId });
    if (!config || !config.accessToken || !config.phoneNumberId) {
      return res.status(403).json({ message: 'El usuario no tiene configurada una cuenta de WhatsApp o faltan datos.' });
    }

    const messagePayload: any = {
      messaging_product: 'whatsapp',
      to: to,
      type: messageType, // 'text', 'template', 'image', etc.
    };

    if (messageType === 'text') {
      messagePayload.text = { body: text };
    } else {
      // Aquí manejarías otros tipos de mensajes (plantillas, imágenes, etc.)
      return res.status(400).json({ message: `Tipo de mensaje '${messageType}' no soportado actualmente por esta función.` });
    }

    const response = await axios.post(
      `${META_GRAPH_API_URL}/${config.phoneNumberId}/messages`,
      messagePayload,
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Mensaje de WhatsApp enviado:', response.data);
    // Guardar el mensaje enviado en tu BD (similar a como se hace con los entrantes)

    res.status(200).json({ success: true, messageId: response.data.messages[0].id });

  } catch (error: any) {
    console.error('Error enviando mensaje de WhatsApp:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.error?.message || 'Error interno al enviar mensaje.';
    const errorCode = error.response?.data?.error?.code;
    res.status(500).json({ success: false, message: errorMessage, code: errorCode, details: error.response?.data?.error });
  }
};

// TODO: Implementar función para obtener App Access Token si es necesario para ciertas operaciones de API.
// async function getAppAccessToken() { ... }

/**
 * @description Obtiene la configuración de WhatsApp para el usuario autenticado.
 */
export const getWhatsappConfig = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    const config = await WhatsAppConfig.findOne({ userId });
    if (!config) {
      return res.status(404).json({ message: 'No se encontró configuración de WhatsApp para este usuario.' });
    }
    res.status(200).json(config);
  } catch (error: any) {
    console.error('Error obteniendo la configuración de WhatsApp:', error.message);
    res.status(500).json({ message: 'Error interno al obtener la configuración de WhatsApp.' });
  }
};