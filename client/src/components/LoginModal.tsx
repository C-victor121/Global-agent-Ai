"use client";

import { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { loginSchema, registerSchema, forgotPasswordSchema } from '../../../shared/validations/auth.schema';
import { ZodError } from 'zod';
import { signIn, useSession } from 'next-auth/react';

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
            setErrors({ auth: 'Credenciales inválidas' });
          } else {
            onClose();
          }
          break;
        case 'register':
          await registerSchema.parseAsync({ name, email, password, confirmPassword });
          
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, email, password })
            });
            
            let data;
            try {
              data = await response.json();
            } catch (jsonError) {
              console.error('Error al procesar la respuesta JSON:', jsonError);
              setErrors({ auth: 'Error en la comunicación con el servidor. Verifique la URL de la API.' });
              return;
            }
            
            if (!data.success) {
              setErrors({ auth: data.message || 'Error en el registro' });
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
              setErrors({ auth: 'Error al iniciar sesión automáticamente' });
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
      }
    }
  };

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
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'login' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'register' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
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
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            {activeTab === 'login' && 'Iniciar Sesión'}
            {activeTab === 'register' && 'Registrarse'}
            {activeTab === 'forgot' && 'Enviar instrucciones'}
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
              onClick={() => signIn('google', { callbackUrl: '/usuarios' })}
              className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              <FaGoogle className="mr-2" />
              Google
            </button>
            <button
              onClick={() => signIn('facebook', { callbackUrl: '/usuarios' })}
              className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              <FaFacebook className="mr-2" />
              Facebook
            </button>
          </div>

          <button
            onClick={() => setActiveTab('forgot')}
            className="w-full mt-4 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;