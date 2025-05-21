'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bienvenido, {session?.user?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Información de Perfil</h3>
          <div className="space-y-2">
            <p><span className="text-gray-400">Email:</span> {session?.user?.email}</p>
            <p><span className="text-gray-400">ID:</span> {session?.user?.id}</p>
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Actividad Reciente</h3>
          <p className="text-gray-400">No hay actividad reciente para mostrar.</p>
        </div>
      </div>
      

      {/* Acciones simplificadas */}
      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
            Crear Nuevo Agente
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Ver Estadísticas
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
            Configurar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
