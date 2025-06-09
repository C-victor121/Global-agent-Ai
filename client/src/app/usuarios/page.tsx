'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConnectWhatsAppButton from '@/components/ConnectWhatsApp'; // Importar el componente
import DashboardMetricsComponent from '@/components/Dashboard/DashboardMetrics';
import DetailModal from '@/components/Dashboard/DetailModal';

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'users' | 'generations'>('users');
  const [modalData, setModalData] = useState<any>(null);

  // Verificación del lado del cliente
  useEffect(() => {
    // Eliminar el fragmento #_=_ que Facebook añade a la URL
    if (window.location.hash && window.location.hash === '#_=_') {
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );
    }
    
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const handleCardClick = (type: 'users' | 'generations', data?: any) => {
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <div>
            <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
            Crear Nuevo Agente
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Ver Estadísticas
          </button>
          {/* El componente ConnectWhatsAppButton ya maneja la lógica de conexión y prueba gratuita */}
          <ConnectWhatsAppButton />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-6">Bienvenido, {session?.user?.name}</h2>
      
      {/* Dashboard de Métricas - Solo para Administradores */}
      {isAdmin && (
        <div className="mb-8">
          <DashboardMetricsComponent onCardClick={handleCardClick} />
        </div>
      )}
      
      {/* Información de Perfil y Acciones - Para todos los usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Información de Perfil</h3>
          <div className="space-y-2">
            <p><span className="text-gray-400">Email:</span> {session?.user?.email}</p>
            <p><span className="text-gray-400">ID:</span> {session?.user?.id}</p>
            <p><span className="text-gray-400">Rol:</span> <span className="capitalize">{session?.user?.role}</span></p>
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Actividad Reciente</h3>
          <p className="text-gray-400">No hay actividad reciente para mostrar.</p>
        </div>
      </div>
      
      {/* Acciones simplificadas */}


      {/* Modal de Detalles */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={modalData}
      />
    </div>
  );
}
