'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) {
      router.push('/auth/signin');
    }
  }, [error, router]);

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'AccessDenied':
        return 'No tienes permiso para acceder a esta página. Por favor, verifica tus credenciales.';
      case 'Configuration':
        return 'Hay un problema con la configuración del servidor. Por favor, inténtalo más tarde.';
      case 'Verification':
        return 'El enlace de verificación ha expirado o ya ha sido usado.';
      default:
        return 'Ha ocurrido un error durante la autenticación. Por favor, inténtalo de nuevo.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Error de Autenticación
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error ? getErrorMessage(error) : 'Redirigiendo...'}
          </p>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Volver a intentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}