'use client';

import { useFacebookHashCleaner } from '../lib/auth';

/**
 * Componente que limpia el fragmento #_=_ que Facebook añade a las URLs después de la autenticación
 */
export default function FacebookHashCleaner() {
  // Utilizar el hook personalizado para limpiar el fragmento #_=_
  useFacebookHashCleaner();

  // Este componente no renderiza nada
  return null;
}