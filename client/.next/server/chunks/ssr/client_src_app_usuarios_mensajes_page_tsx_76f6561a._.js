module.exports = {

"[project]/client/src/app/usuarios/mensajes/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MensajesPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function MensajesPage() {
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedConversation, setSelectedConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingConversations, setIsLoadingConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isLoadingMessages, setIsLoadingMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newMessage, setNewMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Cargar conversaciones
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchConversations = async ()=>{
            setIsLoadingConversations(true);
            setError(null);
            try {
                const response = await fetch('/api/twilio/conversations');
                if (!response.ok) {
                    throw new Error(`Error al cargar conversaciones: ${response.statusText}`);
                }
                const data = await response.json();
                // Asignar un nombre de contacto provisional si no viene del backend
                const conversationsWithNames = data.map((conv)=>({
                        ...conv,
                        contactName: conv.contactName || conv.contactPhoneNumber,
                        timestamp: conv.timestamp || new Date().toISOString() // Asegurar que timestamp exista
                    }));
                setConversations(conversationsWithNames);
            } catch (err) {
                setError(err.message);
                setConversations([]); // Limpiar conversaciones en caso de error
            } finally{
                setIsLoadingConversations(false);
            }
        };
        fetchConversations();
    }, []);
    // Cargar mensajes de la conversación seleccionada
    const fetchMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (conversationId)=>{
        if (!conversationId) return;
        setIsLoadingMessages(true);
        setError(null);
        try {
            const response = await fetch(`/api/twilio/conversations/${conversationId}/messages`);
            if (!response.ok) {
                throw new Error(`Error al cargar mensajes: ${response.statusText}`);
            }
            const data = await response.json();
            // Determinar senderType para la UI. Asumimos que los mensajes del backend no tienen 'senderType'
            // y que 'senderId' podría ser el ID del usuario o un identificador del contacto/Twilio.
            // Esta lógica puede necesitar ajustarse según cómo se identifique al 'usuario' en el contexto del mensaje.
            // Por ahora, una simplificación: si senderId no es un ID de usuario conocido (ej. 'user' o un ID específico), es 'contact'.
            // Esto es una suposición y probablemente necesite una mejor forma de determinar el senderType.
            const processedMessages = data.map((msg)=>{
                // Lógica corregida para senderType, asegurando el tipo correcto.
                // Asumimos que el 'userId' del usuario logueado se obtendrá de alguna manera (ej. contexto, sesión)
                // Por ahora, si senderId es 'agent' (o un ID específico del agente/sistema), es 'user' (el que usa la UI).
                // Si no, es 'contact'. Esta lógica es un placeholder y debe ser robusta.
                let type = 'contact'; // Por defecto es contact
                // Aquí deberías comparar msg.senderId con el ID del usuario autenticado.
                // Ejemplo conceptual: if (msg.senderId === loggedInUserId) type = 'user';
                // O si el mensaje viene de la plataforma/agente hacia el contacto:
                if (msg.senderId === selectedConversation?.platformPhoneNumber || msg.senderId === 'agent_user_id_placeholder') {
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
        } catch (err) {
            setError(err.message);
            setMessages([]);
        } finally{
            setIsLoadingMessages(false);
        }
    }, []);
    const handleSelectConversation = (conversation)=>{
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
        // Marcar como leída (simulación por ahora, idealmente esto se haría en backend o se reflejaría mejor)
        setConversations((prev)=>prev.map((conv)=>conv._id === conversation._id ? {
                    ...conv,
                    unreadCount: 0
                } : conv));
    };
    const handleSendMessage = async ()=>{
        if (!newMessage.trim() || !selectedConversation) return;
        // Placeholder para el ID del usuario actual. En una app real, esto vendría de la sesión.
        const currentUserId = 'current_user_id_placeholder';
        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            conversationId: selectedConversation._id,
            senderId: currentUserId,
            body: newMessage,
            timestamp: new Date().toISOString(),
            status: 'pending',
            senderType: 'user'
        };
        setMessages((prevMessages)=>[
                ...prevMessages,
                optimisticMessage
            ]);
        setNewMessage('');
        try {
            const response = await fetch('/api/twilio/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversationId: selectedConversation._id,
                    body: newMessage
                })
            });
            if (!response.ok) {
                throw new Error('Error al enviar el mensaje');
            }
            const sentMessage = await response.json();
            // Actualizar el mensaje optimista con la respuesta del servidor
            // y determinar senderType basado en la respuesta real.
            setMessages((prevMessages)=>prevMessages.map((msg)=>msg._id === optimisticMessage._id ? {
                        ...sentMessage,
                        senderType: 'user'
                    } : msg));
        // Opcionalmente, recargar todos los mensajes para asegurar consistencia
        // fetchMessages(selectedConversation._id);
        } catch (err) {
            setError(err.message);
            // Revertir el mensaje optimista si falla el envío
            setMessages((prevMessages)=>prevMessages.filter((msg)=>msg._id !== optimisticMessage._id));
        // Considera restaurar el texto en el input si el envío falla
        // setNewMessage(optimisticMessage.body);
        }
    };
    if (isLoadingConversations) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10",
            children: "Cargando conversaciones..."
        }, void 0, false, {
            fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
            lineNumber: 185,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10 text-red-500",
            children: [
                "Error: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
            lineNumber: 189,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-[calc(100vh-10rem)] bg-gray-900 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-1/3 border-r border-gray-700 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold p-4 border-b border-gray-700",
                        children: "Chats"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    conversations.length === 0 && !isLoadingConversations && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "p-4 text-gray-400",
                        children: "No hay conversaciones."
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: conversations.map((conv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: `p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 ${selectedConversation?._id === conv._id ? 'bg-gray-600' : ''}`,
                                onClick: ()=>handleSelectConversation(conv),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-white",
                                                children: conv.contactName || conv.contactPhoneNumber
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this),
                                            conv.unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full",
                                                children: conv.unreadCount
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                                lineNumber: 210,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 truncate",
                                        children: conv.lastMessage || 'No hay mensajes aún.'
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 text-right",
                                        children: conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, conv._id, true, {
                                fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-2/3 flex flex-col",
                children: selectedConversation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-b border-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-white",
                                children: selectedConversation.contactName || selectedConversation.contactPhoneNumber
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-grow p-4 overflow-y-auto space-y-4 bg-gray-800",
                            children: [
                                isLoadingMessages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center text-gray-400",
                                    children: "Cargando mensajes..."
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                    lineNumber: 232,
                                    columnNumber: 37
                                }, this),
                                !isLoadingMessages && messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center text-gray-400",
                                    children: "No hay mensajes en esta conversación."
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                    lineNumber: 233,
                                    columnNumber: 63
                                }, this),
                                !isLoadingMessages && messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${msg.senderType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`,
                                            children: [
                                                msg.body,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-xs mt-1 ${msg.senderType === 'user' ? 'text-blue-200' : 'text-gray-400'} text-right`,
                                                    children: new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this)
                                    }, msg._id, false, {
                                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                            lineNumber: 231,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-t border-gray-700 flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Escribe un mensaje...",
                                    className: "w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2",
                                    value: newMessage,
                                    onChange: (e)=>setNewMessage(e.target.value),
                                    onKeyPress: (e)=>e.key === 'Enter' && handleSendMessage()
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSendMessage,
                                    className: "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg",
                                    disabled: !newMessage.trim() || !selectedConversation,
                                    children: "Enviar"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                                    lineNumber: 259,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                            lineNumber: 250,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-grow flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-lg",
                        children: "Selecciona una conversación para ver los mensajes."
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                        lineNumber: 270,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                    lineNumber: 269,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/usuarios/mensajes/page.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=client_src_app_usuarios_mensajes_page_tsx_76f6561a._.js.map