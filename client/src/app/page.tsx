'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-12 mb-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center py-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1 
            className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transforma tu Negocio con Agentes de IA Inteligentes
          </motion.h1>
          <motion.p 
            className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Nuestros agentes de IA revolucionan tu atención al cliente: <span className="text-blue-400 font-semibold">Analizan</span> cada conversación, <span className="text-purple-400 font-semibold">Personalizan</span> las respuestas según tu marca y <span className="text-green-400 font-semibold">Automatizan</span> todo el proceso de ventas. Como empleados digitales que nunca duermen, atienden por texto, audio y llamadas telefónicas 24/7.
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Comenzar Ahora
            </motion.button>
            <motion.button 
              className="border border-white/20 text-white py-3 px-8 rounded-lg hover:bg-white/5 transition-all duration-300 text-lg font-medium backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ¿Qué es la Inteligencia Artificial? Section */}
      <section className="max-w-7xl mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            ¿Qué es la Inteligencia Artificial?
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            La Inteligencia Artificial (IA) es una tecnología que permite a las máquinas <span className="text-blue-400 font-semibold">aprender, razonar y tomar decisiones</span> como lo haría un humano. En el contexto empresarial, la IA puede procesar grandes cantidades de información, entender el lenguaje natural y responder de manera inteligente y contextual.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aiConcepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <motion.div 
                className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {concept.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">{concept.title}</h3>
              <p className="text-gray-300 leading-relaxed">{concept.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cómo Funciona un Agente AI Section */}
      <section className="max-w-7xl mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ¿Cómo Funciona un Agente AI?
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Un agente AI es como un <span className="text-green-400 font-semibold">empleado digital inteligente</span> que puede mantener conversaciones naturales, entender el contexto y tomar acciones específicas. Funciona las 24 horas del día, aprende continuamente y se adapta a las necesidades de tu negocio.
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {agentSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-center"
                >
                  <div className="h-32 w-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Agente AI en Acción</h3>
                  <p className="text-gray-300">Procesando y respondiendo mensajes inteligentemente</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestros Servicios: Analiza, Personaliza y Automatiza Section */}
      <section className="max-w-7xl mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Nuestros Servicios: Analiza, Personaliza y Automatiza
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transformamos tu atención al cliente con un enfoque integral de <span className="text-blue-400 font-semibold">análisis inteligente</span>, <span className="text-purple-400 font-semibold">personalización avanzada</span> y <span className="text-green-400 font-semibold">automatización completa</span>.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {ourServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${service.bgGradient} rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-300`} />
              <motion.div 
                className={`h-20 w-20 ${service.iconGradient} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                {service.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {service.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Características Principales de Nuestros Agentes AI
          </h3>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <motion.div 
                className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
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
            ¿Listo para llevar tu negocio al siguiente nivel?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No necesitas ser programador. Nuestro equipo configura el agente IA por ti. Si recibes muchos mensajes diarios, ¡esta tecnología es para ti!
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-lg hover:opacity-90 transition-opacity text-lg font-medium">
            Comienza con 15 Días GRATIS
          </button>
        </motion.div>
      </section>
    </div>
  );
}

const aiConcepts = [
  {
    title: 'Procesamiento de Lenguaje Natural',
    description: 'La IA entiende y procesa el lenguaje humano, interpretando intenciones, emociones y contexto en cada mensaje para responder de manera apropiada.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Aprendizaje Automático',
    description: 'Los algoritmos de machine learning permiten que la IA aprenda de cada interacción, mejorando continuamente sus respuestas y adaptándose a nuevas situaciones.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Automatización Inteligente',
    description: 'La IA puede ejecutar tareas complejas automáticamente, desde responder consultas hasta procesar pedidos y gestionar flujos de trabajo completos.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const agentSteps = [
  {
    title: 'Recibe y Analiza',
    description: 'El agente AI recibe mensajes de múltiples canales y analiza el contenido, tono e intención del cliente usando procesamiento de lenguaje natural avanzado.',
  },
  {
    title: 'Procesa y Comprende',
    description: 'Utiliza su base de conocimientos entrenada con información de tu negocio para comprender el contexto y determinar la mejor respuesta posible.',
  },
  {
    title: 'Responde y Actúa',
    description: 'Genera respuestas personalizadas en el tono de tu marca y ejecuta acciones específicas como enviar información, agendar citas o procesar pedidos.',
  },
  {
    title: 'Aprende y Mejora',
    description: 'Cada interacción alimenta su aprendizaje continuo, mejorando la precisión de sus respuestas y adaptándose a nuevas situaciones y necesidades.',
  },
];

const ourServices = [
  {
    title: 'ANALIZA',
    description: 'Nuestros agentes AI analizan cada conversación en tiempo real, identificando patrones, intenciones del cliente y oportunidades de venta.',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconGradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    features: [
      'Análisis de sentimientos en tiempo real',
      'Detección de intenciones de compra',
      'Identificación de clientes potenciales',
      'Métricas avanzadas de conversación'
    ],
  },
  {
    title: 'PERSONALIZA',
    description: 'Cada respuesta se adapta al tono de tu marca, el historial del cliente y el contexto específico de la conversación.',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    iconGradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    features: [
      'Tono de comunicación personalizado',
      'Respuestas adaptadas al cliente',
      'Historial de conversaciones',
      'Segmentación inteligente'
    ],
  },
  {
    title: 'AUTOMATIZA',
    description: 'Automatizamos todo el flujo de atención al cliente, desde la primera consulta hasta el cierre de venta y seguimiento post-venta.',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconGradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    bgGradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    features: [
      'Respuestas automáticas 24/7',
      'Gestión de pedidos y citas',
      'Seguimiento automatizado',
      'Integración con sistemas externos'
    ],
  },
];

const features = [
  {
    title: 'Respuesta Instantánea 24/7',
    description: 'Tu agente IA nunca duerme y puede atender a todos tus clientes al instante, mejorando la satisfacción y no perdiendo oportunidades de venta.',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Comunicación Multicanal Fluida',
    description: 'Integra tu agente IA en Facebook, Instagram, WhatsApp (próximamente), tu sitio web, Mercado Libre, Tiendanube y más. Gestiona todas las conversaciones desde un solo lugar.',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Entrenamiento y Adaptación Continua',
    description: 'El agente aprende de cada conversación y se entrena con tus respuestas reales para hablar como tú y conocer tus productos a fondo, mejorando cada día.',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a4 4 0 00-5.656 0M14 10l-2 2m0 0l-2-2m2 2V6m0 8a2 2 0 100-4 2 2 0 000 4zm-2 4a4 4 0 01-4-4h-2m0 0a4 4 0 014-4V2m0 0a4 4 0 014 4v2m0 0a4 4 0 01-4 4h-2m10 0a4 4 0 00-4-4v-2m0 0a4 4 0 00-4 4v2m0 0a4 4 0 004 4h2" />
      </svg>
    ),
  },
  {
    title: 'Automatización Inteligente de Tareas',
    description: 'Desde responder preguntas frecuentes hasta guiar en compras o agendar servicios. Libera tu tiempo para enfocarte en el crecimiento de tu negocio.',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Integración con Herramientas Clave',
    description: 'Conecta tu agente IA con sistemas externos como CRMs, ERPs y plataformas como Dropi para una gestión de ventas optimizada y centralizada.',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'No Requiere Conocimientos Técnicos',
    description: 'Nuestro equipo configura el agente por ti, adaptado a tu negocio, tono de marca y objetivos. ¡Empieza a automatizar sin complicaciones!',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

const oldFeatures = [
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