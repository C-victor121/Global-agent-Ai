(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/client/src/services/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TodoService": (()=>TodoService),
    "UserService": (()=>UserService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
const TodoService = {
    // Obtener todas las tareas
    async getTodos () {
        try {
            const response = await fetch(`${API_URL}/todos`);
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al obtener las tareas');
            }
            return data.data;
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            return [];
        }
    },
    // Crear una nueva tarea
    async createTodo (title) {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title
                })
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al crear la tarea');
            }
            return data.data;
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            return null;
        }
    },
    // Actualizar una tarea
    async updateTodo (id, completed) {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed
                })
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al actualizar la tarea');
            }
            return data.data;
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            return null;
        }
    },
    // Eliminar una tarea
    async deleteTodo (id) {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al eliminar la tarea');
            }
            return true;
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            return false;
        }
    }
};
const USER_API_BASE_URL = `${API_URL}/api/users`;
const UserService = {
    // Obtener todos los usuarios
    async getUsers () {
        try {
            const response = await fetch(USER_API_BASE_URL);
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al obtener los usuarios');
            }
            return data.data;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return [];
        }
    },
    // Crear un nuevo usuario
    async createUser (userData) {
        try {
            const response = await fetch(USER_API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al crear el usuario');
            }
            return data.data;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return null;
        }
    },
    // Actualizar un usuario
    async updateUser (id, userData) {
        try {
            const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Error al actualizar el usuario');
            }
            return data.data;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return null;
        }
    },
    // Eliminar un usuario
    async deleteUser (id) {
        try {
            const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json(); // Asumiendo que no devuelve datos en el delete exitoso
            if (!data.success) {
                throw new Error(data.message || 'Error al eliminar el usuario');
            }
            return true;
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            return false;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/client/src/app/usuarios/gestion/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/usuarios/gestion/page.tsx
__turbopack_context__.s({
    "default": (()=>GestionUsuariosPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const Modal = ({ isOpen, onClose, onSubmit, title, children, submitButtonText = 'Guardar' })=>{
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-200 text-2xl",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: onSubmit,
                    children: [
                        children,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 flex justify-end space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-medium",
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium",
                                    children: submitButtonText
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
};
_c = Modal;
function GestionUsuariosPage() {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingUser, setEditingUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Usar UserFormData para el estado del formulario
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GestionUsuariosPage.useEffect": ()=>{
            const fetchUsers = {
                "GestionUsuariosPage.useEffect.fetchUsers": async ()=>{
                    try {
                        setLoading(true);
                        const fetchedUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserService"].getUsers();
                        setUsers(fetchedUsers);
                        setError(null);
                    } catch (err) {
                        console.error('Error fetching users:', err);
                        setError('No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.');
                    }
                    setLoading(false);
                }
            }["GestionUsuariosPage.useEffect.fetchUsers"];
            fetchUsers();
        }
    }["GestionUsuariosPage.useEffect"], []);
    const openModalForCreate = ()=>{
        setEditingUser(null);
        // Asegurarse de que todos los campos de UserFormData estén aquí
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user'
        });
        setIsModalOpen(true);
    };
    const openModalForEdit = (user)=>{
        setEditingUser(user);
        // Al editar, no pre-rellenar la contraseña. Se deja en blanco para no cambiarla o se introduce una nueva.
        setFormData({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: ''
        });
        setIsModalOpen(true);
    };
    const closeModal = ()=>{
        setIsModalOpen(false);
        setEditingUser(null);
        setError(null); // Limpiar errores al cerrar el modal
    };
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            if (editingUser) {
                // Editando usuario
                const dataToUpdate = {
                    ...formData
                };
                // Solo enviar la contraseña si se ha introducido una nueva y no está vacía
                if (!formData.password || formData.password.trim() === '') {
                    delete dataToUpdate.password;
                }
                const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserService"].updateUser(editingUser._id, dataToUpdate);
                if (updatedUser) {
                    setUsers(users.map((u)=>u._id === editingUser._id ? updatedUser : u));
                    closeModal();
                }
            } else {
                // Creando usuario
                if (!formData.password || formData.password.trim() === '') {
                    setError('La contraseña es obligatoria para crear un usuario.');
                    return;
                }
                const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserService"].createUser(formData); // Asegurar que el tipo es User para createUser
                if (newUser) {
                    setUsers([
                        ...users,
                        newUser
                    ]);
                    closeModal();
                }
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
        }
    };
    const handleDeleteUser = async (userId)=>{
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const success = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserService"].deleteUser(userId);
                if (success) {
                    setUsers(users.filter((user)=>user._id !== userId));
                    setError(null);
                } else {
                    setError('No se pudo eliminar el usuario.');
                }
            } catch (err) {
                console.error('Error deleting user:', err);
                setError('Error al eliminar el usuario. Inténtalo de nuevo más tarde.');
            }
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10",
            children: "Cargando usuarios..."
        }, void 0, false, {
            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
            lineNumber: 159,
            columnNumber: 12
        }, this);
    }
    // No mostrar error general de carga si el modal tiene su propio error
    if (error && !isModalOpen) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10 text-red-500",
            children: error
        }, void 0, false, {
            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
            lineNumber: 164,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto px-4 py-8 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold",
                        children: "Gestión de Usuarios"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: openModalForCreate,
                        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlus"], {
                                className: "mr-2"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            " Crear Usuario"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Modal, {
                isOpen: isModalOpen,
                onClose: closeModal,
                onSubmit: handleSubmit,
                title: editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario',
                submitButtonText: editingUser ? 'Guardar Cambios' : 'Crear Usuario',
                children: [
                    error && isModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 text-sm mb-3",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                        lineNumber: 186,
                        columnNumber: 34
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "name",
                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                        children: "Nombre"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        name: "name",
                                        id: "name",
                                        value: formData.name || '',
                                        onChange: handleInputChange,
                                        className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "email",
                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        name: "email",
                                        id: "email",
                                        value: formData.email || '',
                                        onChange: handleInputChange,
                                        className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "password",
                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                        children: [
                                            "Contraseña ",
                                            editingUser ? '(Dejar en blanco para no cambiar)' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        name: "password",
                                        id: "password",
                                        value: formData.password || '',
                                        onChange: handleInputChange,
                                        className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white",
                                        required: !editingUser
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "role",
                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                        children: "Rol"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "role",
                                        id: "role",
                                        value: formData.role || 'user',
                                        onChange: handleInputChange,
                                        className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "user",
                                                children: "Usuario"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                lineNumber: 235,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "admin",
                                                children: "Administrador"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            users.length === 0 && !loading && !error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-gray-400",
                children: "No se encontraron usuarios."
            }, void 0, false, {
                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                lineNumber: 243,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto bg-gray-800 shadow-md rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full table-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Nombre"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 251,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Rol"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                        children: "Acciones"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                lineNumber: 248,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "bg-gray-800 divide-y divide-gray-700",
                            children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: user.name || 'N/A'
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                            lineNumber: 260,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: user.email || 'N/A'
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                            lineNumber: 261,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-600 text-green-100' : 'bg-yellow-500 text-yellow-100'}`,
                                                children: user.role || 'user'
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                lineNumber: 263,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>openModalForEdit(user),
                                                    className: "text-indigo-400 hover:text-indigo-600 mr-3",
                                                    "aria-label": "Editar usuario",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEdit"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleDeleteUser(user._id),
                                                    className: "text-red-400 hover:text-red-600",
                                                    "aria-label": "Eliminar usuario",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTrash"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                            lineNumber: 267,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, user._id, true, {
                                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                                    lineNumber: 258,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                            lineNumber: 256,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                    lineNumber: 246,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
                lineNumber: 245,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/usuarios/gestion/page.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
_s(GestionUsuariosPage, "zBH0j2LVGKFNW/l97kNLwz9mhs0=");
_c1 = GestionUsuariosPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "Modal");
__turbopack_context__.k.register(_c1, "GestionUsuariosPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=client_src_f4d05358._.js.map