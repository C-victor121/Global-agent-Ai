'use client';

import React, { useState, useEffect } from 'react';
import { Plan, getPlans } from '@/services/plan.service';
import { PlanCard } from '@/components/PlanCard'; // Importar PlanCard


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