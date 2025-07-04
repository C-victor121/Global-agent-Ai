'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { logout } from '@/lib/auth';

/**
 * Componente para depurar el estado de autenticación
 * Solo visible en desarrollo
 */
export default function AuthDebug() {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  
  // Función para manejar el cierre de sesión desde el panel de depuración
  const handleDebugLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError(null);
      console.log('[AuthDebug] Iniciando cierre de sesión desde panel de depuración...');
      
      const result = await logout('/');
      
      if (!result.success) {
        console.error('[AuthDebug] Error al cerrar sesión:', result.error);
        setLogoutError(result.error || 'Error desconocido al cerrar sesión');
      } else {
        console.log('[AuthDebug] Sesión cerrada correctamente desde panel de depuración');
      }
    } catch (error) {
      console.error('[AuthDebug] Error inesperado al cerrar sesión:', error);
      setLogoutError('Error inesperado al cerrar sesión');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${isExpanded ? 'bg-red-600' : 'bg-blue-600'} text-white shadow-lg`}
      >
        {isExpanded ? 'Ocultar' : 'Depurar Auth'}
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl max-w-md max-h-96 overflow-auto">
          <h3 className="text-lg font-semibold text-white mb-2">Estado de Autenticación</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Estado:</span>{' '}
              <span className={`font-medium ${status === 'authenticated' ? 'text-green-400' : status === 'loading' ? 'text-yellow-400' : 'text-red-400'}`}>
                {status}
              </span>
            </div>

            {session && (
              <>
                <div>
                  <span className="text-gray-400">Usuario:</span>{' '}
                  <span className="text-white">{session.user?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>{' '}
                  <span className="text-white">{session.user?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">ID:</span>{' '}
                  <span className="text-white">{session.user?.id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rol:</span>{' '}
                  <span className="text-white">{session.user?.role || 'N/A'}</span>
                </div>
                <div className="mt-2">
                  <details>
                    <summary className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors">
                      Ver sesión completa
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-900 rounded text-xs text-gray-300 overflow-auto">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </details>
                </div>
                
                {/* Botón de cierre de sesión para depuración */}
                <div className="mt-4">
                  <button
                    onClick={handleDebugLogout}
                    disabled={isLoggingOut}
                    className={`px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="inline-block mr-1 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></span>
                        Cerrando sesión...
                      </>
                    ) : (
                      'Cerrar sesión (debug)'
                    )}
                  </button>
                </div>
                
                {/* Mostrar error de cierre de sesión si existe */}
                {logoutError && (
                  <div className="mt-2 text-xs text-red-400">
                    Error: {logoutError}
                  </div>
                )}
              </>
            )}

            {!session && status !== 'loading' && (
              <div className="text-red-400">No hay sesión activa</div>
            )}

            {status === 'loading' && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-yellow-400">Cargando sesión...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}