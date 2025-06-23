'use client'

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const coreServices = [
  {
    title: "Analiza",
    description: "Nuestros agentes de IA analizan cada conversación en tiempo real, detectando intenciones, emociones y oportunidades de venta que los humanos podrían pasar por alto.",
    features: [
      "Análisis de sentimientos en tiempo real",
      "Detección automática de intenciones de compra",
      "Identificación de clientes insatisfechos",
      "Análisis predictivo de comportamiento",
      "Métricas avanzadas de conversación"
    ],
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconGradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    bgGradient: "bg-gradient-to-br from-blue-500/20 to-blue-700/20",
    dotColor: "bg-blue-400"
  },
  {
    title: "Personaliza",
    description: "Cada respuesta se adapta automáticamente al tono de tu marca, el historial del cliente y el contexto específico de la conversación para crear experiencias únicas.",
    features: [
      "Adaptación automática al tono de marca",
      "Personalización basada en historial",
      "Respuestas contextuales inteligentes",
      "Segmentación automática de clientes",
      "Comunicación multiidioma"
    ],
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    iconGradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    bgGradient: "bg-gradient-to-br from-purple-500/20 to-purple-700/20",
    dotColor: "bg-purple-400"
  },
  {
    title: "Automatiza",
    description: "Desde la primera interacción hasta el cierre de venta, nuestros agentes automatizan todo el proceso comercial sin perder el toque humano que tus clientes valoran.",
    features: [
      "Automatización completa de ventas",
      "Seguimiento automático de leads",
      "Integración con CRM y sistemas",
      "Escalado inteligente a humanos",
      "Operación 24/7 sin interrupciones"
    ],
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconGradient: "bg-gradient-to-br from-green-500 to-green-700",
    bgGradient: "bg-gradient-to-br from-green-500/20 to-green-700/20",
    dotColor: "bg-green-400"
  }
];

const aiServices = [
  {
    title: "Chatbots Multicanal con IA",
    description: "Agentes inteligentes que operan en WhatsApp, Facebook, Instagram, web y más, manteniendo conversaciones naturales y efectivas.",
    features: [
      "Integración nativa con WhatsApp Business",
      "Soporte para Facebook Messenger e Instagram",
      "Widget web personalizable",
      "API para integraciones custom",
      "Sincronización entre todos los canales"
    ],
    icon: "💬",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "Entrenamiento y Personalización Avanzada",
    description: "Entrenamos tu agente con tu información específica, tono de marca y procesos comerciales únicos.",
    features: [
      "Entrenamiento con documentos empresariales",
      "Adaptación al tono y personalidad de marca",
      "Configuración de flujos de venta personalizados",
      "Integración con bases de conocimiento",
      "Aprendizaje continuo y mejora automática"
    ],
    icon: "🧠",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Integración con Ecosistema de Ventas",
    description: "Conectamos tu agente con CRM, sistemas de inventario, pasarelas de pago y herramientas existentes.",
    features: [
      "Integración con CRM (Salesforce, HubSpot, etc.)",
      "Conexión con sistemas de inventario",
      "Procesamiento de pagos automatizado",
      "Sincronización con calendarios",
      "APIs personalizadas para sistemas propios"
    ],
    icon: "🔗",
    gradient: "from-green-500 to-blue-600"
  },
  {
    title: "Funcionalidades Avanzadas de Ventas",
    description: "Herramientas especializadas para maximizar conversiones y automatizar procesos comerciales complejos.",
    features: [
      "Generación automática de cotizaciones",
      "Seguimiento inteligente de leads",
      "Recuperación automática de carritos abandonados",
      "Upselling y cross-selling inteligente",
      "Análisis predictivo de ventas"
    ],
    icon: "📈",
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Soporte Dedicado y Consultoría",
    description: "Acompañamiento completo desde la implementación hasta la optimización continua de tu agente de IA.",
    features: [
      "Consultoría estratégica personalizada",
      "Implementación guiada paso a paso",
      "Soporte técnico 24/7",
      "Optimización continua basada en datos",
      "Capacitación para tu equipo"
    ],
    icon: "🤝",
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    title: "Capacidades de Voz y Métricas Avanzadas",
    description: "Agentes con capacidades de voz y sistema completo de análisis para optimizar rendimiento.",
    features: [
      "Respuestas por audio en WhatsApp",
      "Transcripción automática de mensajes de voz",
      "Dashboard con métricas en tiempo real",
      "Reportes detallados de conversiones",
      "Análisis de satisfacción del cliente"
    ],
    icon: "🎤",
    gradient: "from-teal-500 to-green-600"
  }
];

