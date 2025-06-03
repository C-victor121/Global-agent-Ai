'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Plan, getPlans, createPlan, updatePlan, deletePlan, togglePlanStatus } from '@/services/plan.service'; // Importar togglePlanStatus
import Link from 'next/link';
import { PlanCard } from '@/components/PlanCard'; // Importar PlanCard

interface PlanFormData extends Omit<Plan, '_id' | 'createdAt' | 'updatedAt' | 'features'> {
  features: {
    aiAgents: {
      numberOfAgents: number | string;
      allowAudio: boolean;
      allowPhoneVoice: boolean;
    };
    integrations: {
      numberOfPlatforms: number | string;
      facebookMarketplace: boolean; 
      tiendanube: boolean; 
      dropi: boolean; 
      multiUserDropi: boolean; 
      whatsapp: boolean;
      apiAccess: boolean;
    };
    capacity: {
      conversationLimitMonthly: number | string | 'unlimited'; 
      catalogVerification: 'manual' | 'automatic' | 'none'; 
      accessToMetrics: boolean;
      advancedDashboard: boolean;
      downloadableReports: boolean; 
    };
    others: {
      technicalSupport: 'email' | 'chat' | 'priority'; 
      responseTemplates: 'default' | 'customizable' | 'library'; 
      smartFunnelsAccess: boolean;
      aiTemplatesAccess: boolean; 
      competitorAnalysis: boolean; 
      customerRecovery: boolean; 
      personalizedTraining: boolean; 
      dynamicKnowledgeBase: boolean; 
      monthlyConsulting: boolean; 
      earlyAccessFeatures: boolean; 
    };
  };
  limitations?: {
    noDropiIntegration?: boolean;
    noCompetitorAnalysis?: boolean;
    noCustomerRecovery?: boolean;
    noMetricsOrDashboards?: boolean;
  };
}

const initialFormData: PlanFormData = {
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
      allowPhoneVoice: false,
    },
    integrations: {
      numberOfPlatforms: 1,
      facebookMarketplace: false,
      tiendanube: false,
      dropi: false,
      multiUserDropi: false,
      whatsapp: false,
      apiAccess: false,
    },
    capacity: {
      conversationLimitMonthly: 100,
      catalogVerification: 'none',
      accessToMetrics: false,
      advancedDashboard: false,
      downloadableReports: false,
    },
    others: {
      technicalSupport: 'email', 
      responseTemplates: 'default',
      smartFunnelsAccess: false,
      aiTemplatesAccess: false, 
      competitorAnalysis: false,
      customerRecovery: false,
      personalizedTraining: false,
      dynamicKnowledgeBase: false,
      monthlyConsulting: false,
      earlyAccessFeatures: false,
    },
  },
  limitations: {
    noDropiIntegration: true,
    noCompetitorAnalysis: true,
    noCustomerRecovery: true,
    noMetricsOrDashboards: true,
  },
};

