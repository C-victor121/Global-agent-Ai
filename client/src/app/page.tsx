'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen py-12 mb-12  px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center py-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent  ">
            Potencia tus Ventas con IA
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
            Automatiza, optimiza y escala tu proceso de ventas con nuestros agentes de IA inteligentes
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-lg hover:opacity-90 transition-opacity text-lg font-medium">
              Comenzar Ahora
            </button>
            <button className="border border-white/20 text-white py-3 px-8 rounded-lg hover:bg-white/5 transition-colors text-lg font-medium">
              Ver Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Características Section */}
      <section className="max-w-7xl mx-auto py-24 ">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/20"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Estadísticas Section */}
      <section className="max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-12 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            ¿Listo para revolucionar tus ventas?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a cientos de empresas que ya están aprovechando el poder de la IA
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-lg hover:opacity-90 transition-opacity text-lg font-medium">
            Empieza tu Prueba Gratuita
          </button>
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  {
    title: 'Automatización Inteligente',
    description: 'Automatiza tareas repetitivas y procesos de ventas con IA avanzada',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Análisis Predictivo',
    description: 'Predice comportamientos de clientes y optimiza estrategias de ventas',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Integración Multicanal',
    description: 'Conecta con tus clientes a través de múltiples plataformas de manera unificada',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const stats = [
  {
    value: '+50%',
    label: 'Aumento en Conversiones',
  },
  {
    value: '24/7',
    label: 'Atención al Cliente',
  },
  {
    value: '-40%',
    label: 'Reducción de Costos Operativos',
  },
];