export default function Servicios() {
  const [activeService, setActiveService] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Servicios de IA que Revolucionan tu Negocio
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Nuestros agentes de IA no solo responden mensajes: <span className="text-blue-400 font-semibold">Analizan</span> cada conversación para detectar oportunidades, <span className="text-purple-400 font-semibold">Personalizan</span> cada respuesta según tu marca y cliente, y <span className="text-green-400 font-semibold">Automatizan</span> todo el proceso de ventas y atención al cliente 24/7.
          </p>
        </motion.div>
        
        {/* Sección Analiza, Personaliza, Automatiza */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Nuestro Enfoque: Analiza • Personaliza • Automatiza
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transformamos la atención al cliente con un sistema integral que combina análisis inteligente, personalización avanzada y automatización completa.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 group cursor-pointer ${
                  activeService === index 
                    ? 'bg-white/20 border-white/40 scale-105' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                onClick={() => setActiveService(index)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${service.bgGradient} rounded-bl-[100px] -z-10 transition-transform duration-500 ${
                  activeService === index ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                
                <motion.div 
                  className={`h-20 w-20 ${service.iconGradient} rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300`}
                  animate={activeService === index ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: activeService === index ? Infinity : 0 }}
                >
                  {service.icon}
                </motion.div>
                
                <h3 className={`text-3xl font-bold mb-4 transition-all duration-300 ${
                  activeService === index 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' 
                    : 'text-white group-hover:text-blue-400'
                }`}>
                  {service.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-6 text-lg">{service.description}</p>
                
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-400"
                    >
                      <div className={`h-2 w-2 rounded-full mr-3 ${service.dotColor}`} />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sección de Servicios Detallados */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Servicios Completos de IA para tu Negocio
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Desde chatbots inteligentes hasta análisis predictivo, ofrecemos todo lo que necesitas para transformar tu atención al cliente con inteligencia artificial.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20 group hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`h-16 w-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-3xl">{service.icon}</span>
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-6">{service.description}</p>
                
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-400 text-sm"
                    >
                      <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Sección adicional con información sobre IA */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-12 border border-white/20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                ¿Por Qué Elegir Nuestros Agentes de IA?
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                No somos solo otro chatbot. Somos una solución completa que combina inteligencia artificial avanzada con comprensión profunda de tu negocio.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Inteligencia Real",
                  description: "Nuestros agentes entienden contexto, emociones y matices como un humano experimentado.",
                  icon: "🧠",
                  color: "from-blue-500 to-purple-600"
                },
                {
                  title: "Aprendizaje Continuo",
                  description: "Cada conversación mejora el rendimiento y la precisión de las respuestas.",
                  icon: "📚",
                  color: "from-purple-500 to-pink-600"
                },
                {
                  title: "Integración Total",
                  description: "Se conecta perfectamente con tus sistemas existentes sin complicaciones.",
                  icon: "🔗",
                  color: "from-green-500 to-blue-600"
                },
                {
                  title: "ROI Comprobado",
                  description: "Aumenta ventas, reduce costos y mejora satisfacción del cliente simultáneamente.",
                  icon: "📈",
                  color: "from-orange-500 to-red-600"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`h-20 w-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-3xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mantenemos una tarjeta adicional */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Asesoría y Soporte Dedicado</h3>
            <p className="text-gray-300 leading-relaxed">Te ayudamos a configurar tu agente paso a paso. Ofrecemos soporte prioritario 24/7 y asesoría mensual personalizada para optimizar tu flujo de ventas con IA.</p>
          </div>

          {/* Capacidades de Voz y Métricas Avanzadas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Capacidades de Voz y Métricas Avanzadas</h3>
            <p className="text-gray-300 leading-relaxed">Tu agente puede responder por audio e incluso atender llamadas telefónicas (beta). Accede a un dashboard avanzado con estadísticas, informes y métricas de rendimiento.</p>
          </div>

        </div>
      </div>
    </div>
  )
}