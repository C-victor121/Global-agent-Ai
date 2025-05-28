(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/client/src/services/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TodoService": (()=>TodoService),
    "UserService": (()=>UserService),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    withCredentials: true,
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});
const __TURBOPACK__default__export__ = apiClient;
const TodoService = {
    // Obtener todas las tareas
    async getTodos () {
        try {
            const response = await fetch(`${API_URL}/todos`); // Asumiendo que esta URL es correcta o ajústala
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
            const data = await response.json(); // Asumiendo que no devuelve datos en el delete exitoso
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
"[project]/client/src/services/plan.service.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createPlan": (()=>createPlan),
    "deletePlan": (()=>deletePlan),
    "getPlanById": (()=>getPlanById),
    "getPlans": (()=>getPlans),
    "updatePlan": (()=>updatePlan)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/services/api.ts [app-client] (ecmascript)");
;
const getPlans = async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/plans');
    return response.data;
};
const getPlanById = async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/plans/${id}`);
    return response.data;
};
const createPlan = async (planData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/plans', planData);
    return response.data;
};
const updatePlan = async (id, planData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/plans/${id}`, planData);
    return response.data;
};
const deletePlan = async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/plans/${id}`);
    return response.data;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/client/src/app/usuarios/admin/planes/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AdminPlanesPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/services/plan.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const initialFormData = {
    name: '',
    shortDescription: '',
    monthlyPrice: 0,
    annualPrice: 0,
    trialPeriodDays: 0,
    requiresCardForTrial: false,
    isActive: true,
    features: {
        aiAgents: {
            numberOfAgents: 1,
            allowAudio: false,
            allowPhoneVoice: false
        },
        integrations: {
            numberOfPlatforms: 1,
            dropi: false,
            whatsapp: false,
            apiAccess: false
        },
        capacity: {
            conversationLimitMonthly: 100,
            accessToMetrics: false,
            advancedDashboard: false
        },
        others: {
            technicalSupport: 'email',
            smartFunnelsAccess: false,
            aiTemplatesAccess: false
        }
    }
};
function AdminPlanesPage() {
    _s();
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingPlan, setEditingPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFormData);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminPlanesPage.useEffect": ()=>{
            fetchPlans();
        }
    }["AdminPlanesPage.useEffect"], []);
    const fetchPlans = async ()=>{
        setIsLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPlans"])();
            setPlans(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los planes. Inténtalo de nuevo más tarde.');
            console.error(err);
        }
        setIsLoading(false);
    };
    const handleInputChange = (e)=>{
        const { name, value, type } = e.target;
        let parsedValue = value;
        if (type === 'checkbox') {
            parsedValue = e.target.checked;
        } else if (type === 'number') {
            parsedValue = value === '' ? '' : parseFloat(value);
        }
        const nameParts = name.split('.');
        if (nameParts.length === 1) {
            setFormData((prev)=>({
                    ...prev,
                    [name]: parsedValue
                }));
        } else if (nameParts.length === 3) {
            const [featureKey, category, property] = nameParts;
            setFormData((prev)=>({
                    ...prev,
                    features: {
                        ...prev.features,
                        [category]: {
                            ...prev.features[category],
                            [property]: parsedValue
                        }
                    }
                }));
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        // Convertir campos numéricos de string a number antes de enviar
        const planDataToSend = {
            ...formData,
            monthlyPrice: Number(formData.monthlyPrice),
            annualPrice: formData.annualPrice ? Number(formData.annualPrice) : undefined,
            trialPeriodDays: Number(formData.trialPeriodDays),
            features: {
                ...formData.features,
                aiAgents: {
                    ...formData.features.aiAgents,
                    numberOfAgents: Number(formData.features.aiAgents.numberOfAgents)
                },
                integrations: {
                    ...formData.features.integrations,
                    numberOfPlatforms: Number(formData.features.integrations.numberOfPlatforms)
                },
                capacity: {
                    ...formData.features.capacity,
                    conversationLimitMonthly: Number(formData.features.capacity.conversationLimitMonthly)
                }
            }
        };
        try {
            if (editingPlan) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updatePlan"])(editingPlan._id, planDataToSend);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPlan"])(planDataToSend);
            }
            fetchPlans();
            setShowForm(false);
            setEditingPlan(null);
            setFormData(initialFormData);
        } catch (err) {
            setError(editingPlan ? 'Error al actualizar el plan.' : 'Error al crear el plan.');
            console.error(err);
        }
    };
    const handleEdit = (plan)=>{
        setEditingPlan(plan);
        // Asegurarse de que todos los campos numéricos se cargan como string si es necesario para el input type=number
        // o mantenerlos como number y asegurar que el input los maneje bien.
        // Aquí asumimos que la conversión a string para el input se maneja o no es necesaria
        // y que los booleanos se manejan correctamente por los checkboxes.
        setFormData({
            name: plan.name,
            shortDescription: plan.shortDescription,
            monthlyPrice: plan.monthlyPrice,
            annualPrice: plan.annualPrice || 0,
            trialPeriodDays: plan.trialPeriodDays,
            requiresCardForTrial: plan.requiresCardForTrial,
            isActive: plan.isActive,
            features: {
                aiAgents: {
                    numberOfAgents: String(plan.features.aiAgents.numberOfAgents),
                    allowAudio: plan.features.aiAgents.allowAudio,
                    allowPhoneVoice: plan.features.aiAgents.allowPhoneVoice
                },
                integrations: {
                    numberOfPlatforms: String(plan.features.integrations.numberOfPlatforms),
                    dropi: plan.features.integrations.dropi,
                    whatsapp: plan.features.integrations.whatsapp,
                    apiAccess: plan.features.integrations.apiAccess
                },
                capacity: {
                    conversationLimitMonthly: String(plan.features.capacity.conversationLimitMonthly),
                    accessToMetrics: plan.features.capacity.accessToMetrics,
                    advancedDashboard: plan.features.capacity.advancedDashboard
                },
                others: {
                    technicalSupport: plan.features.others.technicalSupport,
                    smartFunnelsAccess: plan.features.others.smartFunnelsAccess,
                    aiTemplatesAccess: plan.features.others.aiTemplatesAccess
                }
            }
        });
        setShowForm(true);
    };
    const handleDelete = async (id)=>{
        if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePlan"])(id);
                fetchPlans();
            } catch (err) {
                setError('Error al eliminar el plan.');
                console.error(err);
            }
        }
    };
    const openCreateForm = ()=>{
        setEditingPlan(null);
        setFormData(initialFormData);
        setShowForm(true);
    };
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Cargando planes..."
        }, void 0, false, {
            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
            lineNumber: 223,
            columnNumber: 64
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
        lineNumber: 223,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto px-4 py-8 bg-slate-800 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold mb-4",
                        children: "Gestión de Planes de Membresía"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 bg-red-100 p-3 rounded mb-4",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 230,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: openCreateForm,
                        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4",
                        children: "Crear Nuevo Plan"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            " ",
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-3",
                        children: editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium mb-2",
                                children: "📝 Datos Generales"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "name",
                                className: "block text-gray-700 text-sm font-bold mb-2",
                                children: "Nombre del Plan:"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                name: "name",
                                id: "name",
                                value: formData.name,
                                onChange: handleInputChange,
                                required: true,
                                className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "shortDescription",
                                className: "block text-gray-700 text-sm font-bold mb-2",
                                children: "Descripción Corta:"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                name: "shortDescription",
                                id: "shortDescription",
                                value: formData.shortDescription,
                                onChange: handleInputChange,
                                required: true,
                                className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "monthlyPrice",
                                        className: "block text-gray-700 text-sm font-bold mb-2",
                                        children: "Precio Mensual (USD):"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "monthlyPrice",
                                        id: "monthlyPrice",
                                        value: formData.monthlyPrice,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        step: "0.01",
                                        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "annualPrice",
                                        className: "block text-gray-700 text-sm font-bold mb-2",
                                        children: "Precio Anual (USD) (opcional):"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "annualPrice",
                                        id: "annualPrice",
                                        value: formData.annualPrice,
                                        onChange: handleInputChange,
                                        min: "0",
                                        step: "0.01",
                                        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 260,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "trialPeriodDays",
                                        className: "block text-gray-700 text-sm font-bold mb-2",
                                        children: "Periodo de Prueba (días):"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "trialPeriodDays",
                                        id: "trialPeriodDays",
                                        value: formData.trialPeriodDays,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "requiresCardForTrial",
                                        id: "requiresCardForTrial",
                                        checked: formData.requiresCardForTrial,
                                        onChange: handleInputChange,
                                        className: "mr-2 leading-tight"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 272,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "requiresCardForTrial",
                                        className: "text-sm text-gray-700",
                                        children: "Requiere tarjeta para prueba"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                name: "isActive",
                                id: "isActive",
                                checked: formData.isActive,
                                onChange: handleInputChange,
                                className: "mr-2 leading-tight"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 278,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "isActive",
                                className: "text-sm text-gray-700 font-bold",
                                children: "Activo (mostrar en frontend)"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-black",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium mb-2",
                                children: "⚙️ Funcionalidades"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "🧠 Agentes AI"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 286,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.aiAgents.numberOfAgents",
                                        className: "block text-sm mb-1",
                                        children: "Número de agentes incluidos:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "features.aiAgents.numberOfAgents",
                                        id: "features.aiAgents.numberOfAgents",
                                        value: formData.features.aiAgents.numberOfAgents,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.aiAgents.allowAudio",
                                                id: "features.aiAgents.allowAudio",
                                                checked: formData.features.aiAgents.allowAudio,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 290,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.aiAgents.allowAudio",
                                                className: "text-sm",
                                                children: "Permitir audio"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 291,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.aiAgents.allowPhoneVoice",
                                                id: "features.aiAgents.allowPhoneVoice",
                                                checked: formData.features.aiAgents.allowPhoneVoice,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 294,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.aiAgents.allowPhoneVoice",
                                                className: "text-sm",
                                                children: "Permitir voz telefónica"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 295,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 293,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "📲 Integraciones"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 300,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.integrations.numberOfPlatforms",
                                        className: "block text-sm mb-1",
                                        children: "Número de plataformas soportadas:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 301,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "features.integrations.numberOfPlatforms",
                                        id: "features.integrations.numberOfPlatforms",
                                        value: formData.features.integrations.numberOfPlatforms,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.integrations.dropi",
                                                id: "features.integrations.dropi",
                                                checked: formData.features.integrations.dropi,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 304,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.integrations.dropi",
                                                className: "text-sm",
                                                children: "Dropi"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.integrations.whatsapp",
                                                id: "features.integrations.whatsapp",
                                                checked: formData.features.integrations.whatsapp,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 308,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.integrations.whatsapp",
                                                className: "text-sm",
                                                children: "WhatsApp"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.integrations.apiAccess",
                                                id: "features.integrations.apiAccess",
                                                checked: formData.features.integrations.apiAccess,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 312,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.integrations.apiAccess",
                                                className: "text-sm",
                                                children: "API acceso"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 299,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "📈 Capacidad"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.capacity.conversationLimitMonthly",
                                        className: "block text-sm mb-1",
                                        children: "Límite de conversaciones al mes:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "features.capacity.conversationLimitMonthly",
                                        id: "features.capacity.conversationLimitMonthly",
                                        value: formData.features.capacity.conversationLimitMonthly,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.capacity.accessToMetrics",
                                                id: "features.capacity.accessToMetrics",
                                                checked: formData.features.capacity.accessToMetrics,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.capacity.accessToMetrics",
                                                className: "text-sm",
                                                children: "Acceso a métricas"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 323,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.capacity.advancedDashboard",
                                                id: "features.capacity.advancedDashboard",
                                                checked: formData.features.capacity.advancedDashboard,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.capacity.advancedDashboard",
                                                className: "text-sm",
                                                children: "Dashboard avanzado"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 327,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "🧩 Otros"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 332,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.others.technicalSupport",
                                        className: "block text-sm mb-1",
                                        children: "Soporte técnico:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "features.others.technicalSupport",
                                        id: "features.others.technicalSupport",
                                        value: formData.features.others.technicalSupport,
                                        onChange: handleInputChange,
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "email",
                                                children: "Email"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 335,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "chat",
                                                children: "Chat"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "priority",
                                                children: "Prioridad"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 334,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.others.smartFunnelsAccess",
                                                id: "features.others.smartFunnelsAccess",
                                                checked: formData.features.others.smartFunnelsAccess,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 340,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.others.smartFunnelsAccess",
                                                className: "text-sm",
                                                children: "Acceso a embudos inteligentes"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 341,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 339,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.others.aiTemplatesAccess",
                                                id: "features.others.aiTemplatesAccess",
                                                checked: formData.features.others.aiTemplatesAccess,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 344,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.others.aiTemplatesAccess",
                                                className: "text-sm",
                                                children: "Acceso a plantillas IA"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 331,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                                children: editingPlan ? 'Actualizar Plan' : 'Guardar Plan'
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 352,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setShowForm(false);
                                    setEditingPlan(null);
                                    setFormData(initialFormData);
                                },
                                className: "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                                children: "Cancelar"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 351,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                lineNumber: 241,
                columnNumber: 9
            }, this),
            !showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shadow overflow-hidden border-b border-gray-200 sm:rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full divide-y divide-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Nombre"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 367,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Precio Mensual"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 368,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Prueba (días)"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Activo"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Acciones"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 371,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 366,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                            lineNumber: 365,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "bg-white divide-y divide-gray-200",
                            children: plans.length > 0 ? plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium text-gray-900",
                                                    children: plan.name
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-500",
                                                    children: plan.shortDescription
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                            lineNumber: 378,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-900",
                                                    children: [
                                                        "$",
                                                        plan.monthlyPrice.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 23
                                                }, this),
                                                plan.annualPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-500",
                                                    children: [
                                                        "Anual: $",
                                                        plan.annualPrice.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 44
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                            lineNumber: 382,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                            children: plan.trialPeriodDays
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                            lineNumber: 386,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`,
                                                children: plan.isActive ? 'Sí' : 'No'
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                            lineNumber: 387,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEdit(plan),
                                                    className: "text-indigo-600 hover:text-indigo-900 mr-3",
                                                    children: "Editar"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleDelete(plan._id),
                                                    className: "text-red-600 hover:text-red-900",
                                                    children: "Eliminar"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                            lineNumber: 392,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, plan._id, true, {
                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                    lineNumber: 377,
                                    columnNumber: 19
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 5,
                                    className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center",
                                    children: "No hay planes creados."
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                    lineNumber: 400,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 399,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                            lineNumber: 374,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                    lineNumber: 364,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                lineNumber: 363,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
        lineNumber: 226,
        columnNumber: 5
    }, this);
}
_s(AdminPlanesPage, "2iGJOtblnhsUFrxhohn84jeePW4=");
_c = AdminPlanesPage;
var _c;
__turbopack_context__.k.register(_c, "AdminPlanesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=client_src_f992fa8f._.js.map