export default function AdminPlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(initialFormData);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await getPlans();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los planes. Inténtalo de nuevo más tarde.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
        parsedValue = value === '' ? '' : parseFloat(value);
    }

    const nameParts = name.split('.');

    if (nameParts.length === 1) {
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    } else if (nameParts.length === 3) { // features.category.property
        const [featureKey, category, property] = nameParts as [string, keyof PlanFormData['features'], string];
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [category]: {
                    ...(prev.features[category] as any),
                    [property]: parsedValue
                }
            }
        }));
    } else if (nameParts.length === 2 && nameParts[0] === 'limitations') { // limitations.property
      const [limitationsKey, property] = nameParts as [string, keyof PlanFormData['limitations']];
      setFormData(prev => ({
        ...prev,
        limitations: {
          ...(prev.limitations || {}), // Asegurar que limitations exista
          [property]: parsedValue
        }
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const planDataToSend = {
        ...formData,
        monthlyPrice: Number(formData.monthlyPrice),
        annualPrice: formData.annualPrice ? Number(formData.annualPrice) : undefined,
        trialPeriodDays: Number(formData.trialPeriodDays),
        features: {
            ...formData.features,
            aiAgents: {
                ...formData.features.aiAgents,
                numberOfAgents: Number(formData.features.aiAgents.numberOfAgents),
            },
            integrations: {
                ...formData.features.integrations,
                numberOfPlatforms: Number(formData.features.integrations.numberOfPlatforms),
            },
            capacity: {
                ...formData.features.capacity,
                conversationLimitMonthly: formData.features.capacity.conversationLimitMonthly === 'unlimited' ? Infinity : Number(formData.features.capacity.conversationLimitMonthly),
            },
        }
    };

    try {
      if (editingPlan) {
        await updatePlan(editingPlan._id!, planDataToSend);
      } else {
        await createPlan(planDataToSend);
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

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    const planFeatures = plan.features as any; 
    const planLimitations = (plan as any).limitations || {}; 

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
          numberOfAgents: String(planFeatures.aiAgents?.numberOfAgents || initialFormData.features.aiAgents.numberOfAgents),
          allowAudio: planFeatures.aiAgents?.allowAudio || initialFormData.features.aiAgents.allowAudio,
          allowPhoneVoice: planFeatures.aiAgents?.allowPhoneVoice || initialFormData.features.aiAgents.allowPhoneVoice,
        },
        integrations: {
          numberOfPlatforms: String(planFeatures.integrations?.numberOfPlatforms || initialFormData.features.integrations.numberOfPlatforms),
          facebookMarketplace: planFeatures.integrations?.facebookMarketplace || initialFormData.features.integrations.facebookMarketplace,
          tiendanube: planFeatures.integrations?.tiendanube || initialFormData.features.integrations.tiendanube,
          dropi: planFeatures.integrations?.dropi || initialFormData.features.integrations.dropi,
          multiUserDropi: planFeatures.integrations?.multiUserDropi || initialFormData.features.integrations.multiUserDropi,
          whatsapp: planFeatures.integrations?.whatsapp || initialFormData.features.integrations.whatsapp,
          apiAccess: planFeatures.integrations?.apiAccess || initialFormData.features.integrations.apiAccess,
        },
        capacity: {
          conversationLimitMonthly: planFeatures.capacity?.conversationLimitMonthly === Infinity ? 'unlimited' : String(planFeatures.capacity?.conversationLimitMonthly || initialFormData.features.capacity.conversationLimitMonthly),
          catalogVerification: planFeatures.capacity?.catalogVerification || initialFormData.features.capacity.catalogVerification,
          accessToMetrics: planFeatures.capacity?.accessToMetrics || initialFormData.features.capacity.accessToMetrics,
          advancedDashboard: planFeatures.capacity?.advancedDashboard || initialFormData.features.capacity.advancedDashboard,
          downloadableReports: planFeatures.capacity?.downloadableReports || initialFormData.features.capacity.downloadableReports,
        },
        others: {
          technicalSupport: planFeatures.others?.technicalSupport || initialFormData.features.others.technicalSupport,
          responseTemplates: planFeatures.others?.responseTemplates || initialFormData.features.others.responseTemplates,
          smartFunnelsAccess: planFeatures.others?.smartFunnelsAccess || initialFormData.features.others.smartFunnelsAccess,
          aiTemplatesAccess: planFeatures.others?.aiTemplatesAccess || initialFormData.features.others.aiTemplatesAccess,
          competitorAnalysis: planFeatures.others?.competitorAnalysis || initialFormData.features.others.competitorAnalysis,
          customerRecovery: planFeatures.others?.customerRecovery || initialFormData.features.others.customerRecovery,
          personalizedTraining: planFeatures.others?.personalizedTraining || initialFormData.features.others.personalizedTraining,
          dynamicKnowledgeBase: planFeatures.others?.dynamicKnowledgeBase || initialFormData.features.others.dynamicKnowledgeBase,
          monthlyConsulting: planFeatures.others?.monthlyConsulting || initialFormData.features.others.monthlyConsulting,
          earlyAccessFeatures: planFeatures.others?.earlyAccessFeatures || initialFormData.features.others.earlyAccessFeatures,
        },
      },
      limitations: {
        noDropiIntegration: planLimitations.noDropiIntegration === undefined ? initialFormData.limitations?.noDropiIntegration : planLimitations.noDropiIntegration,
        noCompetitorAnalysis: planLimitations.noCompetitorAnalysis === undefined ? initialFormData.limitations?.noCompetitorAnalysis : planLimitations.noCompetitorAnalysis,
        noCustomerRecovery: planLimitations.noCustomerRecovery === undefined ? initialFormData.limitations?.noCustomerRecovery : planLimitations.noCustomerRecovery,
        noMetricsOrDashboards: planLimitations.noMetricsOrDashboards === undefined ? initialFormData.limitations?.noMetricsOrDashboards : planLimitations.noMetricsOrDashboards,
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      try {
        await deletePlan(id);
        fetchPlans();
      } catch (err) {
        setError('Error al eliminar el plan.');
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await togglePlanStatus(id);
      fetchPlans(); 
    } catch (err) {
      setError('Error al cambiar el estado del plan.');
      console.error(err);
    }
  };

  const openCreateForm = () => {
    setEditingPlan(null);
    setFormData(initialFormData);
    setShowForm(true);
  };

  if (isLoading) return <div className="container mx-auto p-4"><p>Cargando planes...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-800 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Planes de Membresía</h1>
        <button
          onClick={openCreateForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Crear Nuevo Plan
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-white">
          <h2 className="text-xl font-semibold mb-3 text-white">{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</h2>
          
          <div className="mb-4">
            <label htmlFor="isActive" className="block text-sm font-bold mb-2">Activo</label>
            <input 
              type="checkbox" 
              name="isActive" 
              id="isActive" 
              checked={formData.isActive}
              onChange={handleInputChange} 
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Marcar si el plan está activo y disponible para los usuarios.</span>
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-bold mb-2">Nombre del Plan</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="mb-4">
            <label htmlFor="shortDescription" className="block text-sm font-bold mb-2">Descripción Corta</label>
            <textarea name="shortDescription" id="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required rows={3} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="monthlyPrice" className="block text-sm font-bold mb-2">Precio Mensual (USD)</label>
              <input type="number" name="monthlyPrice" id="monthlyPrice" value={formData.monthlyPrice} onChange={handleInputChange} required min="0" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="annualPrice" className="block text-sm font-bold mb-2">Precio Anual (USD - opcional)</label>
              <input type="number" name="annualPrice" id="annualPrice" value={formData.annualPrice || ''} onChange={handleInputChange} min="0" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="trialPeriodDays" className="block text-sm font-bold mb-2">Días de Prueba Gratuita</label>
              <input type="number" name="trialPeriodDays" id="trialPeriodDays" value={formData.trialPeriodDays} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="requiresCardForTrial" id="requiresCardForTrial" checked={formData.requiresCardForTrial} onChange={handleInputChange} className="mr-2 leading-tight" />
              <label htmlFor="requiresCardForTrial" className="text-sm">¿Requiere tarjeta para la prueba?</label>
            </div>
          </div>

          <fieldset className="border border-gray-600 p-4 rounded mb-6">
            <legend className="text-lg font-semibold px-2">Agentes IA</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="features.aiAgents.numberOfAgents" className="block text-sm font-bold mb-1">Número de Agentes</label>
                <input type="number" name="features.aiAgents.numberOfAgents" id="features.aiAgents.numberOfAgents" value={formData.features.aiAgents.numberOfAgents} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.aiAgents.allowAudio" id="features.aiAgents.allowAudio" checked={formData.features.aiAgents.allowAudio} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.aiAgents.allowAudio" className="text-sm">Permitir Audio</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.aiAgents.allowPhoneVoice" id="features.aiAgents.allowPhoneVoice" checked={formData.features.aiAgents.allowPhoneVoice} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.aiAgents.allowPhoneVoice" className="text-sm">Permitir Voz Telefónica</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-600 p-4 rounded mb-6">
            <legend className="text-lg font-semibold px-2">Integraciones</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="features.integrations.numberOfPlatforms" className="block text-sm font-bold mb-1">Número de Plataformas</label>
                <input type="number" name="features.integrations.numberOfPlatforms" id="features.integrations.numberOfPlatforms" value={formData.features.integrations.numberOfPlatforms} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.integrations.facebookMarketplace" id="features.integrations.facebookMarketplace" checked={formData.features.integrations.facebookMarketplace} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.integrations.facebookMarketplace" className="text-sm">Facebook Marketplace</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.integrations.tiendanube" id="features.integrations.tiendanube" checked={formData.features.integrations.tiendanube} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.integrations.tiendanube" className="text-sm">Tiendanube</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.integrations.dropi" id="features.integrations.dropi" checked={formData.features.integrations.dropi} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.integrations.dropi" className="text-sm">Dropi</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.integrations.multiUserDropi" id="features.integrations.multiUserDropi" checked={formData.features.integrations.multiUserDropi} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.integrations.multiUserDropi" className="text-sm">Dropi Multi-usuario</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.integrations.whatsapp" id="features.integrations.whatsapp" checked={formData.features.integrations.whatsapp} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.integrations.whatsapp" className="text-sm">WhatsApp</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.integrations.apiAccess" id="features.integrations.apiAccess" checked={formData.features.integrations.apiAccess} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.integrations.apiAccess" className="text-sm">Acceso API</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-600 p-4 rounded mb-6">
            <legend className="text-lg font-semibold px-2">Capacidad</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="features.capacity.conversationLimitMonthly" className="block text-sm font-bold mb-1">Límite de Conversaciones Mensuales</label>
                <input type="text" name="features.capacity.conversationLimitMonthly" id="features.capacity.conversationLimitMonthly" value={formData.features.capacity.conversationLimitMonthly} onChange={handleInputChange} required placeholder="Ej: 1000 o 'unlimited'" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label htmlFor="features.capacity.catalogVerification" className="block text-sm font-bold mb-1">Verificación de Catálogo</label>
                <select name="features.capacity.catalogVerification" id="features.capacity.catalogVerification" value={formData.features.capacity.catalogVerification} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="none">Ninguna</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automática</option>
                </select>
              </div>
              <div className="flex items-center pt-2">
                <input type="checkbox" name="features.capacity.accessToMetrics" id="features.capacity.accessToMetrics" checked={formData.features.capacity.accessToMetrics} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.capacity.accessToMetrics" className="text-sm">Acceso a Métricas</label>
              </div>
              <div className="flex items-center pt-2">
                <input type="checkbox" name="features.capacity.advancedDashboard" id="features.capacity.advancedDashboard" checked={formData.features.capacity.advancedDashboard} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.capacity.advancedDashboard" className="text-sm">Dashboard Avanzado</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="features.capacity.downloadableReports" id="features.capacity.downloadableReports" checked={formData.features.capacity.downloadableReports} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.capacity.downloadableReports" className="text-sm">Reportes Descargables</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-600 p-4 rounded mb-6">
            <legend className="text-lg font-semibold px-2">Otros Beneficios</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="features.others.technicalSupport" className="block text-sm font-bold mb-1">Soporte Técnico</label>
                <select name="features.others.technicalSupport" id="features.others.technicalSupport" value={formData.features.others.technicalSupport} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="email">Email</option>
                  <option value="chat">Chat</option>
                  <option value="priority">Prioritario</option>
                </select>
              </div>
              <div>
                <label htmlFor="features.others.responseTemplates" className="block text-sm font-bold mb-1">Plantillas de Respuesta</label>
                <select name="features.others.responseTemplates" id="features.others.responseTemplates" value={formData.features.others.responseTemplates} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="default">Por Defecto</option>
                  <option value="customizable">Personalizables</option>
                  <option value="library">Biblioteca de Plantillas Personalizadas</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.smartFunnelsAccess" id="features.others.smartFunnelsAccess" checked={formData.features.others.smartFunnelsAccess} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.smartFunnelsAccess" className="text-sm">Acceso a Embudos Inteligentes</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.aiTemplatesAccess" id="features.others.aiTemplatesAccess" checked={formData.features.others.aiTemplatesAccess} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.aiTemplatesAccess" className="text-sm">Acceso a Plantillas IA</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.competitorAnalysis" id="features.others.competitorAnalysis" checked={formData.features.others.competitorAnalysis} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.competitorAnalysis" className="text-sm">Análisis de Competencia</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.customerRecovery" id="features.others.customerRecovery" checked={formData.features.others.customerRecovery} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.customerRecovery" className="text-sm">Recuperación de Clientes</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.personalizedTraining" id="features.others.personalizedTraining" checked={formData.features.others.personalizedTraining} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.personalizedTraining" className="text-sm">Entrenamiento Personalizado</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.dynamicKnowledgeBase" id="features.others.dynamicKnowledgeBase" checked={formData.features.others.dynamicKnowledgeBase} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.dynamicKnowledgeBase" className="text-sm">Base de Conocimiento Dinámica</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.monthlyConsulting" id="features.others.monthlyConsulting" checked={formData.features.others.monthlyConsulting} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.monthlyConsulting" className="text-sm">Consultoría Mensual</label>
              </div>
              <div className="flex items-center pt-5">
                <input type="checkbox" name="features.others.earlyAccessFeatures" id="features.others.earlyAccessFeatures" checked={formData.features.others.earlyAccessFeatures} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="features.others.earlyAccessFeatures" className="text-sm">Acceso Anticipado a Funciones</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-600 p-4 rounded mb-6">
            <legend className="text-lg font-semibold px-2">Limitaciones (para planes básicos)</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input type="checkbox" name="limitations.noDropiIntegration" id="limitations.noDropiIntegration" checked={formData.limitations?.noDropiIntegration || false} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="limitations.noDropiIntegration" className="text-sm">Sin Integración Dropi</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="limitations.noCompetitorAnalysis" id="limitations.noCompetitorAnalysis" checked={formData.limitations?.noCompetitorAnalysis || false} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="limitations.noCompetitorAnalysis" className="text-sm">Sin Análisis de Competencia</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="limitations.noCustomerRecovery" id="limitations.noCustomerRecovery" checked={formData.limitations?.noCustomerRecovery || false} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="limitations.noCustomerRecovery" className="text-sm">Sin Recuperación de Clientes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="limitations.noMetricsOrDashboards" id="limitations.noMetricsOrDashboards" checked={formData.limitations?.noMetricsOrDashboards || false} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="limitations.noMetricsOrDashboards" className="text-sm">Sin Métricas ni Dashboards</label>
              </div>
            </div>
          </fieldset>
          
          {/* Botones del formulario */}
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {editingPlan ? 'Actualizar Plan' : 'Guardar Plan'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingPlan(null); setFormData(initialFormData); }} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="mt-12">
          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan._id} className={`bg-slate-700 shadow-xl rounded-lg p-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-2xl ${!plan.isActive ? 'opacity-60 border-dashed border-gray-500' : 'border-transparent'} border-2`}>
                  <PlanCard
                    plan={plan}
                    isAdmin={true} 
                  />
                  <div className="mt-4 pt-4 border-t border-slate-600 flex flex-col space-y-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleStatus(plan._id!)}
                      className={`w-full font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105 ${plan.isActive ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {plan.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id!)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-300 transform hover:scale-105"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No hay planes disponibles en este momento.</p>
              <p className="text-gray-500">Intenta crear uno para empezar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}