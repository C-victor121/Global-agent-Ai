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
"[project]/client/src/app/admin/planes/page.tsx [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/client/src/app/admin/planes/page.tsx'

Unexpected token `div`. Expected jsx identifier`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__12d27163._.js.map