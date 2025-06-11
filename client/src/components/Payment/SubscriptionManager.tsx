'use client';

import { useState, useEffect } from 'react';
import { paymentService, Subscription } from '@/services/paymentService';
import { FaSpinner, FaCreditCard, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaPause, FaExclamationTriangle } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface SubscriptionManagerProps {
  onSubscriptionUpdate?: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onSubscriptionUpdate }) => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadSubscriptions();
    }
  }, [session]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getUserSubscriptions();
      if (response.success && response.data) {
        setSubscriptions(response.data);
      } else {
        setError('Error al cargar las suscripciones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta suscripción?')) {
      return;
    }

    try {
      setCancellingId(subscriptionId);
      const response = await paymentService.cancelSubscription(subscriptionId, 'Cancelada por el usuario');
      
      if (response.success) {
        toast.success('Suscripción cancelada exitosamente');
        await loadSubscriptions();
        onSubscriptionUpdate?.();
      } else {
        throw new Error('Error al cancelar la suscripción');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cancelar la suscripción');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'expired':
        return <FaExclamationTriangle className="text-gray-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'paused':
        return <FaPause className="text-orange-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  if (!session?.user) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
        <p className="text-gray-300">Debes iniciar sesión para ver tus suscripciones</p>
      </div>
    );
  }

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
          onClick={loadSubscriptions}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
        <FaCreditCard className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No tienes suscripciones</h3>
        <p className="text-gray-300 mb-4">Suscríbete a un plan para comenzar a usar nuestros servicios</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Mis Suscripciones</h2>
        <button 
          onClick={loadSubscriptions}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <FaSpinner className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="grid gap-6">
        {subscriptions.map((subscription) => {
          const plan = subscription.planId;
          const isActive = subscription.status === 'active';
          const isPending = subscription.status === 'pending';
          const isCancelled = subscription.status === 'cancelled';
          const expiringSoon = isExpiringSoon(subscription.endDate);

          return (
            <div
              key={subscription._id}
              className={`bg-white/10 backdrop-blur-xl rounded-xl p-6 border transition-all ${
                isActive ? 'border-green-500/50' : 
                isPending ? 'border-yellow-500/50' :
                'border-white/20'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(subscription.status)}
                    <h3 className="text-xl font-semibold text-white ml-2">{plan.name}</h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      paymentService.getSubscriptionStatusColor(subscription.status)
                    } bg-current bg-opacity-20`}>
                      {paymentService.getSubscriptionStatusName(subscription.status)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{plan.shortDescription}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Método de pago:</span>
                      <p className="text-white">
                        {paymentService.getPaymentMethodName(subscription.paymentMethod)}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Inicio:</span>
                      <p className="text-white">{formatDate(subscription.startDate)}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Vencimiento:</span>
                      <p className={`${expiringSoon ? 'text-yellow-400' : 'text-white'}`}>
                        {formatDate(subscription.endDate)}
                        {expiringSoon && (
                          <span className="ml-1 text-xs">(Próximo a vencer)</span>
                        )}
                      </p>
                    </div>
                    
                    {subscription.nextBillingDate && isActive && (
                      <div>
                        <span className="text-gray-400">Próximo cobro:</span>
                        <p className="text-white">{formatDate(subscription.nextBillingDate)}</p>
                      </div>
                    )}
                  </div>

                  {subscription.isTrialActive && subscription.trialEndDate && (
                    <div className="mt-3 bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                      <div className="flex items-center">
                        <FaCheckCircle className="text-blue-400 mr-2" />
                        <span className="text-blue-300 text-sm">
                          Período de prueba activo hasta {formatDate(subscription.trialEndDate)}
                        </span>
                      </div>
                    </div>
                  )}

                  {subscription.cancelledAt && (
                    <div className="mt-3 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                      <div className="text-red-300 text-sm">
                        <strong>Cancelada:</strong> {formatDate(subscription.cancelledAt)}
                        {subscription.cancelReason && (
                          <div className="mt-1">
                            <strong>Motivo:</strong> {subscription.cancelReason}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                  {isActive && (
                    <button
                      onClick={() => handleCancelSubscription(subscription._id)}
                      disabled={cancellingId === subscription._id}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {cancellingId === subscription._id ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Cancelando...
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-2" />
                          Cancelar
                        </>
                      )}
                    </button>
                  )}
                  
                  {isPending && (
                    <div className="text-center">
                      <p className="text-yellow-300 text-sm mb-2">Pago pendiente</p>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        Completar pago
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Historial de pagos */}
              {subscription.paymentHistory.length > 0 && (
                <div className="mt-6 border-t border-white/20 pt-4">
                  <h4 className="text-lg font-medium text-white mb-3">Historial de Pagos</h4>
                  <div className="space-y-2">
                    {subscription.paymentHistory.slice(0, 3).map((payment, index) => (
                      <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <div>
                          <span className="text-white font-medium">
                            {paymentService.formatPrice(payment.amount, payment.currency)}
                          </span>
                          <span className="text-gray-400 text-sm ml-2">
                            {formatDate(payment.createdAt)}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                          payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {payment.status === 'approved' ? 'Aprobado' :
                           payment.status === 'pending' ? 'Pendiente' :
                           payment.status === 'rejected' ? 'Rechazado' : 'Cancelado'}
                        </span>
                      </div>
                    ))}
                    {subscription.paymentHistory.length > 3 && (
                      <p className="text-gray-400 text-sm text-center">
                        Y {subscription.paymentHistory.length - 3} pagos más...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionManager;