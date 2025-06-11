'use client';

import { useState, useEffect } from 'react';
import { paymentService, Plan } from '@/services/paymentService';
import { FaCheck, FaSpinner, FaCreditCard, FaUniversity, FaStore } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface PlanSelectorProps {
  onPlanSelect?: (plan: Plan, billingType: 'monthly' | 'annual') => void;
  onSubscriptionCreated?: () => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ onPlanSelect, onSubscriptionCreated }) => {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'pse' | 'efecty'>('pse');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getPlans();
      if (response && Array.isArray(response)) {
        setPlans(response.filter(plan => plan.isActive));
      } else {
        setError('Error al cargar los planes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
    onPlanSelect?.(plan, billingType);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !session?.user) {
      toast.error('Debes seleccionar un plan y estar autenticado');
      return;
    }

    try {
      setProcessingPayment(true);
      
      const subscriptionData = {
        planId: selectedPlan._id,
        paymentMethod,
        billingType,
        userIdentification: {
          type: 'CC' as const,
          number: '12345678' // Este debería venir de un formulario
        }
      };

      const response = await paymentService.createSubscription(subscriptionData);
      
      if (response.success && response.data) {
        toast.success('Redirigiendo a MercadoPago...');
        // Redirigir a MercadoPago
        paymentService.redirectToPayment(response.data.payment.initPoint);
        onSubscriptionCreated?.(); // Llamar al callback
      } else {
        throw new Error('Error al crear la suscripción');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      toast.error(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getPrice = (plan: Plan) => {
    return billingType === 'monthly' ? plan.monthlyPrice : (plan.annualPrice || plan.monthlyPrice * 12);
  };

  const getDiscount = (plan: Plan) => {
    if (billingType === 'annual' && plan.annualPrice) {
      return paymentService.calculateAnnualDiscount(plan.monthlyPrice, plan.annualPrice);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-300 mb-4">{error}</p>
        <button 
          onClick={loadPlans}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Elige tu Plan</h2>
        <p className="text-gray-300 text-lg">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>

      {/* Toggle de facturación */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-white/20">
          <button
            onClick={() => setBillingType('monthly')}
            className={`px-6 py-2 rounded-lg transition-all ${
              billingType === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingType('annual')}
            className={`px-6 py-2 rounded-lg transition-all ${
              billingType === 'annual'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Anual
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Ahorra hasta 20%
            </span>
          </button>
        </div>
      </div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const price = getPrice(plan);
          const discount = getDiscount(plan);
          const isSelected = selectedPlan?._id === plan._id;

          return (
            <div
              key={plan._id}
              className={`bg-white/10 backdrop-blur-xl rounded-xl p-6 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/20 scale-105'
                  : 'border-white/20 hover:border-purple-300 hover:bg-white/15'
              }`}
              onClick={() => handlePlanSelection(plan)}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{plan.shortDescription}</p>
                
                <div className="mb-4">
                  {discount > 0 && (
                    <div className="text-sm text-green-400 mb-1">
                      Ahorra {discount}%
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white">
                    {paymentService.formatPrice(price)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    por {billingType === 'monthly' ? 'mes' : 'año'}
                  </div>
                </div>

                {plan.trialPeriodDays > 0 && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2 mb-4">
                    <span className="text-green-300 text-sm">
                      {plan.trialPeriodDays} días de prueba gratis
                    </span>
                  </div>
                )}
              </div>

              {/* Características del plan */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <FaCheck className="text-green-400 mr-2 flex-shrink-0" />
                  {plan.features.aiAgents.numberOfAgents} agentes de IA
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaCheck className="text-green-400 mr-2 flex-shrink-0" />
                  {plan.features.capacity.conversationLimitMonthly.toLocaleString()} conversaciones/mes
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaCheck className="text-green-400 mr-2 flex-shrink-0" />
                  {plan.features.integrations.numberOfPlatforms} integraciones
                </div>
                {plan.features.integrations.whatsapp && (
                  <div className="flex items-center text-sm text-gray-300">
                    <FaCheck className="text-green-400 mr-2 flex-shrink-0" />
                    Integración WhatsApp
                  </div>
                )}
                {plan.features.capacity.accessToMetrics && (
                  <div className="flex items-center text-sm text-gray-300">
                    <FaCheck className="text-green-400 mr-2 flex-shrink-0" />
                    Acceso a métricas
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="border-t border-white/20 pt-4">
                  <div className="text-center text-purple-300 text-sm">
                    ✓ Plan seleccionado
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sección de método de pago */}
      {selectedPlan && (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Método de Pago</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('pse')}
              className={`p-4 rounded-lg border transition-all ${
                paymentMethod === 'pse'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <FaUniversity className="text-2xl text-blue-400 mr-3" />
                <span className="text-white font-medium">PSE</span>
              </div>
              <p className="text-gray-300 text-sm text-center">
                Débito a cuenta corriente o ahorros
              </p>
            </button>

            <button
              onClick={() => setPaymentMethod('efecty')}
              className={`p-4 rounded-lg border transition-all ${
                paymentMethod === 'efecty'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <FaStore className="text-2xl text-green-400 mr-3" />
                <span className="text-white font-medium">Efecty</span>
              </div>
              <p className="text-gray-300 text-sm text-center">
                Pago en efectivo en puntos Efecty
              </p>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubscribe}
              disabled={processingPayment || !session?.user}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
            >
              {processingPayment ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <FaCreditCard className="mr-2" />
                  Suscribirse por {paymentService.formatPrice(getPrice(selectedPlan))}
                </>
              )}
            </button>
            
            {!session?.user && (
              <p className="text-gray-400 text-sm mt-2">
                Debes iniciar sesión para suscribirte
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSelector;