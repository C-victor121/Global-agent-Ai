'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Plan, getPlans, createPlan, updatePlan, deletePlan } from '@/services/plan.service';
import Link from 'next/link';
import { PlanCard } from '@/app/planes/page'; // Importar PlanCard

// Interfaz para el formulario, extendiendo Plan pero haciendo algunos campos opcionales para la creación
interface PlanFormData extends Omit<Plan, '_id' | 'createdAt' | 'updatedAt' | 'features'> {
  features: {
    aiAgents: {
      numberOfAgents: number | string; // Permitir string para el input
      allowAudio: boolean;
      allowPhoneVoice: boolean;
    };
    integrations: {
      numberOfPlatforms: number | string;
      dropi: boolean;
      whatsapp: boolean;
      apiAccess: boolean;
    };
    capacity: {
      conversationLimitMonthly: number | string;
      accessToMetrics: boolean;
      advancedDashboard: boolean;
    };
    others: {
      technicalSupport: 'email' | 'chat' | 'priority';
      smartFunnelsAccess: boolean;
      aiTemplatesAccess: boolean;
    };
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
      dropi: false,
      whatsapp: false,
      apiAccess: false,
    },
    capacity: {
      conversationLimitMonthly: 100,
      accessToMetrics: false,
      advancedDashboard: false,
    },
    others: {
      technicalSupport: 'email',
      smartFunnelsAccess: false,
      aiTemplatesAccess: false,
    },
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
    }
  };

  const handleSubmit = async (e: FormEvent) => {
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
                numberOfAgents: Number(formData.features.aiAgents.numberOfAgents),
            },
            integrations: {
                ...formData.features.integrations,
                numberOfPlatforms: Number(formData.features.integrations.numberOfPlatforms),
            },
            capacity: {
                ...formData.features.capacity,
                conversationLimitMonthly: Number(formData.features.capacity.conversationLimitMonthly),
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
    // Asegurarse de que todos los campos numéricos se cargan como string si es necesario para el input type=number
    // o mantenerlos como number y asegurar que el input los maneje bien.
    // Aquí asumimos que la conversión a string para el input se maneja o no es necesaria
    // y que los booleanos se manejan correctamente por los checkboxes.
    setFormData({
        name: plan.name,
        shortDescription: plan.shortDescription,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice || 0, // Asegurar que no sea undefined para el input
        trialPeriodDays: plan.trialPeriodDays,
        requiresCardForTrial: plan.requiresCardForTrial,
        isActive: plan.isActive,
        features: {
            aiAgents: {
                numberOfAgents: String(plan.features.aiAgents.numberOfAgents),
                allowAudio: plan.features.aiAgents.allowAudio,
                allowPhoneVoice: plan.features.aiAgents.allowPhoneVoice,
            },
            integrations: {
                numberOfPlatforms: String(plan.features.integrations.numberOfPlatforms),
                dropi: plan.features.integrations.dropi,
                whatsapp: plan.features.integrations.whatsapp,
                apiAccess: plan.features.integrations.apiAccess,
            },
            capacity: {
                conversationLimitMonthly: String(plan.features.capacity.conversationLimitMonthly),
                accessToMetrics: plan.features.capacity.accessToMetrics,
                advancedDashboard: plan.features.capacity.advancedDashboard,
            },
            others: {
                technicalSupport: plan.features.others.technicalSupport,
                smartFunnelsAccess: plan.features.others.smartFunnelsAccess,
                aiTemplatesAccess: plan.features.others.aiTemplatesAccess,
            },
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

        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

        <button
          onClick={openCreateForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Crear Nuevo Plan
        </button>
      </div> {/* <--- Etiqueta de cierre añadida aquí */} 

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-white">
          <h2 className="text-xl font-semibold mb-3 text-white">{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2 text-white">📝 Datos Generales</h3>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Nombre del Plan:</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div className="mb-4">
            <label htmlFor="shortDescription" className="block text-gray-300 text-sm font-bold mb-2">Descripción Corta:</label>
            <textarea name="shortDescription" id="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="monthlyPrice" className="block text-gray-300 text-sm font-bold mb-2">Precio Mensual (USD):</label>
              <input type="number" name="monthlyPrice" id="monthlyPrice" value={formData.monthlyPrice} onChange={handleInputChange} required min="0" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="annualPrice" className="block text-gray-300 text-sm font-bold mb-2">Precio Anual (USD) (opcional):</label>
              <input type="number" name="annualPrice" id="annualPrice" value={formData.annualPrice} onChange={handleInputChange} min="0" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="trialPeriodDays" className="block text-gray-300 text-sm font-bold mb-2">Periodo de Prueba (días):</label>
                <input type="number" name="trialPeriodDays" id="trialPeriodDays" value={formData.trialPeriodDays} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center mt-6">
                <input type="checkbox" name="requiresCardForTrial" id="requiresCardForTrial" checked={formData.requiresCardForTrial} onChange={handleInputChange} className="mr-2 leading-tight" />
                <label htmlFor="requiresCardForTrial" className="text-sm text-gray-300">Requiere tarjeta para prueba</label>
            </div>
          </div>

          <div className="mb-6">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} className="mr-2 leading-tight" />
            <label htmlFor="isActive" className="text-sm text-gray-300 font-bold">Activo (mostrar en frontend)</label>
          </div>

          <div className="mb-4 text-white">
            <h3 className="text-lg font-medium mb-2 text-white">⚙️ Funcionalidades</h3>
            
            <div className="mb-3 p-3 border border-gray-600 rounded">
                <h4 className="font-semibold mb-1 text-white">🧠 Agentes AI</h4>
                <label htmlFor="features.aiAgents.numberOfAgents" className="block text-sm mb-1 text-gray-300">Número de agentes incluidos:</label>
                <input type="number" name="features.aiAgents.numberOfAgents" id="features.aiAgents.numberOfAgents" value={formData.features.aiAgents.numberOfAgents} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2" />
                <div className="flex items-center mb-1">
                    <input type="checkbox" name="features.aiAgents.allowAudio" id="features.aiAgents.allowAudio" checked={formData.features.aiAgents.allowAudio} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.aiAgents.allowAudio" className="text-sm text-gray-300">Permitir audio</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="features.aiAgents.allowPhoneVoice" id="features.aiAgents.allowPhoneVoice" checked={formData.features.aiAgents.allowPhoneVoice} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.aiAgents.allowPhoneVoice" className="text-sm text-gray-300">Permitir voz telefónica</label>
                </div>
            </div>

            <div className="mb-3 p-3 border border-gray-600 rounded">
                <h4 className="font-semibold mb-1 text-white">📲 Integraciones</h4>
                <label htmlFor="features.integrations.numberOfPlatforms" className="block text-sm mb-1 text-gray-300">Número de plataformas soportadas:</label>
                <input type="number" name="features.integrations.numberOfPlatforms" id="features.integrations.numberOfPlatforms" value={formData.features.integrations.numberOfPlatforms} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2" />
                <div className="flex items-center mb-1">
                    <input type="checkbox" name="features.integrations.dropi" id="features.integrations.dropi" checked={formData.features.integrations.dropi} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.integrations.dropi" className="text-sm text-gray-300">Dropi</label>
                </div>
                <div className="flex items-center mb-1">
                    <input type="checkbox" name="features.integrations.whatsapp" id="features.integrations.whatsapp" checked={formData.features.integrations.whatsapp} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.integrations.whatsapp" className="text-sm text-gray-300">WhatsApp</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="features.integrations.apiAccess" id="features.integrations.apiAccess" checked={formData.features.integrations.apiAccess} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.integrations.apiAccess" className="text-sm text-gray-300">API acceso</label>
                </div>
            </div>

            <div className="mb-3 p-3 border border-gray-600 rounded">
                <h4 className="font-semibold mb-1 text-white">📈 Capacidad</h4>
                <label htmlFor="features.capacity.conversationLimitMonthly" className="block text-sm mb-1 text-gray-300">Límite de conversaciones al mes:</label>
                <input type="number" name="features.capacity.conversationLimitMonthly" id="features.capacity.conversationLimitMonthly" value={formData.features.capacity.conversationLimitMonthly} onChange={handleInputChange} required min="0" className="shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2" />
                <div className="flex items-center mb-1">
                    <input type="checkbox" name="features.capacity.accessToMetrics" id="features.capacity.accessToMetrics" checked={formData.features.capacity.accessToMetrics} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.capacity.accessToMetrics" className="text-sm text-gray-300">Acceso a métricas</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="features.capacity.advancedDashboard" id="features.capacity.advancedDashboard" checked={formData.features.capacity.advancedDashboard} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.capacity.advancedDashboard" className="text-sm text-gray-300">Dashboard avanzado</label>
                </div>
            </div>

            <div className="mb-3 p-3 border border-gray-600 rounded">
                <h4 className="font-semibold mb-1 text-white">🧩 Otros</h4>
                <label htmlFor="features.others.technicalSupport" className="block text-sm mb-1 text-gray-300">Soporte técnico:</label>
                <select name="features.others.technicalSupport" id="features.others.technicalSupport" value={formData.features.others.technicalSupport} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-1 px-2 bg-gray-600 text-white text-sm leading-tight focus:outline-none focus:shadow-outline mb-2">
                    <option value="email">Email</option>
                    <option value="chat">Chat</option>
                    <option value="priority">Prioridad</option>
                </select>
                <div className="flex items-center mb-1">
                    <input type="checkbox" name="features.others.smartFunnelsAccess" id="features.others.smartFunnelsAccess" checked={formData.features.others.smartFunnelsAccess} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.others.smartFunnelsAccess" className="text-sm text-gray-300">Acceso a embudos inteligentes</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="features.others.aiTemplatesAccess" id="features.others.aiTemplatesAccess" checked={formData.features.others.aiTemplatesAccess} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="features.others.aiTemplatesAccess" className="text-sm text-gray-300">Acceso a plantillas IA</label>
                </div>
            </div>

          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {editingPlan ? 'Actualizar Plan' : 'Guardar Plan'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingPlan(null); setFormData(initialFormData); }} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="mt-12">
          {plans.length > 0 ? (
            <div className=" md:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  isAdmin={true}
                  onEdit={() => handleEdit(plan)}
                  onDelete={() => handleDelete(plan._id!)}
                />
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