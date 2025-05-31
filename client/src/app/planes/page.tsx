'use client';

import React, { useState, useEffect } from 'react';
import { Plan, getPlans } from '@/services/plan.service';
import Link from 'next/link';

const PlanCard: React.FC<{ plan: Plan; isAdmin?: boolean; onEdit?: (plan: Plan) => void; onDelete?: (planId: string) => void; }> = ({ plan, isAdmin = false, onEdit, onDelete }) => {
  const cardClasses = !plan.isActive
    ? 'bg-slate-700 shadow-lg rounded-xl p-6 flex flex-col justify-between m-4 w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-md opacity-50 cursor-not-allowed border border-slate-600'
    : 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl rounded-xl p-6 flex flex-col justify-between m-4 w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-slate-700 hover:border-blue-500';

  const titleClasses = !plan.isActive
    ? 'text-2xl font-bold text-gray-500 mb-3'
    : 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3';

  const priceClasses = !plan.isActive
    ? 'text-4xl font-extrabold text-gray-600'
    : 'text-4xl font-extrabold text-white';

  const featureTextColor = !plan.isActive ? 'text-gray-500' : 'text-gray-400';
  const checkColor = !plan.isActive ? 'text-gray-600' : 'text-green-500';

  return (
    <div className={cardClasses}>
      <div>
        <h3 className={titleClasses}>{plan.name} {!plan.isActive && <span className="text-sm font-normal">(Próximamente)</span>}</h3>
        <p className={`text-gray-400 mb-4 h-24 overflow-y-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800 ${!plan.isActive ? 'text-gray-500' : ''}`}>{plan.shortDescription}</p>
        <div className="my-4">
          <span className={priceClasses}>${plan.monthlyPrice.toFixed(2)}</span>
          <span className={`text-sm ${!plan.isActive ? 'text-gray-600' : 'text-gray-500'}`}>/mes</span>
        </div>
        {plan.annualPrice !== null && plan.annualPrice !== undefined && plan.annualPrice > 0 && (
          <div className={`mt-1 text-xs ${!plan.isActive ? 'text-gray-600' : 'text-gray-500'}`}>
            o ${plan.annualPrice.toFixed(2)}/año (ahorra ${ (((plan.monthlyPrice * 12) - plan.annualPrice) / (plan.monthlyPrice * 12) * 100).toFixed(0) }%) 
          </div>
        )}
        <ul className={`${featureTextColor} space-y-2 mb-6 text-sm flex-grow`}>
          <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span>{plan.features.aiAgents.numberOfAgents} Agente(s) AI</li>
          <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span>{plan.features.integrations.numberOfPlatforms} Integracion(es)</li>
          <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span>{plan.features.capacity.conversationLimitMonthly === Infinity ? 'Ilimitadas' : plan.features.capacity.conversationLimitMonthly} Conversaciones/mes</li>
          {plan.features.aiAgents.allowAudio && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Audio permitido</li>}
          {plan.features.aiAgents.allowPhoneVoice && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Voz telefónica permitida</li>}
          {plan.features.integrations.whatsapp && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Integración WhatsApp</li>}
          {plan.features.integrations.dropi && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Integración Dropi</li>}
          {plan.features.integrations.apiAccess && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Acceso API</li>}
          {plan.features.capacity.accessToMetrics && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Acceso a Métricas</li>}
          {plan.features.capacity.advancedDashboard && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Dashboard Avanzado</li>}
          <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Soporte: {plan.features.others.technicalSupport}</li>
          {plan.features.others.smartFunnelsAccess && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Acceso a Embudos Inteligentes</li>}
          {plan.features.others.aiTemplatesAccess && <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> Acceso a Plantillas IA</li>}
          {plan.trialPeriodDays !== null && plan.trialPeriodDays > 0 && (
            <li className="flex items-center"><span className={`${checkColor} mr-2`}>✓</span> {plan.trialPeriodDays} días de prueba</li>
          )}
        </ul>
      </div>
      {!isAdmin ? (
        !plan.isActive ? (
          <button 
            disabled 
            className="block w-full bg-gray-600 text-gray-400 font-semibold py-3 px-4 rounded-lg text-center cursor-not-allowed shadow-md"
          >
            Próximamente
          </button>
        ) : (
          <Link href={`/subscribe/${plan._id}`} legacyBehavior>
            <a className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              Seleccionar Plan
            </a>
          </Link>
        )
      ) : (
        <div className="mt-auto pt-4 flex space-x-2">
          <button 
            onClick={() => onEdit && onEdit(plan)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105"
            disabled={!plan.isActive} // Deshabilitar si no está activo, aunque el admin puede querer editarlo igual
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete && onDelete(plan._id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105"
          >
            Eliminar
          </button>
          {/* El botón de activar/desactivar ya está en la página de admin */}
        </div>
      )}
    </div>
  );
};

// Export PlanCard to be used in admin page
export { PlanCard };

export default function PlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const data = await getPlans();
        setPlans(data); // Mostrar todos los planes, activos e inactivos
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <p className="text-white text-xl">Cargando planes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  const activePlans = plans.filter(plan => plan.isActive);
  const inactivePlans = plans.filter(plan => !plan.isActive);

  if (plans.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Nuestros Planes</h1>
        <p className="text-xl mb-4">Actualmente no hay planes disponibles.</p>
        <p className="text-gray-400">Por favor, vuelve a intentarlo más tarde.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 sm:text-6xl md:text-7xl">
            Nuestras Membresías de Asistente Virtual AI para Ventas
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-gray-400 sm:text-xl md:mt-6 md:text-2xl md:max-w-3xl">
            Diseñados para cada etapa de tu negocio, desde emprendedores hasta grandes equipos. Todos los planes incluyen la configuración inicial por nuestro equipo y la capacidad de aprender de tus interacciones.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch -m-4">
          {/* Renderizar primero los planes activos */}
          {activePlans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
          {/* Luego renderizar los planes inactivos */}
          {inactivePlans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}