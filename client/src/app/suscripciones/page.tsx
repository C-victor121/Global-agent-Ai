'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PlanSelector from '@/components/Payment/PlanSelector';
import SubscriptionManager from '@/components/Payment/SubscriptionManager';
import { FaCreditCard, FaUser, FaSpinner } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';

type TabType = 'plans' | 'subscriptions';

const SubscriptionsPage = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('plans');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubscriptionUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('subscriptions');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-purple-400 mx-auto mb-4" />
          <p className="text-white text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 text-center max-w-md mx-4">
          <FaUser className="text-6xl text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h1>
          <p className="text-gray-300 mb-6">
            Debes iniciar sesión para acceder a las suscripciones y planes de pago.
          </p>
          <button 
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Suscripciones y Planes
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Gestiona tus suscripciones y elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-1 border border-white/20">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'plans'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <FaCreditCard className="w-4 h-4" />
                <span>Planes Disponibles</span>
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'subscriptions'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <FaUser className="w-4 h-4" />
                <span>Mis Suscripciones</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'plans' && (
            <div className="animate-fade-in">
              <PlanSelector onSubscriptionCreated={handleSubscriptionUpdate} />
            </div>
          )}
          
          {activeTab === 'subscriptions' && (
            <div className="animate-fade-in" key={refreshKey}>
              <SubscriptionManager onSubscriptionUpdate={handleSubscriptionUpdate} />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Métodos de Pago Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-green-500/20 rounded-lg p-4 mb-3">
                  <h4 className="font-medium text-white mb-2">PSE (Débito a Cuenta)</h4>
                  <p className="text-gray-300 text-sm">
                    Paga directamente desde tu cuenta bancaria de forma segura
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-lg p-4 mb-3">
                  <h4 className="font-medium text-white mb-2">Efecty</h4>
                  <p className="text-gray-300 text-sm">
                    Paga en efectivo en cualquier punto Efecty del país
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              <p>Próximamente: Pagos con tarjeta de crédito/débito a través de PayPal</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionsPage;