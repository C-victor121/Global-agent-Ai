'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Tipos actualizados para coincidir con el backend
interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string; // Podría ser 'user' o el ID del agente/sistema
  receiverId?: string;
  body: string;
  timestamp: string; // Mantener como string para la API, convertir en el frontend si es necesario
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  twilioMessageSid?: string;
  mediaUrl?: string;
  mediaContentType?: string;
  // Para la UI, determinaremos si el mensaje es del usuario actual o del contacto
  senderType: 'user' | 'contact'; 
}

interface IConversation {
  _id: string;
  userId: string;
  contactPhoneNumber: string;
  platformPhoneNumber: string;
  lastMessage?: string; // El cuerpo del último mensaje
  timestamp: string; // Timestamp del último mensaje, convertir en el frontend
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  // Para la UI, podríamos querer un nombre de contacto si está disponible
  contactName?: string; 
}

export default function MensajesPage() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Cargar conversaciones
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      setError(null);
      try {
        const response = await fetch('/api/twilio/conversations');
        if (!response.ok) {
          throw new Error(`Error al cargar conversaciones: ${response.statusText}`);
        }
        const data = await response.json();
        // Asignar un nombre de contacto provisional si no viene del backend
        const conversationsWithNames = data.map((conv: IConversation) => ({
          ...conv,
          contactName: conv.contactName || conv.contactPhoneNumber, 
          timestamp: conv.timestamp || new Date().toISOString() // Asegurar que timestamp exista
        }));
        setConversations(conversationsWithNames);
      } catch (err: any) {
        setError(err.message);
        setConversations([]); // Limpiar conversaciones en caso de error
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  // Cargar mensajes de la conversación seleccionada
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    setIsLoadingMessages(true);
    setError(null);
    try {
      const response = await fetch(`/api/twilio/conversations/${conversationId}/messages`);
      if (!response.ok) {
        throw new Error(`Error al cargar mensajes: ${response.statusText}`);
      }
      const data: IMessage[] = await response.json();
      // Determinar senderType para la UI. Asumimos que los mensajes del backend no tienen 'senderType'
      // y que 'senderId' podría ser el ID del usuario o un identificador del contacto/Twilio.
      // Esta lógica puede necesitar ajustarse según cómo se identifique al 'usuario' en el contexto del mensaje.
      // Por ahora, una simplificación: si senderId no es un ID de usuario conocido (ej. 'user' o un ID específico), es 'contact'.
      // Esto es una suposición y probablemente necesite una mejor forma de determinar el senderType.
      const processedMessages = data.map(msg => {
        // Lógica corregida para senderType, asegurando el tipo correcto.
        // Asumimos que el 'userId' del usuario logueado se obtendrá de alguna manera (ej. contexto, sesión)
        // Por ahora, si senderId es 'agent' (o un ID específico del agente/sistema), es 'user' (el que usa la UI).
        // Si no, es 'contact'. Esta lógica es un placeholder y debe ser robusta.
        let type: 'user' | 'contact' = 'contact'; // Por defecto es contact
        // Aquí deberías comparar msg.senderId con el ID del usuario autenticado.
        // Ejemplo conceptual: if (msg.senderId === loggedInUserId) type = 'user';
        // O si el mensaje viene de la plataforma/agente hacia el contacto:
        if (msg.senderId === selectedConversation?.platformPhoneNumber || msg.senderId === 'agent_user_id_placeholder') { // 'agent_user_id_placeholder' sería el ID del usuario de la app
          type = 'user'; // Mensaje enviado por el usuario de esta app
        } else {
          type = 'contact'; // Mensaje enviado por el contacto externo
        }

        return {
          ...msg,
          senderType: type
        };
      }); 
      setMessages(processedMessages);
    } catch (err: any) {
      setError(err.message);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const handleSelectConversation = (conversation: IConversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
    // Marcar como leída (simulación por ahora, idealmente esto se haría en backend o se reflejaría mejor)
    setConversations(prev => 
      prev.map(conv => 
        conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Placeholder para el ID del usuario actual. En una app real, esto vendría de la sesión.
    const currentUserId = 'current_user_id_placeholder'; 

    const optimisticMessage: IMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: selectedConversation._id,
      senderId: currentUserId, // El senderId sería el del usuario que envía desde la app
      body: newMessage,
      timestamp: new Date().toISOString(),
      status: 'pending',
      senderType: 'user', // El mensaje enviado desde la UI siempre es 'user'
    };

    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setNewMessage('');

    try {
      const response = await fetch('/api/twilio/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          body: newMessage,
          // receiverPhoneNumber: selectedConversation.contactPhoneNumber // El backend lo tomará de la conversación
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      const sentMessage: IMessage = await response.json();
      
      // Actualizar el mensaje optimista con la respuesta del servidor
      // y determinar senderType basado en la respuesta real.
      setMessages(prevMessages =>
        prevMessages.map(msg => (msg._id === optimisticMessage._id ? { ...sentMessage, senderType: 'user' } : msg))
      );

      // Opcionalmente, recargar todos los mensajes para asegurar consistencia
      // fetchMessages(selectedConversation._id);

    } catch (err: any) {
      setError(err.message);
      // Revertir el mensaje optimista si falla el envío
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== optimisticMessage._id));
      // Considera restaurar el texto en el input si el envío falla
      // setNewMessage(optimisticMessage.body);
    }
  };

  if (isLoadingConversations) {
    return <div className="text-center py-10">Cargando conversaciones...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-gray-900 text-white">
      {/* Lista de Conversaciones */}
      <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-700">Chats</h2>
        {conversations.length === 0 && !isLoadingConversations && (
          <p className="p-4 text-gray-400">No hay conversaciones.</p>
        )}
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              className={`p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 ${selectedConversation?._id === conv._id ? 'bg-gray-600' : ''}`}
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">{conv.contactName || conv.contactPhoneNumber}</h3>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 truncate">{conv.lastMessage || 'No hay mensajes aún.'}</p>
              <p className="text-xs text-gray-500 text-right">
                {conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Vista del Chat Seleccionado */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">{selectedConversation.contactName || selectedConversation.contactPhoneNumber}</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-800">
              {isLoadingMessages && <p className="text-center text-gray-400">Cargando mensajes...</p>}
              {!isLoadingMessages && messages.length === 0 && <p className="text-center text-gray-400">No hay mensajes en esta conversación.</p>}
              {!isLoadingMessages && messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${msg.senderType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}
                  >
                    {msg.body}
                    <div className={`text-xs mt-1 ${msg.senderType === 'user' ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex items-center">
              <input 
                type="text" 
                placeholder="Escribe un mensaje..." 
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
                disabled={!newMessage.trim() || !selectedConversation}
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400 text-lg">Selecciona una conversación para ver los mensajes.</p>
          </div>
        )}
      </div>
    </div>
  );
}