"use client";

import { useState, useCallback } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { ZodError } from 'zod';
import { loginSchema, registerSchema, forgotPasswordSchema } from '@/shared/validations/auth.schema';

import { signIn, useSession } from 'next-auth/react';
import apiClient from '@/services/api';
import { loginWithProvider } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  // NO usar early return antes de los hooks. Definir callbacks primero.
  const handleGoogleLogin = useCallback(async () => {
    try {
      setErrors({});
      setIsGoogleLoading(true);
      console.log('[LoginModal] Iniciando sesión con Google...');
      
      const result = await loginWithProvider('google', '/usuarios');
      
      if (!result.success && result.error) {
        console.error('[LoginModal] Error al iniciar sesión con Google:', result.error);
        setErrors({ auth: result.error });
      }
    } catch (error) {
      console.error('[LoginModal] Error inesperado al iniciar sesión con Google:', error);
      setErrors({ auth: 'Error inesperado al iniciar sesión con Google' });
    } finally {
      setIsGoogleLoading(false);
    }
  }, []);

  const handleFacebookLogin = useCallback(async () => {
    try {
      setErrors({});
      setIsFacebookLoading(true);
      console.log('[LoginModal] Iniciando sesión con Facebook...');
      
      const result = await loginWithProvider('facebook', '/usuarios');
      
      if (!result.success && result.error) {
        console.error('[LoginModal] Error al iniciar sesión con Facebook:', result.error);
        setErrors({ auth: result.error });
      }
    } catch (error) {
      console.error('[LoginModal] Error inesperado al iniciar sesión con Facebook:', error);
      setErrors({ auth: 'Error inesperado al iniciar sesión con Facebook' });
    } finally {
      setIsFacebookLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsCredentialsLoading(true);

    try {
      switch (activeTab) {
        case 'login':
          await loginSchema.parseAsync({ email, password });
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/usuarios'
          });
          
          if (result?.ok) {
            // Redirección manual después de inicio de sesión exitoso
            window.location.href = '/usuarios';
            return;
          }
          // Manejar error de autenticación
          if (result?.error) {
            console.error('Error de autenticación:', result.error);
            // Usar el mensaje de error devuelto por NextAuth/backend
            setErrors({ auth: result.error }); 
          } else {
            onClose();
          }
          break;
        case 'register':
          await registerSchema.parseAsync({ name, email, password, confirmPassword });
          
          try {
            // Usar el cliente de API configurado para apuntar a https://globalsolarco.shop/api
            const { data } = await apiClient.post('/signup', { name, email, password });
            if (!data?.success) {
            setErrors({ auth: data?.message || 'Error en el registro' });
            return;
            }

            // Registro exitoso, iniciar sesión automáticamente con el proveedor de credenciales
            const loginResult = await signIn('credentials', {
              redirect: false,
              email,
              password,
              callbackUrl: '/usuarios'
            });
            
            if (loginResult?.ok) {
              // Redirección manual después de inicio de sesión exitoso
              window.location.href = '/usuarios';
            } else if (loginResult?.error) {
              console.error('Error al iniciar sesión automáticamente:', loginResult.error);
              // Usar el mensaje de error devuelto por NextAuth/backend
              setErrors({ auth: loginResult.error }); 
            } else {
              onClose();
            }
          } catch (error) {
            console.error('Error en el registro:', error);
            setErrors({ auth: 'Error en el servidor. Intente nuevamente.' });
          }
          break;
        case 'forgot':
          await forgotPasswordSchema.parseAsync({ email });
          // Aquí implementarías la lógica de recuperación de contraseña
          console.log('Password reset attempt:', { email });
          break;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        console.error('Error inesperado:', error);
        setErrors({ auth: 'Error inesperado. Intente nuevamente.' });
      }
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  // Early return DESPUÉS de declarar todos los hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] min-h-screen p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'login' && 'Iniciar Sesión'}
            {activeTab === 'register' && 'Registro'}
            {activeTab === 'forgot' && 'Recuperar Contraseña'}
          </h2>
          <button
            onClick={onClose}
            disabled={isCredentialsLoading || isGoogleLoading || isFacebookLoading}
            className={`text-gray-400 hover:text-white transition-colors ${(isCredentialsLoading || isGoogleLoading || isFacebookLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            disabled={isCredentialsLoading || isGoogleLoading || isFacebookLoading}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'login' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'} ${(isCredentialsLoading || isGoogleLoading || isFacebookLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            disabled={isCredentialsLoading || isGoogleLoading || isFacebookLoading}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'register' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'} ${(isCredentialsLoading || isGoogleLoading || isFacebookLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.auth && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg mb-4">
              {errors.auth}
            </div>
          )}
          {activeTab === 'register' && (
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          {(activeTab === 'login' || activeTab === 'register') && (
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}
          {activeTab === 'register' && (
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={isCredentialsLoading || isGoogleLoading || isFacebookLoading}
            className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity ${isCredentialsLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isCredentialsLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Cargando...</span>
              </div>
            ) : (
              <>
                {activeTab === 'login' && 'Iniciar Sesión'}
                {activeTab === 'register' && 'Registrarse'}
                {activeTab === 'forgot' && 'Enviar instrucciones'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#111827] text-gray-400">O continuar con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isFacebookLoading || isCredentialsLoading}
              className={`flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors ${isGoogleLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isGoogleLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Cargando...
                </>
              ) : (
                <>
                  <FaGoogle className="mr-2" />
                  Google
                </>
              )}
            </button>
            <button
              onClick={handleFacebookLogin}
              disabled={isGoogleLoading || isFacebookLoading || isCredentialsLoading}
              className={`flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors ${isFacebookLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isFacebookLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Cargando...
                </>
              ) : (
                <>
                  <FaFacebook className="mr-2" />
                  Facebook
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setActiveTab('forgot')}
            disabled={isCredentialsLoading || isGoogleLoading || isFacebookLoading}
            className={`w-full mt-4 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium ${(isCredentialsLoading || isGoogleLoading || isFacebookLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;