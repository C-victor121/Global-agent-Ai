/**
 * Utilidades para la autenticación y manejo de sesiones
 */

import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useEffect } from 'react';

/**
 * Función para iniciar sesión con proveedores sociales
 * @param provider - El proveedor de autenticación ('google' o 'facebook')
 * @param callbackUrl - URL a la que redirigir después del inicio de sesión exitoso
 */
export const loginWithProvider = async (provider: 'google' | 'facebook', callbackUrl: string = '/usuarios') => {
  try {
    // Limpiar cualquier fragmento de URL que pueda causar problemas
    cleanFacebookHash();
    
    console.log(`[Auth] Iniciando sesión con ${provider}, callbackUrl: ${callbackUrl}`);
    
    // Iniciar el proceso de autenticación con el proveedor seleccionado
    const result = await signIn(provider, { 
      callbackUrl,
      redirect: false // No redirigir automáticamente, lo manejaremos manualmente
    });
    
    // Verificar el resultado
    if (result?.ok) {
      // Redirigir manualmente para asegurar que la redirección funcione correctamente
      window.location.href = result.url || callbackUrl;
      return { success: true };
    } else {
      // Manejar errores
      console.error(`Error al iniciar sesión con ${provider}:`, result?.error);
      return { 
        success: false, 
        error: result?.error || `Error al iniciar sesión con ${provider}` 
      };
    }
  } catch (error) {
    console.error(`Error inesperado al iniciar sesión con ${provider}:`, error);
    return { 
      success: false, 
      error: `Error inesperado al iniciar sesión con ${provider}` 
    };
  }
};

/**
 * Función para cerrar sesión
 * @param callbackUrl - URL a la que redirigir después del cierre de sesión
 */
export const logout = async (callbackUrl: string = '/') => {
  try {
    console.log(`[Auth] Cerrando sesión, callbackUrl: ${callbackUrl}`);
    
    // Limpiar cualquier fragmento de URL que pueda causar problemas
    cleanFacebookHash();
    
    const result = await signOut({ callbackUrl, redirect: false });
    console.log('[Auth] Resultado del cierre de sesión:', result);
    
    // Redirigir manualmente para asegurar que la redirección funcione correctamente
    console.log(`[Auth] Redirigiendo a: ${callbackUrl}`);
    window.location.href = callbackUrl;
    
    return { success: true };
  } catch (error) {
    console.error('[Auth] Error al cerrar sesión:', error);
    return { success: false, error: 'Error al cerrar sesión' };
  }
};

/**
 * Función para verificar si un usuario tiene un rol específico
 * @param session - La sesión del usuario
 * @param role - El rol a verificar
 */
export const hasRole = (session: Session | null, role: string): boolean => {
  return session?.user?.role === role;
};

/**
 * Función para verificar si un usuario está autenticado
 * @param session - La sesión del usuario
 */
export const isAuthenticated = (session: Session | null): boolean => {
  return !!session?.user;
};

/**
 * Función para limpiar el fragmento #_=_ que Facebook añade a las URLs después de la autenticación
 * @returns Una función de limpieza para useEffect
 */
export const cleanFacebookHash = (): void => {
  // Verificar si estamos en el navegador
  if (typeof window !== 'undefined') {
    // Verificar si hay un fragmento #_=_ en la URL
    if (window.location.hash === '#_=_') {
      console.log('[Auth] Detectado fragmento #_=_, limpiando URL...');
      
      // Crear una nueva URL sin el fragmento
      const cleanUrl = window.location.href.split('#')[0];
      
      // Reemplazar la URL actual sin recargar la página
      window.history.replaceState(
        null,
        document.title,
        cleanUrl
      );
      
      console.log('[Auth] URL limpiada:', cleanUrl);
    }
  }
};

/**
 * Hook para limpiar automáticamente el fragmento #_=_ de Facebook
 */
export const useFacebookHashCleaner = (): void => {
  useEffect(() => {
    cleanFacebookHash();
  }, []);
};