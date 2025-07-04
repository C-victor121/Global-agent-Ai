'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginModal from '@/components/LoginModal';
import { isAuthenticated, loginWithProvider } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener la URL de callback de los parámetros de búsqueda
  const callbackUrlParam = searchParams.get('callbackUrl');
  const callbackUrl = callbackUrlParam ? decodeURIComponent(callbackUrlParam) : '/usuarios';
  
  console.log('[SignInPage] CallbackUrl:', callbackUrl);
  
  // Manejar errores de autenticación
  const authError = searchParams.get('error');

  useEffect(() => {
    console.log('[SignInPage] Estado de autenticación:', status);
    console.log('[SignInPage] Sesión:', session);
    
    // Limpiar el fragmento #_=_ que Facebook añade a la URL
    if (typeof window !== 'undefined' && window.location.hash === '#_=_') {
      console.log('[SignInPage] Limpiando fragmento #_=_ de Facebook');
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );
    }
    
    // Si hay un error de autenticación, mostrarlo
    if (authError) {
      console.log('[SignInPage] Error de autenticación:', authError);
      switch (authError) {
        case 'OAuthSignin':
          setError('Error al iniciar el proceso de autenticación con el proveedor.');
          break;
        case 'OAuthCallback':
          setError('Error al procesar la respuesta del proveedor de autenticación.');
          break;
        case 'OAuthCreateAccount':
          setError('Error al crear una cuenta con el proveedor de autenticación.');
          break;
        case 'EmailCreateAccount':
          setError('Error al crear una cuenta con el correo electrónico proporcionado.');
          break;
        case 'Callback':
          setError('Error en el proceso de autenticación.');
          break;
        case 'OAuthAccountNotLinked':
          setError('La cuenta de correo electrónico ya está asociada con otro proveedor.');
          break;
        case 'EmailSignin':
          setError('Error al enviar el correo electrónico de inicio de sesión.');
          break;
        case 'CredentialsSignin':
          setError('Las credenciales proporcionadas no son válidas.');
          break;
        default:
          setError(`Error durante la autenticación: ${authError}`);
      }
    }
  }, [authError]);
  
  // Efecto separado para manejar la redirección cuando el usuario está autenticado
  useEffect(() => {
    // Solo redirigir cuando la sesión esté cargada (no en estado 'loading')
    if (status !== 'loading') {
      // Si el usuario ya está autenticado, redirigir a la página de callback
      if (isAuthenticated(session)) {
        console.log('[SignInPage] Usuario autenticado, redirigiendo a:', callbackUrl);
        router.push(callbackUrl);
      } else {
        console.log('[SignInPage] Usuario no autenticado, mostrando modal de inicio de sesión');
      }
    }
  }, [session, status, router, callbackUrl]);

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    console.log('[SignInPage] Modal cerrado por el usuario');
    setIsModalOpen(false);
    
    // Si hay una URL de callback que no es /usuarios, redirigir a la página principal
    // De lo contrario, redirigir a la página principal
    if (callbackUrl && callbackUrl !== '/usuarios') {
      console.log('[SignInPage] Redirigiendo a la URL anterior:', callbackUrl);
      router.push(callbackUrl);
    } else {
      console.log('[SignInPage] Redirigiendo a la página principal');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500/20 border border-red-500/50 text-red-100 px-6 py-3 rounded-lg z-50">
          {error}
        </div>
      )}
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}