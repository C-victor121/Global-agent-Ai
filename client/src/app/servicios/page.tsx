'use client'

export default function Servicios() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent animate-gradient">
          Servicios de Automatización AI
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Chatbots Multicanal */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Chatbots Multicanal</h3>
            <p className="text-gray-300 leading-relaxed">Automatiza la comunicación con tus clientes a través de WhatsApp, Facebook, Instagram y más. Respuestas inteligentes 24/7 con integración de IA avanzada.</p>
          </div>

          {/* Análisis de Competencia */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Análisis de Competencia</h3>
            <p className="text-gray-300 leading-relaxed">Monitoreo automático de precios, productos y estrategias de la competencia. Informes detallados y alertas en tiempo real para mantener tu ventaja competitiva.</p>
          </div>

          {/* Automatización de Respuestas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Automatización de Respuestas</h3>
            <p className="text-gray-300 leading-relaxed">Sistema inteligente que aprende de las interacciones previas para proporcionar respuestas precisas y personalizadas a consultas frecuentes de clientes.</p>
          </div>

          {/* Gestión de Ventas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Gestión de Ventas</h3>
            <p className="text-gray-300 leading-relaxed">Optimización del proceso de ventas con seguimiento automático de leads, predicción de conversiones y recomendaciones personalizadas para cerrar ventas.</p>
          </div>
        </div>
      </div>
    </div>
  )
}