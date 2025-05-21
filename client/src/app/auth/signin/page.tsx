'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/usuarios',
        redirect: true,
      });
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signIn('facebook', {
        callbackUrl: '/usuarios',
        redirect: true,
      });
    } catch (error) {
      console.error('Error al iniciar sesión con Facebook:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
          >
            Continuar con Google
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continuar con Facebook
          </button>
        </div>
      </div>
    </div>
  );
}