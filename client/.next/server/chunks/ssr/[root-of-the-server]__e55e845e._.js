module.exports = {

"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/client/src/services/api.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "TodoService": (()=>TodoService),
    "UserService": (()=>UserService),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
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
}}),
"[project]/client/src/services/plan.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createPlan": (()=>createPlan),
    "deletePlan": (()=>deletePlan),
    "getPlanById": (()=>getPlanById),
    "getPlans": (()=>getPlans),
    "updatePlan": (()=>updatePlan)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/services/api.ts [app-ssr] (ecmascript)");
;
const getPlans = async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/plans');
    return response.data;
};
const getPlanById = async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/plans/${id}`);
    return response.data;
};
const createPlan = async (planData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/plans', planData);
    return response.data;
};
const updatePlan = async (id, planData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/plans/${id}`, planData);
    return response.data;
};
const deletePlan = async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/plans/${id}`);
    return response.data;
};
}}),
"[project]/client/src/app/planes/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "PlanCard": (()=>PlanCard),
    "default": (()=>PlanesPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/services/plan.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const PlanCard = ({ plan, isAdmin = false, onEdit, onDelete })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl rounded-xl p-6 flex flex-col justify-between m-4 w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-slate-700 hover:border-blue-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3",
                        children: plan.name
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-4 h-24 overflow-y-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800",
                        children: plan.shortDescription
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 12,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "my-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-4xl font-extrabold text-white",
                                children: [
                                    "$",
                                    plan.monthlyPrice.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 14,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500 text-sm",
                                children: "/mes"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 15,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    plan.annualPrice !== null && plan.annualPrice !== undefined && plan.annualPrice > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 text-xs text-gray-500",
                        children: [
                            "o $",
                            plan.annualPrice.toFixed(2),
                            "/año (ahorra $",
                            ((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12) * 100).toFixed(0),
                            "%)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "text-gray-400 space-y-2 mb-6 text-sm flex-grow",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-500 mr-2",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/planes/page.tsx",
                                        lineNumber: 23,
                                        columnNumber: 45
                                    }, this),
                                    plan.features.aiAgents.numberOfAgents,
                                    " Agente(s) AI"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 23,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-500 mr-2",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/planes/page.tsx",
                                        lineNumber: 24,
                                        columnNumber: 45
                                    }, this),
                                    plan.features.integrations.numberOfPlatforms,
                                    " Integracion(es)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-500 mr-2",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/planes/page.tsx",
                                        lineNumber: 25,
                                        columnNumber: 45
                                    }, this),
                                    plan.features.capacity.conversationLimitMonthly,
                                    " Conversaciones/mes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this),
                            plan.features.aiAgents.allowAudio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-500 mr-2",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/planes/page.tsx",
                                        lineNumber: 26,
                                        columnNumber: 83
                                    }, this),
                                    " Audio permitido"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 26,
                                columnNumber: 49
                            }, this),
                            plan.features.integrations.whatsapp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-500 mr-2",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/planes/page.tsx",
                                        lineNumber: 27,
                                        columnNumber: 85
                                    }, this),
                                    " Integración WhatsApp"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 27,
                                columnNumber: 51
                            }, this),
                            plan.trialPeriodDays !== null && plan.trialPeriodDays > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-500 mr-2",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/planes/page.tsx",
                                        lineNumber: 29,
                                        columnNumber: 47
                                    }, this),
                                    " ",
                                    plan.trialPeriodDays,
                                    " días de prueba"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/planes/page.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/planes/page.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            !isAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: `/subscribe/${plan._id}`,
                legacyBehavior: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    className: "block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg",
                    children: "Seleccionar Plan"
                }, void 0, false, {
                    fileName: "[project]/client/src/app/planes/page.tsx",
                    lineNumber: 35,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/app/planes/page.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto pt-4 flex space-x-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onEdit && onEdit(plan),
                        className: "flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105",
                        children: "Editar"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onDelete && onDelete(plan._id),
                        className: "flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105",
                        children: "Eliminar"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/planes/page.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/planes/page.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/planes/page.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
};
;
function PlanesPage() {
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchPlans = async ()=>{
            setIsLoading(true);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPlans"])();
                setPlans(data.filter((plan)=>plan.isActive)); // Solo mostrar planes activos
                setError(null);
            } catch (err) {
                setError('Error al cargar los planes. Inténtalo de nuevo más tarde.');
                console.error(err);
            }
            setIsLoading(false);
        };
        fetchPlans();
    }, []);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-screen bg-slate-900",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white text-xl",
                children: "Cargando planes..."
            }, void 0, false, {
                fileName: "[project]/client/src/app/planes/page.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/client/src/app/planes/page.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-screen bg-slate-900",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500 text-xl",
                children: error
            }, void 0, false, {
                fileName: "[project]/client/src/app/planes/page.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/client/src/app/planes/page.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this);
    }
    if (plans.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-4xl font-bold mb-8",
                    children: "Nuestros Planes"
                }, void 0, false, {
                    fileName: "[project]/client/src/app/planes/page.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xl mb-4",
                    children: "Actualmente no hay planes disponibles."
                }, void 0, false, {
                    fileName: "[project]/client/src/app/planes/page.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "Por favor, vuelve a intentarlo más tarde."
                }, void 0, false, {
                    fileName: "[project]/client/src/app/planes/page.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/planes/page.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 sm:text-6xl md:text-7xl",
                            children: "Elige Tu Plan Perfecto"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/planes/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 max-w-xl mx-auto text-lg text-gray-400 sm:text-xl md:mt-6 md:text-2xl md:max-w-3xl",
                            children: "Impulsa tu negocio con la IA. Comienza con una prueba gratuita y escala según tus necesidades."
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/planes/page.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/planes/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap justify-center items-stretch -m-4",
                    children: plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlanCard, {
                            plan: plan
                        }, plan._id, false, {
                            fileName: "[project]/client/src/app/planes/page.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/client/src/app/planes/page.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/planes/page.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/app/planes/page.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
}}),
"[project]/client/src/app/usuarios/admin/planes/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AdminPlanesPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/services/plan.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$planes$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/planes/page.tsx [app-ssr] (ecmascript)"); // Importar PlanCard
'use client';
;
;
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
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingPlan, setEditingPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialFormData);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchPlans();
    }, []);
    const fetchPlans = async ()=>{
        setIsLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPlans"])();
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
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePlan"])(editingPlan._id, planDataToSend);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPlan"])(planDataToSend);
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
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$services$2f$plan$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePlan"])(id);
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
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Cargando planes..."
        }, void 0, false, {
            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
            lineNumber: 224,
            columnNumber: 64
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
        lineNumber: 224,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto px-4 py-8 bg-slate-800 min-h-screen text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-white",
                        children: "Gestión de Planes de Membresía"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 bg-red-100 p-3 rounded mb-4",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 231,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: openCreateForm,
                        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4",
                        children: "Crear Nuevo Plan"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this),
            " ",
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-3 text-white",
                        children: editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 243,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium mb-2 text-white",
                                children: "📝 Datos Generales"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "name",
                                className: "block text-gray-300 text-sm font-bold mb-2",
                                children: "Nombre del Plan:"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                name: "name",
                                id: "name",
                                value: formData.name,
                                onChange: handleInputChange,
                                required: true,
                                className: "shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "shortDescription",
                                className: "block text-gray-300 text-sm font-bold mb-2",
                                children: "Descripción Corta:"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                name: "shortDescription",
                                id: "shortDescription",
                                value: formData.shortDescription,
                                onChange: handleInputChange,
                                required: true,
                                className: "shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "monthlyPrice",
                                        className: "block text-gray-300 text-sm font-bold mb-2",
                                        children: "Precio Mensual (USD):"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "monthlyPrice",
                                        id: "monthlyPrice",
                                        value: formData.monthlyPrice,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        step: "0.01",
                                        className: "shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 257,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "annualPrice",
                                        className: "block text-gray-300 text-sm font-bold mb-2",
                                        children: "Precio Anual (USD) (opcional):"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "annualPrice",
                                        id: "annualPrice",
                                        value: formData.annualPrice,
                                        onChange: handleInputChange,
                                        min: "0",
                                        step: "0.01",
                                        className: "shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "trialPeriodDays",
                                        className: "block text-gray-300 text-sm font-bold mb-2",
                                        children: "Periodo de Prueba (días):"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "trialPeriodDays",
                                        id: "trialPeriodDays",
                                        value: formData.trialPeriodDays,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 268,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "requiresCardForTrial",
                                        id: "requiresCardForTrial",
                                        checked: formData.requiresCardForTrial,
                                        onChange: handleInputChange,
                                        className: "mr-2 leading-tight"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "requiresCardForTrial",
                                        className: "text-sm text-gray-300",
                                        children: "Requiere tarjeta para prueba"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 274,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                name: "isActive",
                                id: "isActive",
                                checked: formData.isActive,
                                onChange: handleInputChange,
                                className: "mr-2 leading-tight"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "isActive",
                                className: "text-sm text-gray-300 font-bold",
                                children: "Activo (mostrar en frontend)"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 280,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium mb-2 text-white",
                                children: "⚙️ Funcionalidades"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 284,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border border-gray-600 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1 text-white",
                                        children: "🧠 Agentes AI"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.aiAgents.numberOfAgents",
                                        className: "block text-sm mb-1 text-gray-300",
                                        children: "Número de agentes incluidos:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "features.aiAgents.numberOfAgents",
                                        id: "features.aiAgents.numberOfAgents",
                                        value: formData.features.aiAgents.numberOfAgents,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.aiAgents.allowAudio",
                                                id: "features.aiAgents.allowAudio",
                                                checked: formData.features.aiAgents.allowAudio,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 291,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.aiAgents.allowAudio",
                                                className: "text-sm text-gray-300",
                                                children: "Permitir audio"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 292,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 290,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.aiAgents.allowPhoneVoice",
                                                id: "features.aiAgents.allowPhoneVoice",
                                                checked: formData.features.aiAgents.allowPhoneVoice,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 295,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.aiAgents.allowPhoneVoice",
                                                className: "text-sm text-gray-300",
                                                children: "Permitir voz telefónica"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 296,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 294,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border border-gray-600 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1 text-white",
                                        children: "📲 Integraciones"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 301,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.integrations.numberOfPlatforms",
                                        className: "block text-sm mb-1 text-gray-300",
                                        children: "Número de plataformas soportadas:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "features.integrations.numberOfPlatforms",
                                        id: "features.integrations.numberOfPlatforms",
                                        value: formData.features.integrations.numberOfPlatforms,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.integrations.dropi",
                                                id: "features.integrations.dropi",
                                                checked: formData.features.integrations.dropi,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.integrations.dropi",
                                                className: "text-sm text-gray-300",
                                                children: "Dropi"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 306,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 304,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.integrations.whatsapp",
                                                id: "features.integrations.whatsapp",
                                                checked: formData.features.integrations.whatsapp,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.integrations.whatsapp",
                                                className: "text-sm text-gray-300",
                                                children: "WhatsApp"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 310,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 308,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.integrations.apiAccess",
                                                id: "features.integrations.apiAccess",
                                                checked: formData.features.integrations.apiAccess,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.integrations.apiAccess",
                                                className: "text-sm text-gray-300",
                                                children: "API acceso"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 314,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border border-gray-600 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1 text-white",
                                        children: "📈 Capacidad"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.capacity.conversationLimitMonthly",
                                        className: "block text-sm mb-1 text-gray-300",
                                        children: "Límite de conversaciones al mes:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        name: "features.capacity.conversationLimitMonthly",
                                        id: "features.capacity.conversationLimitMonthly",
                                        value: formData.features.capacity.conversationLimitMonthly,
                                        onChange: handleInputChange,
                                        required: true,
                                        min: "0",
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.capacity.accessToMetrics",
                                                id: "features.capacity.accessToMetrics",
                                                checked: formData.features.capacity.accessToMetrics,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 323,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.capacity.accessToMetrics",
                                                className: "text-sm text-gray-300",
                                                children: "Acceso a métricas"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 324,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 322,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.capacity.advancedDashboard",
                                                id: "features.capacity.advancedDashboard",
                                                checked: formData.features.capacity.advancedDashboard,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 327,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.capacity.advancedDashboard",
                                                className: "text-sm text-gray-300",
                                                children: "Dashboard avanzado"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 328,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 p-3 border border-gray-600 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1 text-white",
                                        children: "🧩 Otros"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "features.others.technicalSupport",
                                        className: "block text-sm mb-1 text-gray-300",
                                        children: "Soporte técnico:"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 334,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "features.others.technicalSupport",
                                        id: "features.others.technicalSupport",
                                        value: formData.features.others.technicalSupport,
                                        onChange: handleInputChange,
                                        className: "shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "email",
                                                children: "Email"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "chat",
                                                children: "Chat"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "priority",
                                                children: "Prioridad"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 335,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.others.smartFunnelsAccess",
                                                id: "features.others.smartFunnelsAccess",
                                                checked: formData.features.others.smartFunnelsAccess,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 341,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.others.smartFunnelsAccess",
                                                className: "text-sm text-gray-300",
                                                children: "Acceso a embudos inteligentes"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 340,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "features.others.aiTemplatesAccess",
                                                id: "features.others.aiTemplatesAccess",
                                                checked: formData.features.others.aiTemplatesAccess,
                                                onChange: handleInputChange,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "features.others.aiTemplatesAccess",
                                                className: "text-sm text-gray-300",
                                                children: "Acceso a plantillas IA"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                                lineNumber: 346,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                        lineNumber: 344,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 332,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                                children: editingPlan ? 'Actualizar Plan' : 'Guardar Plan'
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 356,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                        lineNumber: 352,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this),
            !showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12",
                children: plans.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: " md:grid-cols-2 lg:grid-cols-3 gap-8 ",
                    children: plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$planes$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlanCard"], {
                            plan: plan,
                            isAdmin: true,
                            onEdit: ()=>handleEdit(plan),
                            onDelete: ()=>handleDelete(plan._id)
                        }, plan._id, false, {
                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                            lineNumber: 368,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                    lineNumber: 366,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl text-gray-400",
                            children: "No hay planes disponibles en este momento."
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                            lineNumber: 379,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500",
                            children: "Intenta crear uno para empezar."
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                            lineNumber: 380,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                    lineNumber: 378,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
                lineNumber: 364,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/usuarios/admin/planes/page.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e55e845e._.js.map